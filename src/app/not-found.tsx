// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ paddingTop: 60 }}
    >
      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "6rem", color: "var(--border)", lineHeight: 1 }}>
        404
      </p>
      <h1
        className="mt-4 mb-3"
        style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "var(--text)" }}
      >
        Page not found
      </h1>
      <p className="text-base mb-8 max-w-[360px]" style={{ color: "var(--text2)" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium no-underline"
        style={{ background: "var(--text)", color: "var(--bg)" }}
      >
        ← Back home
      </Link>
    </div>
  );
}
