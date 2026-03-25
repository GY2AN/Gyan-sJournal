// src/app/journal/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: { id: string } };

async function getJournal(slug: string) {
  return prisma.journal.findFirst({
    where: { slug, published: true },
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journal = await getJournal(params.id);
  if (!journal) return { title: "Not Found" };
  return {
    title: `${journal.title} — Gyan Prakash`,
    description: journal.content.slice(0, 160),
  };
}

export async function generateStaticParams() {
  const journals = await prisma.journal.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return journals.map((j) => ({ id: j.slug }));
}

export default async function JournalPage({ params }: Props) {
  const journal = await getJournal(params.id);
  if (!journal) notFound();

  const siblings = await prisma.journal.findMany({
    where: { published: true, id: { not: journal.id } },
    select: { slug: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <>
      <style>{`
        .back-link:hover { opacity: 0.7; }
        .sibling-link { transition: transform 0.2s ease; }
        .sibling-link:hover { transform: translateX(4px); }
        .sibling-arrow { opacity: 0; transition: opacity 0.2s; }
        .sibling-link:hover .sibling-arrow { opacity: 1; }
      `}</style>

      <div style={{ paddingTop: 80 }}>
        <div style={{ padding: "2rem clamp(1.5rem,8vw,8rem) 0" }}>
          <Link
            href="/#journal"
            className="back-link inline-flex items-center gap-2 text-sm font-medium no-underline"
            style={{ color: "var(--text2)" }}
          >
            ← Back to Journal
          </Link>
        </div>

        <article style={{ padding: "3rem clamp(1.5rem,8vw,8rem) 80px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <header className="mb-10">
              <div className="flex gap-2 flex-wrap mb-5">
                {journal.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mb-4 leading-tight"
                style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "var(--text)" }}>
                {journal.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                    {journal.user.name?.[0]?.toUpperCase() ?? "G"}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text2)" }}>
                    {journal.user.name ?? "Gyan Prakash"}
                  </span>
                </div>
                <span style={{ color: "var(--text3)" }}>·</span>
                <time className="text-sm" style={{ color: "var(--text3)" }}>{formatDate(journal.createdAt)}</time>
                <span style={{ color: "var(--text3)" }}>·</span>
                <span className="text-sm" style={{ color: "var(--text3)" }}>
                  {Math.ceil(journal.content.split(" ").length / 200)} min read
                </span>
              </div>
            </header>

            <div className="mb-10" style={{ height: 1, background: "var(--border)" }} />

            <div className="mb-12">
              <MarkdownRenderer content={journal.content} />
            </div>

            {(journal.learnings || journal.challenges || journal.reflection) && (
              <div className="rounded-[20px] p-8 mb-12"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h2 className="mb-6 text-lg font-semibold" style={{ color: "var(--text)" }}>Takeaways</h2>
                <div className="flex flex-col gap-6">
                  {journal.learnings && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span>💡</span>
                        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>Key Learnings</h3>
                      </div>
                      <p className="text-[0.9rem] leading-relaxed" style={{ color: "var(--text2)" }}>{journal.learnings}</p>
                    </div>
                  )}
                  {journal.challenges && (
                    <>
                      <div style={{ height: 1, background: "var(--border)" }} />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span>😤</span>
                          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>Challenges</h3>
                        </div>
                        <p className="text-[0.9rem] leading-relaxed" style={{ color: "var(--text2)" }}>{journal.challenges}</p>
                      </div>
                    </>
                  )}
                  {journal.reflection && (
                    <>
                      <div style={{ height: 1, background: "var(--border)" }} />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span>🪞</span>
                          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>Reflection</h3>
                        </div>
                        <p className="leading-relaxed italic"
                          style={{ color: "var(--text2)", fontFamily: "'Instrument Serif', serif", fontSize: "1.05rem" }}>
                          "{journal.reflection}"
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {siblings.length > 0 && (
              <>
                <div style={{ height: 1, background: "var(--border)", marginBottom: "3rem" }} />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--text3)" }}>
                    More Entries
                  </h3>
                  <div className="flex flex-col gap-3">
                    {siblings.map((s) => (
                      <Link key={s.slug} href={`/journal/${s.slug}`}
                        className="sibling-link flex items-center justify-between p-4 rounded-xl no-underline"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                        <div>
                          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{s.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>{formatDate(s.createdAt)}</div>
                        </div>
                        <span className="sibling-arrow text-sm" style={{ color: "var(--text3)" }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
