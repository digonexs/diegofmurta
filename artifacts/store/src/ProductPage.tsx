import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", flag: "🇺🇸" },
  { code: "pt", flag: "🇧🇷" },
  { code: "es", flag: "🇪🇸" },
];

// ── Per-product data ─────────────────────────────────────────
interface ProductData {
  slug: string;
  name: string;
  categoryKey: string;
  tagline: string;
  description: string;
  priceKey: string;
  gradient: string;
  glow: string;
  accentColor: string;
  badge: string;
  features: { icon: string; title: string; desc: string }[];
  specs: { label: string; value: string }[];
  includes: { label: string; count: string }[];
}

const PRODUCTS: Record<string, ProductData> = {
  luts: {
    slug: "luts",
    name: "Cinematic LUTs Pack",
    categoryKey: "cat_color_grading",
    tagline: "Professional film looks for every scene.",
    description:
      "30+ handcrafted LUTs engineered from real film stock and LOG-C3 footage. Compatible with DaVinci Resolve, Premiere Pro, Final Cut Pro and any software that reads .cube files.",
    priceKey: "price_luts",
    gradient: "linear-gradient(145deg, #0f172a 0%, #022c22 60%, #064e3b 100%)",
    glow: "rgba(52,211,153,0.22)",
    accentColor: "oklch(0.72 0.16 145)",
    badge: "COLOR GRADING",
    features: [
      {
        icon: "◈",
        title: "30+ LUTs",
        desc: "From bleach bypass to teal-orange split, every mood covered.",
      },
      {
        icon: "▣",
        title: "LOG-C3 & S-Log Support",
        desc: "Built for flat log profiles. Apply directly to LOG footage.",
      },
      {
        icon: "◉",
        title: ".cube Format",
        desc: "Industry-standard format. Works in Resolve, Premiere, FCPX.",
      },
      {
        icon: "◎",
        title: "Intensity Control",
        desc: "Stack and reduce opacity for subtle or heavy grades.",
      },
      {
        icon: "◇",
        title: "Film Grain Presets",
        desc: "Matching grain textures included for each look.",
      },
      {
        icon: "◈",
        title: "Lifetime Updates",
        desc: "New LUTs added every season. Yours forever.",
      },
    ],
    specs: [
      { label: "Format", value: ".cube / .3dl" },
      { label: "Compatibility", value: "DaVinci · Premiere · FCPX · Lightroom" },
      { label: "Color Space", value: "LOG-C3, S-Log2/3, Rec.709" },
      { label: "Delivery", value: "Instant download" },
    ],
    includes: [
      { label: "LUTs", count: "30+" },
      { label: "Grain Textures", count: "8" },
      { label: "PDF Guide", count: "1" },
    ],
  },
  presets: {
    slug: "presets",
    name: "Lifestyle Presets",
    categoryKey: "cat_photo_editing",
    tagline: "Your signature look. One click.",
    description:
      "50+ Lightroom presets for lifestyle, portrait and travel photography. Designed to work on mobile and desktop across different lighting conditions and skin tones.",
    priceKey: "price_presets",
    gradient: "linear-gradient(145deg, #1e1b4b 0%, #2d1b3d 50%, #450a0a 100%)",
    glow: "rgba(167,139,250,0.22)",
    accentColor: "oklch(0.78 0.16 295)",
    badge: "PHOTO EDITING",
    features: [
      {
        icon: "◈",
        title: "50+ Presets",
        desc: "Warm, cool, moody, airy — a full spectrum of lifestyle looks.",
      },
      {
        icon: "▣",
        title: "Mobile & Desktop",
        desc: "One download works in Lightroom CC on phone and desktop.",
      },
      {
        icon: "◉",
        title: "Skin Tone Safe",
        desc: "Carefully balanced to preserve natural skin tones across ethnicities.",
      },
      {
        icon: "◎",
        title: "All Lighting",
        desc: "Golden hour, overcast, indoor — tested in every condition.",
      },
      {
        icon: "◇",
        title: ".xmp + .lrtemplate",
        desc: "Both formats included for max compatibility.",
      },
      {
        icon: "◈",
        title: "Lifetime Updates",
        desc: "New seasonal packs added over time. Yours forever.",
      },
    ],
    specs: [
      { label: "Format", value: ".xmp + .lrtemplate" },
      { label: "Compatibility", value: "Lightroom CC · Lightroom Classic · Mobile" },
      { label: "Delivery", value: "Instant download" },
      { label: "License", value: "Personal & commercial use" },
    ],
    includes: [
      { label: "Presets", count: "50+" },
      { label: "Install Guide", count: "1" },
      { label: "Before/After Pack", count: "10" },
    ],
  },
  sfx: {
    slug: "sfx",
    name: "SFXs Combo",
    categoryKey: "cat_audio_motion",
    tagline: "Sound design that moves people.",
    description:
      "200+ royalty-free cinematic sound effects curated for short films, social media, reels and commercial work. Every SFX is professionally recorded and mastered at 48kHz/24-bit.",
    priceKey: "price_sfx",
    gradient: "linear-gradient(145deg, #18181b 0%, #1c1210 60%, #292524 100%)",
    glow: "rgba(251,146,60,0.22)",
    accentColor: "oklch(0.72 0.16 50)",
    badge: "AUDIO & MOTION",
    features: [
      {
        icon: "◈",
        title: "200+ SFX",
        desc: "Whooshes, impacts, transitions, ambiences and more.",
      },
      {
        icon: "▣",
        title: "48kHz / 24-bit",
        desc: "Studio-grade audio quality, ready for broadcast and cinema.",
      },
      {
        icon: "◉",
        title: "Royalty-Free",
        desc: "Use in client work, YouTube, social, film — no attribution needed.",
      },
      {
        icon: "◎",
        title: "WAV Format",
        desc: "Uncompressed .wav files. Drop directly into any DAW or NLE.",
      },
      {
        icon: "◇",
        title: "Organized Packs",
        desc: "Sorted by category: impacts, risers, ambience, UI, foley.",
      },
      {
        icon: "◈",
        title: "Lifetime Updates",
        desc: "More sounds added regularly. Yours forever.",
      },
    ],
    specs: [
      { label: "Format", value: ".wav (48kHz / 24-bit)" },
      { label: "Compatibility", value: "Any DAW · Premiere · Resolve · FCPX" },
      { label: "License", value: "Royalty-free, commercial use" },
      { label: "Delivery", value: "Instant download" },
    ],
    includes: [
      { label: "SFX Files", count: "200+" },
      { label: "Categories", count: "5" },
      { label: "Bonus Loops", count: "10" },
    ],
  },
};

