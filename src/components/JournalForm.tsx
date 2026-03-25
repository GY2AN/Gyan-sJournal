"use client";
// src/components/JournalForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  content: string;
  learnings: string;
  challenges: string;
  reflection: string;
  tags: string;
  published: boolean;
};

type Props = {
  mode: "create" | "edit";
  journalId?: string;
  defaultValues?: Partial<FormData>;
};

export default function JournalForm({ mode, journalId, defaultValues }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: defaultValues?.title ?? "",
    content: defaultValues?.content ?? "",
    learnings: defaultValues?.learnings ?? "",
    challenges: defaultValues?.challenges ?? "",
    reflection: defaultValues?.reflection ?? "",
    tags: defaultValues?.tags ?? "",
    published: defaultValues?.published ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set(key: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      content: form.content,
      learnings: form.learnings || null,
      challenges: form.challenges || null,
      reflection: form.reflection || null,
      tags,
      published: form.published,
    };

    try {
      const res = await fetch(
        mode === "create" ? "/api/journals" : `/api/journals/${journalId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(Array.isArray(data.error) ? data.error[0]?.message : (data.error ?? "Something went wrong"));
      } else {
        setSuccess(mode === "create" ? "Journal entry created!" : "Changes saved!");
        if (mode === "create") {
          setTimeout(() => router.push(`/journal/${data.slug}`), 800);
        } else {
          router.refresh();
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[780px]">
      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid color-mix(in srgb, var(--red) 30%, transparent)" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl text-sm" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>
          {success}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="form-label" htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          required
          className="form-input"
          placeholder="e.g. Finally understood Kubernetes Ingress"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          style={{ fontSize: "1.05rem" }}
        />
      </div>

      {/* Content */}
      <div>
        <label className="form-label" htmlFor="content">
          Content *{" "}
          <span style={{ color: "var(--text3)", fontWeight: 400 }}>(Markdown supported)</span>
        </label>
        <textarea
          id="content"
          required
          className="form-input"
          placeholder={`## What happened today\n\nWrite your full learning entry here. Markdown is supported — use headers, code blocks, lists...\n\n\`\`\`bash\nkubectl get pods -n default\n\`\`\``}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          style={{ minHeight: 280, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88rem", lineHeight: 1.7 }}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="form-label" htmlFor="tags">
          Tags{" "}
          <span style={{ color: "var(--text3)", fontWeight: 400 }}>(comma-separated)</span>
        </label>
        <input
          id="tags"
          type="text"
          className="form-input"
          placeholder="Kubernetes, DevOps, Debugging"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
        />
      </div>

      {/* Three takeaway fields */}
      <div
        className="rounded-[16px] p-6 flex flex-col gap-5"
        style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
          📋 Takeaways (optional but recommended)
        </div>

        <div>
          <label className="form-label" htmlFor="learnings">💡 Key Learnings</label>
          <textarea
            id="learnings"
            className="form-input"
            placeholder="What specific things did you learn today?"
            value={form.learnings}
            onChange={(e) => set("learnings", e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="challenges">😤 Challenges</label>
          <textarea
            id="challenges"
            className="form-input"
            placeholder="What was hard? What confused you?"
            value={form.challenges}
            onChange={(e) => set("challenges", e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="reflection">🪞 Reflection</label>
          <textarea
            id="reflection"
            className="form-input"
            placeholder="What would you do differently? What did this change for you?"
            value={form.reflection}
            onChange={(e) => set("reflection", e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>
      </div>

      {/* Publish toggle + submit */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={form.published}
            onClick={() => set("published", !form.published)}
            className="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ background: form.published ? "var(--green)" : "var(--bg3)" }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: form.published ? "translateX(18px)" : "translateX(2px)" }}
            />
          </button>
          <span className="text-sm font-medium" style={{ color: "var(--text2)" }}>
            {form.published ? "Published" : "Draft — not visible to public"}
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text2)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ borderTopColor: "var(--bg)" }} />
                Saving…
              </>
            ) : mode === "create" ? (
              "Publish Entry →"
            ) : (
              "Save Changes →"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
