import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useTranslation } from "react-i18next";

const HLS_SRC = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

function HlsVideo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
      return undefined;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true });
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    return undefined;
  }, []);
  return <video ref={ref} autoPlay muted loop playsInline className={className} style={style} />;
}
import { motion, useInView, AnimatePresence, useMotionValue, useAnimationFrame } from "framer-motion";
import { AboutSection } from "./AboutSection";
import { FooterSection } from "./FooterSection";

const Typewriter = () => {
  const { t, i18n } = useTranslation();
  const text = t("hero_typewriter");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    let forward = true;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (forward) {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          forward = false;
          timeout = setTimeout(tick, 1800);
          return;
        }
      } else {
        i--;
        setDisplayed(text.slice(0, i));
        if (i <= 0) {
          forward = true;
          timeout = setTimeout(tick, 500);
          return;
        }
      }
      timeout = setTimeout(tick, forward ? 45 : 22);
    };

    timeout = setTimeout(tick, 400);
    return () => clearTimeout(timeout);
  }, [isInView, i18n.language, text]);

  return (
    <p ref={ref} className="text-body max-w-[42ch] !text-[clamp(15px,1.2vw,19px)]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {displayed}
      <span className="inline-block w-px h-[1em] bg-current align-middle ml-0.5 animate-pulse" />
    </p>
  );
};

const products = [
  {
    id: 1,
    name: "LUTs Pack",
    category: "Color Grading",
    price: "R$149,90",
    gradient: "linear-gradient(135deg, #111827 0%, #064e3b 100%)",
  },
  {
    id: 2,
    name: "BenizGrade",
    category: "Color Grading",
    price: "R$299,90",
    gradient: "linear-gradient(135deg, #450a0a 0%, #1e1b4b 100%)",
  },
  {
    id: 3,
    name: "ColorFlow™",
    category: "Color Grading",
    price: "R$249,90",
    gradient: "linear-gradient(135deg, #022c22 0%, #000000 100%)",
  },
  {
    id: 4,
    name: "Lightroom Presets Pack",
    category: "Photo Editing",
    price: "R$124,90",
    gradient: "linear-gradient(135deg, #1c1917 0%, #1e3a8a 100%)",
  },
  {
    id: 5,
    name: "Cinematic Title Templates",
    category: "Motion & Titles",
    price: "R$64,90",
    gradient: "linear-gradient(135deg, #27272a 0%, #171717 100%)",
  },
  {
    id: 6,
    name: "SFX Library",
    category: "Motion & Titles",
    price: "R$99,90",
    gradient: "linear-gradient(135deg, #09090b 0%, #262626 100%)",
  },
];

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const MARQUEE_ITEMS = ["LUTS", "PRESETS", "POWERGRADE", "COLORFLOW™", "SFX", "COLORLAB", "TITLES"];
const MARQUEE_SPEED = 80; // px per second

