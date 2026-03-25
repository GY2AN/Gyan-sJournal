"use client";
// src/components/Hero.tsx

import Link from "next/link";
import { useEffect, useRef } from "react";

type HeroProps = {
  journalCount: number;
  projectCount?: number;
  topicCount?: number;
};

export default function Hero({ journalCount, projectCount = 12, topicCount = 5 }: HeroProps) {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-start relative overflow-hidden"
      style={{ padding: "100px clamp(1.5rem,8vw,8rem) 80px" }}
    >
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="orb orb-1 absolute rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, #2563eb44, transparent 70%)",
            filter: "blur(80px)", opacity: 0.35,
            top: -100, right: -100,
            animation: "float1 8s ease-in-out infinite",
          }}
        />
        <div
          className="orb orb-2 absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: "radial-gradient(circle, #16a34a33, transparent 70%)",
            filter: "blur(80px)", opacity: 0.35,
            bottom: 0, left: "10%",
            animation: "float2 10s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[680px]" style={{ animation: "fadeUp .6s .1s both" }}>
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest"
          style={{ background: "var(--accent-dim)", color: "var(--accent)", animation: "fadeUp .6s .1s both" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--accent)", animation: "pulse 2s infinite" }}
          />
          Learning in Public
        </div>

        {/* Name */}
        <h1
          className="leading-none mb-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            animation: "fadeUp .6s .2s both",
          }}
        >
          Gyan Prakash
        </h1>

        {/* Tagline */}
        <p
          className="mb-6"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(1.3rem, 3vw, 2rem)",
            color: "var(--text2)",
            fontStyle: "italic",
            animation: "fadeUp .6s .3s both",
          }}
        >
          Learning in public. One day at a time.
        </p>

        {/* Description */}
        <p
          className="text-[1.05rem] leading-relaxed max-w-[520px] mb-10"
          style={{ color: "var(--text2)", animation: "fadeUp .6s .4s both" }}
        >
          Documenting my journey from curious learner to DevOps engineer — one commit, one blog post, one experiment at a time.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap" style={{ animation: "fadeUp .6s .5s both" }}>
          <Link
            href="#journal"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-85 hover:-translate-y-0.5"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            📔 Read Journal
          </Link>
          <Link
            href="#learning"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            🗺 Explore Learning
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-16" style={{ animation: "fadeUp .6s .6s both" }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "var(--text)", lineHeight: 1 }}>
              {journalCount}
            </div>
            <div className="text-xs mt-1 tracking-wide" style={{ color: "var(--text3)" }}>Journal Entries</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "var(--text)", lineHeight: 1 }}>
              {projectCount}
            </div>
            <div className="text-xs mt-1 tracking-wide" style={{ color: "var(--text3)" }}>Projects Built</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "var(--text)", lineHeight: 1 }}>
              {topicCount}
            </div>
            <div className="text-xs mt-1 tracking-wide" style={{ color: "var(--text3)" }}>Topics Explored</div>
          </div>
        </div>
      </div>
    </section>
  );
}
