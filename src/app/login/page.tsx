"use client";
// src/app/login/page.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)", paddingTop: 60 }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 no-underline">
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.3rem", color: "var(--text)" }}>
              Gyan Prakash
            </span>
          </Link>
          <h1
            className="mb-2"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "2rem",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            Sign in to manage your journal
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[20px] p-8"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {error && (
            <div
              className="mb-5 p-3 rounded-xl text-sm"
              style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid var(--red)" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="form-input"
                placeholder="gyan@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 mt-1 disabled:opacity-60"
              style={{ background: "var(--text)", color: "var(--bg)" }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ borderTopColor: "var(--bg)" }} />
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          {/* GitHub OAuth hint */}
          {process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true" && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text3)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <button
                onClick={() => signIn("github", { callbackUrl })}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
              >
                𝗚 Continue with GitHub
              </button>
            </>
          )}
        </div>

        {/* Demo credentials hint */}
        <div
          className="mt-5 p-4 rounded-xl text-center text-xs"
          style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text3)" }}
        >
          <strong style={{ color: "var(--text2)" }}>Demo credentials</strong>
          <br />
          Email: <code style={{ color: "var(--accent)" }}>gyan@example.com</code>
          &nbsp;· Password: <code style={{ color: "var(--accent)" }}>admin123</code>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "var(--text3)" }}>
          <Link href="/" style={{ color: "var(--text2)" }} className="no-underline hover:underline">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