const MarqueeStrip = () => {
  const groupRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [copies, setCopies] = useState(6);

  useEffect(() => {
    const measure = () => {
      if (groupRef.current) {
        const gw = groupRef.current.offsetWidth;
        if (gw > 0) {
          setCopies(Math.ceil(window.innerWidth / gw) + 3);
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    if (!groupRef.current) return;
    const gw = groupRef.current.offsetWidth;
    if (gw === 0) return;
    let next = x.get() - (delta / 1000) * MARQUEE_SPEED;
    if (next <= -gw) next += gw;
    x.set(next);
  });

  return (
    <div className="w-full border-y border-white/10 py-4 overflow-hidden bg-black relative z-10">
      <motion.div className="flex w-max" style={{ x }}>
        {Array.from({ length: copies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? groupRef : undefined}
            className="flex shrink-0 items-center"
            aria-hidden={i > 0}
          >
            {MARQUEE_ITEMS.map((item) => (
              <span key={item} className="text-eyebrow flex items-center">
                <span className="px-8 py-1 whitespace-nowrap">{item}</span>
                <span className="text-white/20 select-none">—</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Products Grid ────────────────────────────────────────────
const PRODUCTS_LIST = [
  {
    id: 1,
    name: "Cinematic LUTs Pack",
    categoryKey: "cat_color_grading",
    priceKey: "price_luts",
    gradient: "linear-gradient(145deg, #0f172a 0%, #064e3b 100%)",
    glow: "rgba(52,211,153,0.18)",
    slug: "luts",
  },
  {
    id: 2,
    name: "Lifestyle Presets Lightroom",
    categoryKey: "cat_photo_editing",
    priceKey: "price_presets",
    gradient: "linear-gradient(145deg, #1e1b4b 0%, #450a0a 100%)",
    glow: "rgba(167,139,250,0.18)",
    slug: "presets",
  },
  {
    id: 3,
    name: "SFXs Combo",
    categoryKey: "cat_audio_motion",
    priceKey: "price_sfx",
    gradient: "linear-gradient(145deg, #18181b 0%, #292524 100%)",
    glow: "rgba(251,146,60,0.18)",
    slug: "sfx",
  },
];

const beforeGradient =
  "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 40%, #0f0f0f 100%)";
const afterGradient =
  "linear-gradient(160deg, #0d2622 0%, #0a1a2e 35%, #1a0a0a 65%, #2b1500 100%)";

const BeforeAfter = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // 0–100, % from left
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, pct)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full mb-20" data-testid="section-before-after">
      {/* Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-sm select-none touch-none cursor-ew-resize"
        style={{ aspectRatio: "16/9" }}
        data-testid="container-before-after"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* AFTER — base layer, full width */}
        <div className="absolute inset-0" data-testid="visual-after">
          <div className="w-full h-full" style={{ background: afterGradient }} />
          {/* Cinematic teal-orange split light */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 80% at 25% 60%, rgba(0,180,140,0.18) 0%, transparent 70%)" }}
          />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 50% 70% at 78% 40%, rgba(200,100,20,0.22) 0%, transparent 65%)" }}
          />
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)" }}
          />
          {/* Film grain */}
          <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "300px 300px" }}
          />
          {/* "GRADED" badge */}
          <div className="absolute bottom-4 right-4 text-eyebrow" style={{ color: "oklch(0.72 0.16 145)" }}>
            BENIZGRADE
          </div>
          <div className="absolute top-4 right-4 z-20 text-eyebrow text-white/60">
            {t("after_label")}
          </div>
        </div>

        {/* BEFORE — clipped to slider position */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          data-testid="visual-before"
        >
          <div className="w-full h-full" style={{ background: beforeGradient }} />
          {/* Flat, desaturated film grain overlay */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "300px 300px" }}
          />
          {/* Waveform / exposure grid lines */}
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 px-12 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-px bg-white" style={{ opacity: 0.4 + i * 0.08 }} />
            ))}
          </div>
          {/* "RAW" badge */}
          <div className="absolute bottom-4 right-4 text-eyebrow text-white/30">RAW / LOG-C3</div>
          <div className="absolute top-4 left-4 z-20 text-eyebrow text-white/60">
            {t("before_label")}
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="absolute top-0 bottom-0 z-30 w-px bg-white/80 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M8 7l-5 5 5 5" />
              <path d="M16 7l5 5-5 5" />
            </svg>
          </div>
        </div>

        {/* Border frame */}
        <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-sm" />
      </div>
    </div>
  );
};

