"use client";
// src/components/Footer.tsx
export default function Footer() {
  const socials = [
    { label: "𝗚", href: "https://github.com", title: "GitHub" },
    { label: "in", href: "https://linkedin.com", title: "LinkedIn" },
    { label: "𝕏", href: "https://twitter.com", title: "Twitter" },
  ];

  return (
    <>
      <style>{`
        .social-link:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; color: var(--text) !important; }
      `}</style>
      <footer
        className="flex flex-wrap justify-between items-center gap-6"
        style={{ borderTop: "1px solid var(--border)", padding: "3rem clamp(1.5rem,8vw,8rem)" }}
      >
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", color: "var(--text)" }}>
            Gyan Prakash
          </div>
          <div className="text-[0.82rem] mt-1" style={{ color: "var(--text3)" }}>
            Learning DevOps, one commit at a time.
          </div>
        </div>

        <div className="flex gap-3">
          {socials.map((s) => (
            <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title}
              className="social-link w-9 h-9 rounded-[12px] flex items-center justify-center text-sm font-semibold no-underline transition-all duration-200"
              style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text2)", boxShadow: "var(--shadow)" }}>
              {s.label}
            </a>
          ))}
        </div>

        <div className="w-full text-[0.78rem]" style={{ color: "var(--text3)" }}>
          © {new Date().getFullYear()} Gyan Prakash · Built with curiosity and caffeine ☕
        </div>
      </footer>
    </>
  );
}
