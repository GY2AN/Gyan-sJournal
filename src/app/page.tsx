// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import JournalList from "@/components/JournalList";

// Static sections (About, Learning, Projects, Timeline, Notes, Newsletter)
// are rendered inline below to keep the design pixel-perfect.

async function getJournals() {
  return prisma.journal.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, content: true, tags: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

export default async function HomePage() {
  const journals = await getJournals();

  return (
    <>
      <Hero journalCount={journals.length || 47} />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "80px clamp(1.5rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}>
        <div className="section-label">About</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", marginBottom: "1rem" }}>
          Who I am &amp; why I share
        </h2>
        <p className="text-base leading-relaxed max-w-[560px] mb-12" style={{ color: "var(--text2)" }}>
          A self-taught developer on a mission to master DevOps engineering, one honest learning log at a time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px]">
          {[
            { icon: "👋", title: "Who I Am", body: "I'm Gyan — a developer deeply passionate about infrastructure, automation, and the craft of building reliable systems. I believe writing publicly about what I learn accelerates understanding and builds community." },
            { icon: "🎯", title: "My Goal", body: "Become a well-rounded DevOps engineer with deep knowledge of cloud infrastructure, CI/CD, containers, and observability. Currently targeting a professional role by end of 2025." },
            { icon: "📚", title: "Currently Learning", tags: ["Kubernetes", "Helm Charts", "AWS EKS", "Terraform", "ArgoCD", "Prometheus"] },
            { icon: "💡", title: "My Philosophy", body: "Learning in public means sharing the messy middle — not just polished outcomes. Every confused moment, every breakthrough, every 'aha!' belongs in the open. It's how we grow together." },
          ].map((card) => (
            <div key={card.title} className="card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text3)" }}>
                {card.icon} {card.title}
              </h3>
              {card.body && <p className="text-[0.95rem] leading-relaxed" style={{ color: "var(--text2)" }}>{card.body}</p>}
              {card.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {card.tags.map((tag, i) => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: i < 4 ? "var(--accent-dim)" : "var(--bg2)", color: i < 4 ? "var(--accent)" : "var(--text2)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── LEARNING DASHBOARD ── */}
      <section id="learning" style={{ padding: "80px clamp(1.5rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Learning Dashboard</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", marginBottom: "1rem" }}>
          Knowledge Map
        </h2>
        <p className="text-base leading-relaxed max-w-[560px] mb-8" style={{ color: "var(--text2)" }}>
          Organized by topic — notes, experiments, and tutorials from my day-to-day exploration.
        </p>
        <div className="flex gap-2 flex-wrap mb-8" id="topicFilters">
          {["All Topics", "DevOps", "Containers", "Frontend", "Systems"].map((f, i) => (
            <button key={f} className={`filter-btn text-xs font-medium px-4 py-1.5 rounded-full border transition-all duration-200 ${i === 0 ? "active-filter" : ""}`}
              style={{ border: "1px solid var(--border)", background: i === 0 ? "var(--text)" : "var(--surface)", color: i === 0 ? "var(--bg)" : "var(--text2)", cursor: "pointer" }}
              data-filter={f === "All Topics" ? "all" : f.toLowerCase()}>
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🛠", color: "#dbeafe", title: "DevOps Fundamentals", desc: "CI/CD pipelines, GitOps workflows, infrastructure as code, and platform engineering concepts.", notes: 23, tutorials: 8, labs: 4, progress: 68, cat: "devops", label: "↗ Active", pcolor: "var(--accent)" },
            { icon: "🐳", color: "#dcfce7", title: "Docker", desc: "Containerization fundamentals, multi-stage builds, compose, networking, and image optimization.", notes: 18, tutorials: 12, labs: 6, progress: 85, cat: "containers", label: "✓ Strong", pcolor: "var(--green)" },
            { icon: "☸️", color: "#fef3c7", title: "Kubernetes", desc: "Cluster architecture, workloads, services, Helm charts, RBAC, and production patterns.", notes: 31, tutorials: 15, labs: 7, progress: 52, cat: "containers", label: "📖 Deep Dive", pcolor: "var(--amber)" },
            { icon: "⚛️", color: "#f3e8ff", title: "Frontend Engineering", desc: "React, Next.js, performance optimization, accessibility, and modern CSS techniques.", notes: 14, tutorials: 6, labs: 3, progress: 40, cat: "frontend", label: "⏸ Paused", pcolor: "#a855f7" },
            { icon: "⚙️", color: "#ffe4e6", title: "System Design", desc: "Distributed systems, CAP theorem, load balancing, caching strategies, and scalability patterns.", notes: 11, tutorials: 4, labs: 0, progress: 30, cat: "systems", label: "🆕 Starting", pcolor: "#f43f5e" },
            { icon: "☁️", color: "#e0f2fe", title: "Cloud & AWS", desc: "EC2, S3, IAM, VPC, EKS, RDS, Lambda, and cloud architecture best practices.", notes: 19, tutorials: 9, labs: 5, progress: 45, cat: "devops", label: "↗ Active", pcolor: "#0ea5e9" },
          ].map((t) => (
            <div key={t.title} className="card p-6" data-cat={t.cat}>
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl mb-4" style={{ background: t.color }}>{t.icon}</div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>{t.title}</h3>
              <p className="text-[0.85rem] leading-relaxed mb-4" style={{ color: "var(--text2)" }}>{t.desc}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {[`${t.notes} notes`, `${t.tutorials} tutorials`, ...(t.labs ? [`${t.labs} labs`] : [])].map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg2)", color: "var(--text3)" }}>{tag}</span>
                ))}
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
                <div className="h-full rounded-full" style={{ width: `${t.progress}%`, background: t.pcolor }} />
              </div>
              <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text3)" }}>
                <span>{t.progress}% through roadmap</span>
                <span>{t.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOURNAL (dynamic) ── */}
      <JournalList journals={journals} />

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "80px clamp(1.5rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Projects &amp; Experiments</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", marginBottom: "1rem" }}>
          What I've Built
        </h2>
        <p className="text-base leading-relaxed max-w-[560px] mb-10" style={{ color: "var(--text2)" }}>
          Hands-on experiments, side projects, and learning projects that turned concepts into reality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "K8s Homelab Cluster", status: "live", desc: "A 3-node k3s cluster running on Raspberry Pi 4s with Traefik ingress, cert-manager, and ArgoCD for GitOps. Completely self-hosted.", stack: ["k3s", "ArgoCD", "Traefik", "Raspberry Pi"] },
            { title: "CI/CD Pipeline Starter", status: "live", desc: "A reusable GitHub Actions workflow template for Node.js apps — lint, test, Dockerize, push to GHCR, deploy to k8s. Zero-to-deployed in 5 minutes.", stack: ["GitHub Actions", "Docker", "Node.js", "GHCR"] },
            { title: "Observability Stack", status: "wip", desc: "Prometheus + Grafana + Loki + Tempo deployed via Helm. Monitoring dashboards for all homelab services with alerting via Alertmanager.", stack: ["Prometheus", "Grafana", "Loki", "Helm"] },
          ].map((p) => (
            <div key={p.title} className="card p-6 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold" style={{ color: "var(--text)" }}>{p.title}</h3>
                <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: p.status === "live" ? "var(--green-dim)" : "var(--amber-dim)", color: p.status === "live" ? "var(--green)" : "var(--amber)" }}>
                  {p.status}
                </span>
              </div>
              <p className="text-[0.875rem] leading-relaxed flex-1 mb-4" style={{ color: "var(--text2)" }}>{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.stack.map(s => (
                  <span key={s} className="text-[0.68rem] px-1.5 py-0.5 rounded-md" style={{ fontFamily: "'JetBrains Mono', monospace", background: "var(--bg3)", color: "var(--text2)" }}>{s}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <a href="#" className="text-xs font-medium flex items-center gap-1 no-underline" style={{ color: "var(--accent)" }}>⬡ GitHub</a>
                <a href="#" className="text-xs font-medium flex items-center gap-1 no-underline" style={{ color: "var(--accent)" }}>✦ Write-up</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline" style={{ padding: "80px clamp(1.5rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Growth Timeline</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", marginBottom: "1rem" }}>
          The Journey So Far
        </h2>
        <p className="text-base leading-relaxed max-w-[560px] mb-10" style={{ color: "var(--text2)" }}>
          Milestones and moments that mark real progress — not just hours spent, but things actually shipped.
        </p>
        <div className="max-w-[640px]">
          {[
            { dot: "current", date: "March 2025 · Now", title: "Deep diving Kubernetes & GitOps", desc: "ArgoCD, Helm, RBAC, network policies, and production-grade cluster patterns. Goal: AWS EKS certification." },
            { dot: "done", date: "January 2025", title: "Built first Kubernetes cluster", desc: "Set up k3s on bare metal, deployed first workloads, configured ingress, got a real app running end-to-end." },
            { dot: "done", date: "November 2024", title: "Mastered Docker & containerization", desc: "Multi-stage builds, Docker Compose, networking, volumes, security best practices, and image optimization." },
            { dot: "done", date: "September 2024", title: "Deployed first app to cloud (AWS EC2)", desc: "A Node.js API with Nginx reverse proxy, Let's Encrypt SSL, and a CI/CD pipeline." },
            { dot: "done", date: "July 2024", title: "Started Docker", desc: "First container. First Dockerfile. The beginning of everything changing." },
            { dot: "start", date: "June 2024", title: "Decided to learn DevOps publicly", desc: "Started this journal. Committed to building in the open — raw and unfiltered." },
          ].map((item, i, arr) => (
            <div key={item.title} className="grid gap-4 relative pb-8" style={{ gridTemplateColumns: "24px 1fr" }}>
              {i < arr.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px" style={{ background: "var(--border)" }} />
              )}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] flex-shrink-0 mt-0.5 z-10"
                style={{
                  border: `2px solid ${item.dot === "current" ? "var(--green)" : item.dot === "done" ? "var(--accent)" : "var(--border)"}`,
                  background: item.dot === "current" ? "var(--green-dim)" : item.dot === "done" ? "var(--accent-dim)" : "var(--surface)",
                  animation: item.dot === "current" ? "glow 2s infinite" : "none",
                }}>
                {item.dot === "done" ? "✓" : item.dot === "current" ? "●" : "🚩"}
              </div>
              <div>
                <div className="text-xs mb-1 tracking-wider" style={{ color: "var(--text3)" }}>{item.date}</div>
                <div className="text-[0.95rem] font-semibold mb-1" style={{ color: "var(--text)" }}>{item.title}</div>
                <div className="text-[0.85rem] leading-relaxed" style={{ color: "var(--text2)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOTES ── */}
      <section id="notes" style={{ padding: "80px clamp(1.5rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}>
        <div className="section-label">Knowledge Base</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", marginBottom: "1rem" }}>
          Notes &amp; Second Brain
        </h2>
        <p className="text-base leading-relaxed max-w-[560px] mb-10" style={{ color: "var(--text2)" }}>
          Structured notes, cheatsheets, and references I keep coming back to. My externalized memory.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { cat: "Kubernetes", title: "kubectl Cheatsheet", code: "kubectl get pods -n <ns>\nkubectl describe svc <name>\nkubectl exec -it <pod> -- sh", desc: "The 20 commands I use 80% of the time. Annotated with when and why to use each.", updated: "2 days ago", time: "5 min" },
            { cat: "Docker", title: "Multi-stage Build Patterns", desc: "How to structure Dockerfiles for production — builder stages, distroless base images, layer caching, and size reduction tips.", updated: "1 week ago", time: "8 min" },
            { cat: "DevOps", title: "CI/CD Pipeline Anatomy", desc: "Breaking down every stage of a production pipeline — triggers, build, test, security scan, artifact storage, deploy, verify, rollback.", updated: "2 weeks ago", time: "12 min" },
            { cat: "Systems", title: "Linux Networking Basics", code: "ss -tulpn\nip route show\niptables -L -v -n", desc: "Networking fundamentals every DevOps engineer must know — sockets, routing, firewall rules, DNS resolution.", updated: "3 weeks ago", time: "15 min" },
            { cat: "AWS", title: "IAM Mental Model", desc: "How I finally understood IAM: principals, policies, roles, trust relationships, and the difference between identity-based and resource-based policies.", updated: "1 month ago", time: "10 min" },
            { cat: "Helm", title: "Writing Reusable Charts", desc: "Template helpers, named templates, _helpers.tpl, values schema validation, and chart packaging best practices.", updated: "5 days ago", time: "7 min" },
          ].map((n) => (
            <div key={n.title} className="card p-5 cursor-pointer">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--accent)" }}>{n.cat}</div>
              <h3 className="text-[0.95rem] font-semibold mb-2" style={{ color: "var(--text)" }}>{n.title}</h3>
              {n.code && (
                <pre className="text-[0.75rem] rounded-lg p-2.5 mb-3 overflow-x-auto" style={{ fontFamily: "'JetBrains Mono', monospace", background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)" }}>{n.code}</pre>
              )}
              <p className="text-[0.82rem] leading-relaxed mb-3" style={{ color: "var(--text2)" }}>{n.desc}</p>
              <div className="text-xs" style={{ color: "var(--text3)" }}>Updated {n.updated} · {n.time} read</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="newsletter" style={{ padding: "80px clamp(1.5rem,8vw,8rem)", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[480px] mx-auto text-center">
          <div className="section-label" style={{ display: "block", textAlign: "center" }}>Stay Connected</div>
          <h2 className="mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", letterSpacing: "-0.02em", color: "var(--text)" }}>
            Follow My Journey
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text2)" }}>
            Get weekly updates on what I'm learning, building, and breaking. No spam, just honest DevOps progress.
          </p>
          {/* <form className="flex gap-2 flex-wrap justify-center" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="form-input flex-1 min-w-[200px]" style={{ maxWidth: 280 }} />
            <button type="submit" className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-85"
              style={{ background: "var(--text)", color: "var(--bg)" }}>
              Subscribe →
            </button>
          </form> */}
          <form className="flex gap-2 flex-wrap justify-center"></form>
        </div>
      </section>

      {/* Topic filter + scroll reveal script */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Topic filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => {
              b.style.background = 'var(--surface)';
              b.style.color = 'var(--text2)';
              b.style.borderColor = 'var(--border)';
            });
            btn.style.background = 'var(--text)';
            btn.style.color = 'var(--bg)';
            const filter = btn.dataset.filter;
            document.querySelectorAll('[data-cat]').forEach(card => {
              card.style.display = filter === 'all' || card.dataset.cat === filter ? '' : 'none';
            });
          });
        });
        // Scroll reveal
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      `}} />
    </>
  );
}