// ── Product card (shared between carousel and desktop grid) ──
const ProductCard = ({ p }: { p: typeof PRODUCTS_LIST[number] }) => {
  const { t } = useTranslation();
  return (
    <div
      className="group relative w-full aspect-square overflow-hidden rounded-2xl cursor-pointer"
      style={{ background: p.gradient }}
    >
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 60% at 30% 35%, ${p.glow}, transparent 70%)` }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <div className="text-eyebrow mb-1.5 text-white/50">{t(p.categoryKey)}</div>
        <h3 className="font-bold text-base lg:text-lg leading-tight mb-4">{p.name}</h3>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">{t(p.priceKey)}</div>
          <a
            href={`/produto/${p.slug}`}
            className="liquid-glass px-4 py-1.5 rounded-full text-xs font-bold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            {t("see_more")}
          </a>
        </div>
      </div>
    </div>
  );
};

// ── Mobile carousel ───────────────────────────────────────────
const ProductsCarousel = () => {
  const [active, setActive] = useState(0);
  const dragStartX = useRef(0);
  const total = PRODUCTS_LIST.length;

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(total - 1, i + 1));

  const onDragStart = (_: unknown, info: { point: { x: number } }) => {
    dragStartX.current = info.point.x;
  };
  const onDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -40) next();
    else if (info.offset.x > 40) prev();
  };

  return (
    <div className="lg:hidden max-w-sm mx-auto w-full">
      {/* Track */}
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          className="flex"
          animate={{ x: `-${active * 100}%` }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {PRODUCTS_LIST.map((p) => (
            <div key={p.id} className="w-full flex-shrink-0">
              <ProductCard p={p} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5 px-1">
        {/* Prev arrow */}
        <button
          onClick={prev}
          disabled={active === 0}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-opacity duration-200 disabled:opacity-20"
          aria-label="Previous"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-2 items-center">
          {PRODUCTS_LIST.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                background: i === active ? "white" : "rgba(255,255,255,0.3)",
              }}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          disabled={active === total - 1}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-opacity duration-200 disabled:opacity-20"
          aria-label="Next"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const NAV_LINK_DEFS = [
  { href: "#about",    labelKey: "nav_about",    testId: "link-nav-about" },
  { href: "#products", labelKey: "nav_products", testId: "link-nav-products" },
  { href: "#bundles",  labelKey: "nav_bundles",  testId: "link-nav-bundles" },
];

const LANGUAGES = [
  { code: "en", flag: "🇺🇸" },
  { code: "pt", flag: "🇧🇷" },
  { code: "es", flag: "🇪🇸" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  return (
    <>
      <nav className="fixed top-0 w-full z-40 px-[var(--spacing-pad)] py-6 flex items-center">
        <a href="#" className="text-brand flex items-center gap-2" data-testid="link-home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8">
            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
          </svg>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 text-eyebrow absolute left-1/2 -translate-x-1/2">
          {NAV_LINK_DEFS.map(({ href, labelKey, testId }) => (
            <a key={href} href={href} className="hover:text-muted transition-colors duration-300" data-testid={testId}>
              {t(labelKey)}
            </a>
          ))}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden ml-auto flex flex-col gap-[5px] p-2 z-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <motion.span className="block w-6 h-px bg-white origin-center" animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
          <motion.span className="block w-6 h-px bg-white" animate={open ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.15 }} />
          <motion.span className="block w-6 h-px bg-white origin-center" animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
        </button>
      </nav>

      {/* Language selector — outside mix-blend scope so emojis render correctly */}
      <div className="fixed top-0 right-[var(--spacing-pad)] z-50 py-4 hidden md:flex items-center">
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="bg-transparent outline-none text-xl cursor-pointer rounded-full px-3 py-1"
          style={{
            color: "white",
            WebkitAppearance: "none",
            appearance: "none",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {LANGUAGES.map(({ code, flag }) => (
            <option key={code} value={code} style={{ background: "#000", fontSize: "1rem" }}>
              {flag}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center gap-10 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          >
            {NAV_LINK_DEFS.map(({ href, labelKey, testId }, i) => (
              <motion.a
                key={href} href={href} data-testid={testId}
                className="text-section text-white"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                onClick={() => setOpen(false)}
              >
                {t(labelKey)}
              </motion.a>
            ))}
            {/* Language selector for mobile */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <select
                value={i18n.language}
                onChange={(e) => { i18n.changeLanguage(e.target.value); setOpen(false); }}
                className="bg-transparent border-none outline-none text-3xl cursor-pointer"
                style={{ color: "white", WebkitAppearance: "none", appearance: "none" }}
              >
                {LANGUAGES.map(({ code, flag }) => (
                  <option key={code} value={code} style={{ background: "#000", fontSize: "1rem" }}>
                    {flag}
                  </option>
                ))}
              </select>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const { t } = useTranslation();
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white w-full">
      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-50 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--spacing-pad)", margin: 0, top: 0 }}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="/hero-background.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: "transform" }}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl">
          <Reveal>
            <div className="text-eyebrow mb-6 text-accent" style={{ textTransform: "none" }}>@diegofmurta</div>
            <h1 className="text-hero mb-8">
              DIEGO<br />FONTES<br />MURTA
            </h1>
            <Typewriter />
          </Reveal>
        </div>
      </section>

      {/* Nav — rendered after hero in DOM so it doesn't push hero down */}
      <Nav />

      {/* Marquee */}
      <MarqueeStrip />

      {/* About Section */}
      <AboutSection />

      {/* Products Section */}
      {/* Before / After — white background */}
      <section id="before-after" className="px-[var(--spacing-pad)] py-32 bg-neutral-950 relative z-10 border-t border-white/10">
        <Reveal>
          <BeforeAfter />
        </Reveal>
      </section>

      {/* Products */}
      <section id="products" className="px-[var(--spacing-pad)] py-32 bg-black relative z-10 border-t border-white/10 overflow-hidden">
        <HlsVideo className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" style={{ zIndex: 0 }} />
        <div className="relative z-10">
        <Reveal>
          <h2 className="text-section mb-24">{t("products_title")}</h2>
        </Reveal>
        {/* ── Mobile carousel ────────────────────────────────── */}
        <ProductsCarousel />

        {/* ── Desktop grid ───────────────────────────────────── */}
        <div className="hidden lg:grid grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
          {PRODUCTS_LIST.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      {/* Featured Bundle */}
      <section id="bundles" className="w-full bg-neutral-950 py-32 px-[var(--spacing-pad)] border-y border-white/10 relative z-10">
        <Reveal>
          <div className="flex justify-center mb-10">
            <span className="liquid-glass pulse-glow text-eyebrow px-4 py-1.5 rounded-full">{t("best_seller")}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div className="aspect-square max-w-sm mx-auto w-full bg-black border border-white/10 relative overflow-hidden flex items-center justify-center p-12">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent"></div>
              <h2 className="text-hero text-center mix-blend-overlay opacity-30">CREATOR</h2>
            </div>

            <div>
              <h2 className="text-section mb-6">CREATOR COMBO</h2>
              <p className="text-body mb-8">{t("bundle_desc")}</p>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold">{t("price_bundle")}</span>
                <span className="text-muted line-through">{t("price_bundle_original")}</span>
                <span className="liquid-glass px-3 py-1 text-xs font-bold text-accent rounded-full">{t("save", { percent: 31 })}</span>
              </div>
              <button
                className="w-full sm:w-auto liquid-glass-primary font-bold py-4 px-12 rounded-full"
                data-testid="button-get-bundle"
              >
                {t("bundle_cta")}
              </button>
            </div>
          </div>
        </Reveal>
      </section>



      {/* Footer */}
      <footer className="pt-32 px-[var(--spacing-pad)] bg-black relative z-10">
        <Reveal>
          <h2 className="text-footer mb-16 text-center lg:text-left" style={{ whiteSpace: "pre-line" }}>
            {t("lets_create")}
          </h2>
        </Reveal>
      </footer>
      <FooterSection />
    </div>
  );
}