// ── Shared atoms ─────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ── ProductPage ──────────────────────────────────────────────
export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const product = PRODUCTS[slug ?? ""];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <p className="text-section text-white/20">404</p>
        <a href="/" className="text-eyebrow text-white/60 hover:text-white transition-colors">
          ← Back to store
        </a>
      </div>
    );
  }

  const { i18n } = useTranslation();
  const price = t(product.priceKey);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 w-full z-40 px-[var(--spacing-pad)] py-6 flex items-center justify-between"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
      >
        {/* Left — back link always visible */}
        <a
          href="/"
          className="flex items-center gap-2 text-eyebrow text-white/50 hover:text-white transition-colors duration-300"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 flex-shrink-0">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">BACK TO STORE</span>
        </a>

        {/* Center — camera icon + brand */}
        <a href="/" className="text-brand flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8">
            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
          </svg>
          <span className="hidden sm:inline">DIEGO FONTES</span>
        </a>

        {/* Right — language selector always visible */}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="bg-transparent outline-none text-xl cursor-pointer rounded-full px-3 py-1"
          style={{ color: "white", WebkitAppearance: "none", appearance: "none", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          {LANGUAGES.map(({ code, flag }) => (
            <option key={code} value={code} style={{ background: "#000", fontSize: "1rem" }}>
              {flag}
            </option>
          ))}
        </select>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-end px-[var(--spacing-pad)] pb-20 pt-32 overflow-hidden"
        style={{ background: product.gradient }}
      >
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 65% 55% at 20% 35%, ${product.glow}, transparent 65%)` }} />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: NOISE, backgroundSize: "200px" }} />
        {/* Bottom scrim */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="text-eyebrow mb-6" style={{ color: product.accentColor }}>
              {t(product.categoryKey)} &nbsp;·&nbsp; {product.badge}
            </div>
            <h1 className="text-hero mb-6 max-w-[12ch]">{product.name}</h1>
            <p className="text-body !text-white/60 !max-w-[38ch] mb-12 !text-[clamp(16px,1.4vw,22px)]">
              {product.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#buy"
                className="liquid-glass-primary font-bold py-4 px-12 rounded-full text-black text-sm tracking-widest uppercase"
              >
                Get it — {price}
              </a>
              <a
                href="#features"
                className="liquid-glass py-4 px-10 rounded-full text-sm font-bold tracking-widest uppercase"
              >
                See what's inside
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────────── */}
      <section className="bg-black py-24 px-[var(--spacing-pad)] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="text-body !max-w-[56ch] !text-[clamp(16px,1.4vw,20px)]">
              {product.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="bg-black py-24 px-[var(--spacing-pad)] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-section mb-16">WHAT'S INSIDE</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {product.features.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="bg-black p-8 flex flex-col gap-4 h-full">
                  <span className="text-2xl" style={{ color: product.accentColor }}>{f.icon}</span>
                  <h3 className="font-bold text-base tracking-tight">{f.title}</h3>
                  <p className="text-body !max-w-none !text-[clamp(13px,1vw,15px)]">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUDES ─────────────────────────────────────────── */}
      <section
        className="py-24 px-[var(--spacing-pad)] border-t border-white/10 relative overflow-hidden"
        style={{ background: product.gradient }}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: NOISE, backgroundSize: "200px" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${product.glow}, transparent 70%)` }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-section mb-16">INCLUDES</h2>
          </Reveal>
          <div className="grid grid-cols-3 gap-px bg-white/10">
            {product.includes.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-black/40 backdrop-blur-sm p-10 flex flex-col items-center text-center gap-3">
                  <span className="font-extrabold tracking-tight" style={{ fontSize: "clamp(40px, 7vw, 90px)", lineHeight: 1, color: product.accentColor }}>
                    {item.count}
                  </span>
                  <span className="text-eyebrow text-white/60">{item.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECS ────────────────────────────────────────────── */}
      <section className="bg-black py-20 px-[var(--spacing-pad)] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="text-eyebrow mb-8 text-white/40">SPECIFICATIONS</h2>
          </Reveal>
          <div className="divide-y divide-white/10">
            {product.specs.map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-center justify-between py-5 gap-8">
                  <span className="text-eyebrow text-white/40">{s.label}</span>
                  <span className="font-bold text-sm text-right">{s.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUY CTA ──────────────────────────────────────────── */}
      <section id="buy" className="bg-neutral-950 py-32 px-[var(--spacing-pad)] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <Reveal>
            <div className="text-eyebrow text-white/40 mb-2">READY TO LEVEL UP?</div>
            <h2 className="text-section mb-2">{product.name}</h2>
            <div className="flex items-baseline gap-3 justify-center mb-8">
              <span style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {price}
              </span>
              <span className="text-eyebrow text-white/40">one-time</span>
            </div>
            <a
              href="#"
              className="liquid-glass-primary font-bold py-5 px-16 rounded-full text-black text-sm tracking-widest uppercase inline-block"
              onClick={(e) => e.preventDefault()}
            >
              Get Instant Access
            </a>
            <p className="text-eyebrow text-white/30 mt-6">Instant download · Lifetime access · No subscription</p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-black border-t border-white/10 px-[var(--spacing-pad)] pt-16 pb-8 overflow-hidden">
        <div className="overflow-hidden mb-8">
          <p className="text-footer whitespace-nowrap text-white/10 leading-none select-none">
            LET'S&nbsp;CREATE.
          </p>
        </div>
        <div className="flex items-center justify-between text-eyebrow text-white/30">
          <span>© {new Date().getFullYear()} Diego Fontes. All rights reserved.</span>
          <a href="/" className="hover:text-white transition-colors duration-300">
            ← Back to store
          </a>
        </div>
      </footer>

    </div>
  );
}
