"use client";
// src/components/JournalList.tsx
import JournalCard from "./JournalCard";
import Link from "next/link";
import type { Journal } from "@prisma/client";

type Props = {
  journals: Pick<Journal, "id" | "title" | "slug" | "content" | "tags" | "createdAt">[];
};

export default function JournalList({ journals }: Props) {
  return (
    <section
      id="journal"
      style={{ padding: "80px clamp(1.5rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}
    >
      <div className="section-label">Journal</div>
      <h2
        className="mb-4"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(2rem,4vw,3rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          color: "var(--text)",
        }}
      >
        Learning Log
      </h2>
      <p className="text-base leading-relaxed max-w-[560px] mb-12" style={{ color: "var(--text2)" }}>
        Honest, unfiltered entries from my daily study sessions — wins, confusions, and reflections.
      </p>

      {journals.length === 0 ? (
        <div
          className="text-center py-16 rounded-[20px]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-base" style={{ color: "var(--text2)" }}>No journal entries yet.</p>
          <p className="text-sm mt-1" style={{ color: "var(--text3)" }}>Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-[760px]">
          {journals.map((journal) => (
            <JournalCard key={journal.id} journal={journal} />
          ))}
        </div>
      )}

      {journals.length > 0 && (
        <div className="mt-8">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--accent)" }}
          >
            View all entries →
          </Link>
        </div>
      )}
    </section>
  );
}
