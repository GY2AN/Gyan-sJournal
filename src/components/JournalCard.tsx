"use client";
// src/components/JournalCard.tsx
import Link from "next/link";
import { getDateParts } from "@/lib/utils";
import type { Journal } from "@prisma/client";

type Props = {
  journal: Pick<Journal, "id" | "title" | "slug" | "content" | "tags" | "createdAt">;
};

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  good:      { bg: "var(--green-dim)", color: "var(--green)" },
  milestone: { bg: "var(--green-dim)", color: "var(--green)" },
  hard:      { bg: "var(--amber-dim)", color: "var(--amber)" },
  shipped:   { bg: "var(--green-dim)", color: "var(--green)" },
  default:   { bg: "var(--bg2)",       color: "var(--text3)" },
};

export default function JournalCard({ journal }: Props) {
  const { day, month } = getDateParts(journal.createdAt);
  const excerpt = journal.content.replace(/[#*`\[\]]/g, "").slice(0, 140) + "…";

  return (
    <Link
      href={`/journal/${journal.slug}`}
      className="block group"
      style={{ textDecoration: "none" }}
    >
      <div
        className="flex gap-6 items-start p-6 rounded-[20px] transition-all duration-200 group-hover:translate-x-1 cursor-pointer"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow)";
        }}
      >
        {/* Date */}
        <div className="text-center min-w-[48px] flex-shrink-0">
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "1.8rem",
              lineHeight: 1,
              color: "var(--text)",
            }}
          >
            {day}
          </div>
          <div className="text-[0.65rem] uppercase tracking-widest mt-0.5" style={{ color: "var(--text3)" }}>
            {month}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch mx-1" style={{ background: "var(--border)" }} />

        {/* Body */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold mb-1.5 leading-snug" style={{ color: "var(--text)" }}>
            {journal.title}
          </h3>
          <p className="text-[0.875rem] leading-relaxed mb-3" style={{ color: "var(--text2)" }}>
            {excerpt}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {journal.tags.map((tag) => (
              <span
                key={tag}
                className="text-[0.7rem] font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: "var(--bg2)", color: "var(--text3)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div
          className="flex-shrink-0 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center"
          style={{ color: "var(--text3)" }}
        >
          →
        </div>
      </div>
    </Link>
  );
}
