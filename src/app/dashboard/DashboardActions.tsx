"use client";
// src/app/dashboard/DashboardActions.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  journalId: string;
  slug: string;
  published: boolean;
};

export default function DashboardActions({ journalId, slug, published }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this journal entry? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/journals/${journalId}`, { method: "DELETE" });
    setDeleting(false);
    router.refresh();
  }

  async function handleTogglePublish() {
    setToggling(true);
    await fetch(`/api/journals/${journalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setToggling(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* View */}
      <Link
        href={`/journal/${slug}`}
        className="text-xs px-2.5 py-1.5 rounded-lg no-underline transition-all duration-150"
        style={{ color: "var(--text2)", border: "1px solid var(--border)", background: "var(--surface)" }}
        title="View"
      >
        👁
      </Link>

      {/* Edit */}
      <Link
        href={`/dashboard/edit/${journalId}`}
        className="text-xs px-2.5 py-1.5 rounded-lg no-underline transition-all duration-150"
        style={{ color: "var(--text2)", border: "1px solid var(--border)", background: "var(--surface)" }}
        title="Edit"
      >
        ✏️
      </Link>

      {/* Toggle publish */}
      <button
        onClick={handleTogglePublish}
        disabled={toggling}
        className="text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
        style={{ color: published ? "var(--amber)" : "var(--green)", border: "1px solid var(--border)", background: "var(--surface)" }}
        title={published ? "Unpublish" : "Publish"}
      >
        {toggling ? "…" : published ? "⏸" : "▶"}
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
        style={{ color: "var(--red)", border: "1px solid var(--border)", background: "var(--surface)" }}
        title="Delete"
      >
        {deleting ? "…" : "🗑"}
      </button>
    </div>
  );
}
