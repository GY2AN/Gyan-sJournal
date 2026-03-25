// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import DashboardActions from "./DashboardActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Gyan Prakash" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const journals = await prisma.journal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, tags: true, published: true, createdAt: true, updatedAt: true },
  });

  const stats = {
    total: journals.length,
    published: journals.filter((j) => j.published).length,
    drafts: journals.filter((j) => !j.published).length,
  };

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: "60px clamp(1.5rem,8vw,8rem) 80px" }}>
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="section-label">Dashboard</div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2rem,4vw,3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--text)",
              }}
            >
              Welcome back, {session.user.name?.split(" ")[0] ?? "Gyan"} 👋
            </h1>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium no-underline transition-all duration-200 hover:opacity-85"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            + New Entry
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-[480px]">
          {[
            { label: "Total", value: stats.total, color: "var(--accent)", bg: "var(--accent-dim)" },
            { label: "Published", value: stats.published, color: "var(--green)", bg: "var(--green-dim)" },
            { label: "Drafts", value: stats.drafts, color: "var(--amber)", bg: "var(--amber-dim)" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-[16px]"
              style={{ background: s.bg, border: `1px solid color-mix(in srgb, ${s.color} 20%, transparent)` }}
            >
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: s.color, opacity: 0.7 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Journal list */}
        {journals.length === 0 ? (
          <div
            className="text-center py-20 rounded-[20px]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl mb-3">📝</p>
            <p className="text-base font-medium mb-1" style={{ color: "var(--text)" }}>No journal entries yet</p>
            <p className="text-sm mb-5" style={{ color: "var(--text2)" }}>Start documenting your learning journey</p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium no-underline"
              style={{ background: "var(--text)", color: "var(--bg)" }}
            >
              Write your first entry →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-[760px]">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="flex items-center gap-4 p-5 rounded-[16px] group"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* Status dot */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: journal.published ? "var(--green)" : "var(--amber)" }}
                  title={journal.published ? "Published" : "Draft"}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                      {journal.title}
                    </span>
                    {!journal.published && (
                      <span
                        className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ background: "var(--amber-dim)", color: "var(--amber)" }}
                      >
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: "var(--text3)" }}>
                      {formatDate(journal.createdAt)}
                    </span>
                    {journal.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg2)", color: "var(--text3)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <DashboardActions journalId={journal.id} slug={journal.slug} published={journal.published} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
