// src/app/dashboard/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import JournalForm from "@/components/JournalForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Entry — Dashboard" };

export default async function NewJournalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/new");

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ padding: "60px clamp(1.5rem,8vw,8rem) 80px" }}>
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium no-underline mb-6 block"
            style={{ color: "var(--text2)" }}
          >
            ← Back to Dashboard
          </Link>
          <div className="section-label">New Entry</div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "var(--text)",
            }}
          >
            Write a Journal Entry
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text2)" }}>
            Document what you learned today. Be honest — this is for you.
          </p>
        </div>

        <JournalForm mode="create" />
      </section>
    </div>
  );
}
