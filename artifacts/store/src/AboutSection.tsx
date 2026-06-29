import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────
// GLSL — Vertex shader
// ─────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
varying   vec2 v_uv;
void main() {
  v_uv        = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`.trim();

// ─────────────────────────────────────────────────────────────
// GLSL — Fragment shader
//   Techniques used:
//   · 2D Simplex Noise  (Stefan Gustavson, public domain)
//   · Fractional Brownian Motion (5 octaves)
//   · Domain-warped FBM (Inigo Quilez) for organic, non-repeating patterns
//   · object-fit:cover UV mapping in shader
//   · Liquid mouse/touch displacement: noise lookup is pushed toward cursor
// ─────────────────────────────────────────────────────────────
const FRAG = `
precision highp float;

uniform float     u_time;
uniform vec2      u_mouse;      // [0,1] canvas space, Y-up (WebGL convention)
uniform float     u_influence;  // 0–1, ramped by interaction, decays at rest
uniform vec2      u_resolution; // canvas pixel dimensions
uniform float     u_imgAspect;  // naturalWidth / naturalHeight of source images
uniform sampler2D u_img1;       // about-black.jpg (default layer)
uniform sampler2D u_img2;       // about-color.jpg (revealed layer)

varying vec2 v_uv;

// ── Simplex Noise 2D ─────────────────────────────────────────
vec3 _p(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float sn(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i   = floor(v + dot(v, C.yy));
  vec2 x0  = v - i + dot(i, C.xx);
  vec2 i1  = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy  -= i1;
  i = mod(i, 289.0);
  vec3 p = _p(_p(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ── FBM — 5 octaves, output remapped to [0, 1] ───────────────
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * sn(p); p *= 2.01; a *= 0.5; }
  return v * 0.5 + 0.5;
}

// ── Domain-warped FBM (Inigo Quilez) ─────────────────────────
// Produces intricate, non-repeating organic patterns.
float warp(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p               + t * 0.11),
    fbm(p + vec2(3.7, 1.5) + t * 0.09)
  );
  return fbm(p + 2.5 * q);
}

// ── object-fit: cover UV mapping ─────────────────────────────
// Scales and centres the image so it fills the canvas without distortion.
vec2 coverUV(vec2 uv, float canvasAsp, float imgAsp) {
  if (canvasAsp > imgAsp) {
    // canvas wider: image scales to width, crops top/bottom
    float s = imgAsp / canvasAsp;
    return vec2(uv.x, uv.y * s + (1.0 - s) * 0.5);
  } else {
    // canvas taller: image scales to height, crops sides
    float s = canvasAsp / imgAsp;
    return vec2(uv.x * s + (1.0 - s) * 0.5, uv.y);
  }
}

void main() {
  float ca  = u_resolution.x / u_resolution.y;
  vec2  cuv = coverUV(v_uv, ca, u_imgAspect);

  // Slower time = noise drifts gently, no rapid threshold crossings
  float t = u_time * 0.06;

  // ── Interaction-only reveal ───────────────────────────────
  // Default: 100% black & white. Colour only appears on interaction.

  float dist  = distance(v_uv, u_mouse);
  // Larger radius (0.55 UV units) for a generous reveal area
  float local = smoothstep(0.55, 0.0, dist) * u_influence;

  // Push noise domain toward cursor → liquid organic shape
  vec2  push = normalize(u_mouse - v_uv + 1e-4) * local * 0.6;
  float mask = warp(v_uv * 1.4 + push + vec2(t * 0.04, t * 0.03), t);

  // Threshold at rest = 1.0 → nothing revealed.
  // Wide edge (0.18) prevents any flicker as noise slowly drifts.
  float thr    = 1.0 - local * 0.80;
  float edge   = 0.18 - local * 0.08;   // softens to 0.10 at full influence
  float reveal = smoothstep(thr - edge, thr + edge, mask);

  // Soft global gate — smooth ramp instead of hard clamp (no pop-in)
  reveal *= smoothstep(0.0, 0.25, u_influence);

  // ── Sample textures ───────────────────────────────────────
  vec4 c1 = texture2D(u_img1, cuv);
  vec4 c2 = texture2D(u_img2, cuv);

  gl_FragColor = mix(c1, c2, reveal);
}
`.trim();

// ─────────────────────────────────────────────────────────────
// WebGL helpers
// ─────────────────────────────────────────────────────────────
function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function loadTexture(gl: WebGLRenderingContext, src: string, unit: number): Promise<number> {
  return new Promise((resolve) => {
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // 1×1 black placeholder so shader renders immediately
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255]));

    const img = new Image();
    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // align with CSS y-axis
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve(img.naturalWidth / img.naturalHeight);
    };
    img.src = src;
  });
}

// ─────────────────────────────────────────────────────────────
// FluidCanvas — manages the WebGL canvas lifecycle
// ─────────────────────────────────────────────────────────────
interface FluidCanvasProps {
  className?: string;
}

function FluidCanvas({ className }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  // Interaction state — mutable refs (no re-render needed)
  const mouseRef         = useRef({ x: 0.5, y: 0.5 });
  const smoothRef        = useRef({ x: 0.5, y: 0.5 });
  const influenceRef     = useRef(0);   // actual value sent to shader
  const targetInfluence  = useRef(0);  // lerp target: 1 on hover, 0 on leave

  // Visibility flag for the render loop (read from closure)
  const visibleRef = useRef(false);
  useEffect(() => { visibleRef.current = isInView; }, [isInView]);

  // ── WebGL setup — runs once on mount ───────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return; // WebGL not supported — canvas stays black

    // Compile and link shaders
    const vs   = compileShader(gl, gl.VERTEX_SHADER,   VERT);
    const fs   = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad (-1..1 in both axes)
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    const U = {
      time:       gl.getUniformLocation(prog, "u_time"),
      mouse:      gl.getUniformLocation(prog, "u_mouse"),
      influence:  gl.getUniformLocation(prog, "u_influence"),
      resolution: gl.getUniformLocation(prog, "u_resolution"),
      imgAspect:  gl.getUniformLocation(prog, "u_imgAspect"),
      img1:       gl.getUniformLocation(prog, "u_img1"),
      img2:       gl.getUniformLocation(prog, "u_img2"),
    };

    // Texture units are constant, set once
    gl.uniform1i(U.img1, 0);
    gl.uniform1i(U.img2, 1);

    let imgAspect = 1;
    let cancelled = false;
    let rafId = 0;
    const t0 = performance.now();

    // ── Render loop ──────────────────────────────────────────
    const render = () => {
      rafId = requestAnimationFrame(render);
      if (cancelled || !visibleRef.current) return;

      // Resize canvas to match CSS size × device pixel ratio (max 2×)
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w   = Math.round(canvas.clientWidth  * dpr);
      const h   = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      // Smooth mouse position (8% lerp per frame)
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.08;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.08;

      // Lerp influence toward target (in: fast 6%, out: slow 3% → ~2 s fade)
      const spd = targetInfluence.current > influenceRef.current ? 0.06 : 0.03;
      influenceRef.current += (targetInfluence.current - influenceRef.current) * spd;

      const t = (performance.now() - t0) / 1000;
      gl.uniform1f(U.time,       t);
      gl.uniform2f(U.mouse,      smoothRef.current.x, smoothRef.current.y);
      gl.uniform1f(U.influence,  influenceRef.current);
      gl.uniform2f(U.resolution, w, h);
      gl.uniform1f(U.imgAspect,  imgAspect);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    rafId = requestAnimationFrame(render);

    // Load textures asynchronously; shader uses black placeholder until ready
    loadTexture(gl, "/about-black.jpg", 0).then(asp => { imgAspect = asp; });
    loadTexture(gl, "/about-color.jpg", 1);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Mouse interaction (desktop) ─────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x =  (e.clientX - r.left) / r.width;
      mouseRef.current.y = 1.0 - (e.clientY - r.top) / r.height;
      targetInfluence.current = 1.0;
    };
    const onLeave = () => { targetInfluence.current = 0.0; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Touch interaction (mobile) ─────────────────────────────
  // Must be imperative to set { passive: false } and call preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x =  (touch.clientX - r.left) / r.width;
      mouseRef.current.y = 1.0 - (touch.clientY - r.top) / r.height;
      targetInfluence.current = 1.0;
    };
    const onTouchEnd = () => { targetInfluence.current = 0.0; };

    canvas.addEventListener("touchmove",  onTouch,    { passive: false });
    canvas.addEventListener("touchend",   onTouchEnd);
    canvas.addEventListener("touchcancel",onTouchEnd);
    return () => {
      canvas.removeEventListener("touchmove",   onTouch);
      canvas.removeEventListener("touchend",    onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AboutSection — public export used in App.tsx
// ─────────────────────────────────────────────────────────────
export function AboutSection() {
  const { t } = useTranslation();
  return (
    <section
      id="about"
      className="relative w-full bg-black py-32 px-[var(--spacing-pad)] z-10 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* ── Fluid image canvas ─────────────────────────────── */}
        <FluidCanvas className="relative w-full aspect-[3/4] overflow-hidden cursor-crosshair rounded-2xl" />

        {/* ── Text content ───────────────────────────────────── */}
        <div className="flex flex-col justify-center">
          <h2 className="text-section mb-10 leading-none">
            {t("about_title")}
          </h2>

          <p className="text-body mb-6 !text-[clamp(15px,1.2vw,19px)]">
            {t("about_p1")}
          </p>

          <p className="text-body mb-6 !text-[clamp(15px,1.2vw,19px)]">
            {t("about_p2")}
          </p>

          <p className="text-body mb-10">
            {t("about_p3")}
          </p>

          {/* Social links */}
          <div className="flex gap-4">
            {[
              {
                href: "https://instagram.com/diegofmurta",
                label: "Instagram",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                href: "https://youtube.com/@diegofmurta",
                label: "YouTube",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.6 2.8 12 2.8 12 2.8s-4.6 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.4 21.7 12 21.7 12 21.7s4.6 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l6.5 3.6-6.5 3.5z" />
                  </svg>
                ),
              },
              {
                href: "https://x.com/diegofmurta",
                label: "X",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-muted hover:text-white hover:border-white/60 transition-colors duration-300"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
