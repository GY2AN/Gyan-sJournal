import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JournalForm from "@/components/JournalForm";
import Link from "next/link";

export default async function EditJournalPage({ params }: any) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/dashboard/edit/${id}`);
  }

  const journal = await prisma.journal.findUnique({
    where: { id },
  });

  if (!journal) notFound();
  if (journal.userId !== session.user.id) redirect("/dashboard");

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

          <div className="section-label">Edit Entry</div>

          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "var(--text)",
            }}
          >
            {journal.title}
          </h1>
        </div>

        <JournalForm
          mode="edit"
          journalId={journal.id}
          defaultValues={{
            title: journal.title,
            content: journal.content,
            learnings: journal.learnings ?? "",
            challenges: journal.challenges ?? "",
            reflection: journal.reflection ?? "",
            tags: journal.tags.join(", "),
            published: journal.published,
          }}
        />
      </section>
    </div>
  );
}