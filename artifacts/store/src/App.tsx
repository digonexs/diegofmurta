import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const products = [
  {
    id: 1,
    name: "LUTs Pack",
    category: "Color Grading",
    price: "$29.90",
    gradient: "linear-gradient(135deg, #111827 0%, #064e3b 100%)",
  },
  {
    id: 2,
    name: "BenizGrade",
    category: "Color Grading",
    price: "$59.90",
    gradient: "linear-gradient(135deg, #450a0a 0%, #1e1b4b 100%)",
  },
  {
    id: 3,
    name: "ColorFlow™",
    category: "Color Grading",
    price: "$49.90",
    gradient: "linear-gradient(135deg, #022c22 0%, #000000 100%)",
  },
  {
    id: 4,
    name: "Lightroom Presets Pack",
    category: "Photo Editing",
    price: "$24.90",
    gradient: "linear-gradient(135deg, #1c1917 0%, #1e3a8a 100%)",
  },
  {
    id: 5,
    name: "Cinematic Title Templates",
    category: "Motion & Titles",
    price: "$12.90",
    gradient: "linear-gradient(135deg, #27272a 0%, #171717 100%)",
  },
  {
    id: 6,
    name: "SFX Library",
    category: "Motion & Titles",
    price: "$19.90",
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

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-50 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 px-[var(--spacing-pad)] py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-brand flex items-center gap-2 cursor-pointer" data-testid="link-home">
          DIEGO FONTES
          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
        </div>
        <div className="hidden md:flex gap-8 text-eyebrow">
          <a href="#products" className="hover:text-muted transition-colors duration-300" data-testid="link-nav-products">PRODUCTS</a>
          <a href="#bundles" className="hover:text-muted transition-colors duration-300" data-testid="link-nav-bundles">BUNDLES</a>
          <a href="#colorlab" className="hover:text-muted transition-colors duration-300" data-testid="link-nav-colorlab">COLORLAB</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative w-full h-[100svh] flex flex-col justify-end px-[var(--spacing-pad)] pb-24">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-neutral-900" style={{ backgroundImage: "linear-gradient(to bottom, #111, #000)" }}></div>
          <div className="absolute inset-0 hero-overlay" />
        </div>
        
        <div className="relative z-10 max-w-7xl">
          <Reveal>
            <div className="text-eyebrow mb-6 text-accent">THE DIGITAL ATELIER</div>
            <h1 className="text-hero mb-8">
              COLOR.<br />GRADE.<br />CREATE.
            </h1>
            <p className="text-body max-w-[42ch]">
              A curated collection of premium tools from a working director. Built for obsessive cinematic creators who want exact science, not guesswork.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full border-y border-white/10 py-4 overflow-hidden flex whitespace-nowrap bg-black relative z-10">
        <div className="flex animate-marquee text-eyebrow space-x-12">
          {Array(10).fill("LUTS — PRESETS — POWERGRADE — COLORFLOW™ — SFX — COLORLAB — TITLES — ").map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <section id="products" className="px-[var(--spacing-pad)] py-32 bg-black relative z-10">
        <Reveal>
          <div className="text-eyebrow mb-4 text-accent">THE COLLECTION</div>
          <h2 className="text-section mb-16">DIGITAL TOOLS</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.1}>
              <div 
                className="group relative w-full aspect-[3/4] md:aspect-[4/5] bg-neutral-900 overflow-hidden cursor-pointer"
                data-testid={`card-product-${product.id}`}
              >
                <div 
                  className="absolute inset-0 transition-transform duration-[1.1s] ease-[cubic-bezier(.16,.84,.34,1)] group-hover:scale-[1.045] group-hover:brightness-[0.82]"
                  style={{ background: product.gradient }}
                />
                <div className="absolute inset-0 card-scrim" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="text-eyebrow mb-2 opacity-80">{product.category}</div>
                  <h3 className="text-card-title mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold">{product.price}</span>
                    <button 
                      className="pill-bg px-6 py-2 rounded-full text-sm font-bold tracking-tight opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-black"
                      data-testid={`button-get-${product.id}`}
                    >
                      Get this →
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Bundle */}
      <section id="bundles" className="w-full bg-neutral-950 py-32 px-[var(--spacing-pad)] border-y border-white/10 relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-black border border-white/10 relative overflow-hidden flex items-center justify-center p-12">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent"></div>
              <h2 className="text-hero text-center mix-blend-overlay opacity-30">ESSENTIALS</h2>
            </div>
            
            <div>
              <div className="text-eyebrow mb-6 text-accent">BUNDLE</div>
              <h2 className="text-section mb-6">CREATOR'S<br/>ESSENTIALS</h2>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold">$89.90</span>
                <span className="text-muted line-through">$226.29</span>
                <span className="pill-bg px-3 py-1 text-xs font-bold text-accent rounded-full border border-white/10">SAVE 60%</span>
              </div>
              <p className="text-body mb-8">
                The complete arsenal. Includes LUTs Pack, BenizGrade, ColorFlow™, Lightroom Presets, Title Templates, and SFX Library. Everything you need to finish a film.
              </p>
              <button 
                className="w-full sm:w-auto bg-white text-black font-bold py-4 px-12 rounded-full hover:bg-neutral-200 transition-colors"
                data-testid="button-get-bundle"
              >
                Get the Bundle
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* App Section */}
      <section id="colorlab" className="py-32 px-[var(--spacing-pad)] relative z-10 bg-black">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-eyebrow mb-4 text-accent">MOBILE</div>
            <h2 className="text-section mb-6">COLORLAB</h2>
            <p className="text-body mx-auto">
              Professional color science in your pocket. Cinematic presets, adjustable intensity, and direct exports.
            </p>
          </div>
          
          <div className="flex justify-center mb-16">
            <div className="w-[300px] h-[600px] border-4 border-neutral-800 rounded-[3rem] overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-20"></div>
              <div className="absolute inset-x-4 inset-y-12 bg-neutral-900 rounded-2xl flex flex-col items-center justify-center p-6 border border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-blue-900 mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-white/50"></div>
                </div>
                <h3 className="font-bold text-xl mb-2">ColorLab</h3>
                <p className="text-sm text-muted text-center mb-8">Select a preset to begin</p>
                <div className="w-full space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-full h-12 bg-white/5 rounded-lg border border-white/5"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="pill-bg px-8 py-4 rounded-full font-bold border border-white/10 hover:bg-white/10 transition-colors" data-testid="button-app-monthly">
              $9.90 / month
            </button>
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-neutral-200 transition-colors" data-testid="button-app-yearly">
              $59.90 / year
            </button>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 py-16 bg-neutral-950 relative z-10 px-[var(--spacing-pad)]">
        <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto gap-8 text-center sm:text-left">
          {[
            { v: "12.000+", l: "criadores" },
            { v: "8", l: "produtos" },
            { v: "4", l: "plataformas" },
            { v: "1", l: "diretor" }
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div>
                <div className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{stat.v}</div>
                <div className="text-eyebrow text-muted">{stat.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-8 px-[var(--spacing-pad)] bg-black relative z-10">
        <Reveal>
          <h2 className="text-footer mb-16 text-center lg:text-left">
            LET'S<br/>CREATE.
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-sm font-bold text-muted gap-4">
            <div>© {new Date().getFullYear()} Diego Fontes. All rights reserved.</div>
            <a href="https://instagram.com/diegofmurta" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" data-testid="link-social">
              @diegofmurta
            </a>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
