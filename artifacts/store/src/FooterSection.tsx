import { useTranslation } from "react-i18next";

const SOCIAL_ICONS = [
  {
    href: "https://instagram.com/diegofmurta",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com/@diegofmurta",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 15, height: 15 }}>
        <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.6 2.8 12 2.8 12 2.8s-4.6 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.4 21.7 12 21.7 12 21.7s4.6 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l6.5 3.6-6.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/diegofmurta",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 15, height: 15 }}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/diegofmurta",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 15, height: 15 }}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    ),
  },
];

const NAV_LINK_KEYS = [
  { labelKey: "footer_link_about",        href: "#about" },
  { labelKey: "footer_link_products",     href: "#products" },
  { labelKey: "footer_link_bundles",      href: "#bundles" },
  { labelKey: "footer_link_before_after", href: "#before-after" },
];

const CONNECT_LINKS = [
  { label: "Instagram",  href: "https://instagram.com/diegofmurta" },
  { label: "YouTube",    href: "https://youtube.com/@diegofmurta" },
  { label: "X (Twitter)", href: "https://x.com/diegofmurta" },
];

const cameraPath1 = "M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z";
const cameraPath2 = "M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0";

export function FooterSection() {
  const { t } = useTranslation();

  return (
    <section style={{ background: "#000", padding: "48px 24px 0", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`
        .fs-nav-link:hover { color: rgba(255,255,255,0.6) !important; }
        .fs-social-icon:hover { background: #222 !important; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.8) !important; }
        .fs-subscribe-btn:hover { background: #fff !important; color: #000 !important; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(255,255,255,0.1) !important; }
        @media (max-width: 860px) {
          .fs-wrapper { grid-template-columns: 1fr !important; }
          .fs-left { min-height: auto !important; }
        }
        @media (max-width: 560px) {
          .fs-right { padding: 24px !important; }
          .fs-nav-cols { gap: 40px !important; }
          .fs-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
          .fs-subscribe-row { width: 100% !important; }
          .fs-lucky-graphic { right: 12px !important; top: -28px !important; }
          .fs-lucky-cube { width: 72px !important; height: 72px !important; }
        }
      `}</style>

      <div
        className="fs-wrapper"
        style={{ maxWidth: 1150, margin: "0 auto", display: "grid", gridTemplateColumns: "350px 1fr", gap: 16, alignItems: "stretch" }}
      >
        {/* ── Left card ── */}
        <div
          className="fs-left"
          style={{
            position: "relative", minHeight: 340, borderRadius: 28, padding: 32, overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)", background: "#0a0a0a",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img
            src="/about-color.jpg"
            alt=""
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
          />
          {/* Scrim for readability */}
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.5) 100%)", zIndex: 1 }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 16 16" fill="white" style={{ width: 14, height: 14 }}>
                <path d={cameraPath1} /><path d={cameraPath2} />
              </svg>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>diegofmurta</span>
          </div>

          {/* Social row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, position: "relative", zIndex: 2 }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.3px" }}>{t("stay_in_touch")}</span>
            <div style={{ display: "flex", gap: 7 }}>
              {SOCIAL_ICONS.map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="fs-social-icon"
                  style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.35)", transition: "background 0.2s, transform 0.15s, box-shadow 0.2s", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right card ── */}
        <div
          className="fs-right"
          style={{ background: "#111", borderRadius: 28, padding: 40, overflow: "visible", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Floating badge */}
          <div className="fs-lucky-graphic" style={{ position: "absolute", top: -36, right: 40, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <div className="fs-lucky-cube" style={{ width: 96, height: 96, borderRadius: 22, transform: "rotate(-10deg)", background: "linear-gradient(135deg, #5b9ffb 0%, #1e5dd7 55%, #1448be 100%)", boxShadow: "inset 3px 3px 8px rgba(255,255,255,0.35), inset -3px -3px 12px rgba(0,0,0,0.18), 8px 14px 28px rgba(20,72,200,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 16 16" fill="white" style={{ width: 42, height: 42, transform: "rotate(10deg)", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))" }}>
                <path d={cameraPath1} /><path d={cameraPath2} />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 6, alignItems: "center", transform: "rotate(-4deg)", marginTop: 4 }}>
              <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, color: "rgba(255,255,255,0.35)" }}>
                <path d="M3 20 C 6 14, 10 9, 18 5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 5 L 12 5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 5 L 18 11" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{t("feeling_lucky")}</span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="fs-nav-cols" style={{ display: "flex", gap: 72, paddingTop: 8 }}>
            <div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, fontStyle: "italic", color: "rgba(255,255,255,0.3)", marginBottom: 18 }}>{t("footer_navigation")}</div>
              {NAV_LINK_KEYS.map(({ labelKey, href }) => (
                <a key={labelKey} href={href} className="fs-nav-link" style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 14, textDecoration: "none", transition: "color 0.2s" }}>{t(labelKey)}</a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, fontStyle: "italic", color: "rgba(255,255,255,0.3)", marginBottom: 18 }}>{t("footer_connect")}</div>
              {CONNECT_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className="fs-nav-link" style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 14, textDecoration: "none", transition: "color 0.2s" }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="fs-bottom" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 48 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} Diego Fontes. {t("footer_copyright")}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
