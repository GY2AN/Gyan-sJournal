// src/app/journal/page.tsx
import { prisma } from "@/lib/prisma";
import JournalCard from "@/components/JournalCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal — Gyan Prakash",
  description: "All learning journal entries — wins, confusions, and reflections.",
};

export default async function JournalIndexPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const tag = searchParams.tag;

  const journals = await prisma.journal.findMany({
    where: {
      published: true,
      ...(tag ? { tags: { has: tag } } : {}),
    },
    select: { id: true, title: true, slug: true, content: true, tags: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  // Collect all tags for filter pills
  const allTags = await prisma.journal
    .findMany({ where: { published: true }, select: { tags: true } })
    .then((entries) => [...new Set(entries.flatMap((e) => e.tags))].sort());

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: "60px clamp(1.5rem,8vw,8rem) 80px" }}>
        <div className="section-label">Journal</div>
        <h1
          className="mb-3"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: "var(--text)",
          }}
        >
          Learning Log
        </h1>
        <p className="text-base leading-relaxed max-w-[560px] mb-10" style={{ color: "var(--text2)" }}>
          {journals.length} {journals.length === 1 ? "entry" : "entries"} —
          honest, unfiltered notes from daily study sessions.
        </p>

        {/* Tag filter pills */}
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10">
            <a
              href="/journal"
              className="text-xs font-medium px-3 py-1.5 rounded-full no-underline transition-all duration-200"
              style={{
                background: !tag ? "var(--text)" : "var(--surface)",
                color: !tag ? "var(--bg)" : "var(--text2)",
                border: "1px solid var(--border)",
              }}
            >
              All
            </a>
            {allTags.map((t) => (
              <a
                key={t}
                href={`/journal?tag=${encodeURIComponent(t)}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full no-underline transition-all duration-200"
                style={{
                  background: tag === t ? "var(--text)" : "var(--surface)",
                  color: tag === t ? "var(--bg)" : "var(--text2)",
                  border: "1px solid var(--border)",
                }}
              >
                {t}
              </a>
            ))}
          </div>
        )}

        {journals.length === 0 ? (
          <div
            className="text-center py-20 rounded-[20px]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-base mb-1" style={{ color: "var(--text2)" }}>No entries found{tag ? ` for "${tag}"` : ""}.</p>
            {tag && (
              <a href="/journal" className="text-sm" style={{ color: "var(--accent)" }}>
                Clear filter
              </a>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-[760px]">
            {journals.map((journal) => (
              <JournalCard key={journal.id} journal={journal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
