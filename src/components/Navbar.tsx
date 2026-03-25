"use client";
// src/components/Navbar.tsx

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const navLinks = [
    { href: "/#about", label: "About" },
    { href: "/#learning", label: "Learning" },
    { href: "/#journal", label: "Journal" },
    { href: "/#projects", label: "Projects" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/#notes", label: "Notes" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-[60px] border-b transition-all duration-300`}
      style={{
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        backdropFilter: "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="font-serif text-xl tracking-tight" style={{ color: "var(--text)", fontFamily: "'Instrument Serif', serif" }}>
        Gyan Prakash
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.85rem] font-medium transition-colors duration-200"
              style={{ color: "var(--text2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text2)")}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-transform duration-200 hover:scale-110"
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface)",
            boxShadow: "var(--shadow)",
          }}
          title="Toggle theme"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {session ? (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-[0.82rem] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                background: "var(--accent-dim)",
                color: "var(--accent)",
              }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-[0.82rem] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text2)",
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden md:flex text-[0.82rem] font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text2)",
            }}
          >
            Sign in
          </Link>
        )}

        {/* Mobile menu toggle */}
        <button
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center"
          style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="absolute top-[60px] left-0 right-0 md:hidden flex flex-col gap-1 p-4"
          style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: "var(--text2)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link href="/login" className="px-3 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--accent)" }} onClick={() => setMenuOpen(false)}>
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
