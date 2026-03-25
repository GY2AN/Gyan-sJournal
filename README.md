# Gyan Prakash — Learn in Public Platform

A full-stack **"Learning in Public"** journal platform built with Next.js 15, PostgreSQL (Neon), Prisma ORM, and NextAuth. Write journals, publish learning entries, and showcase your DevOps growth to the world.

---

## ✨ Features

- 🔐 **Authentication** — Email/password login (+ optional GitHub OAuth)
- 📝 **Journal CRUD** — Create, edit, delete, publish/draft entries
- 📖 **Markdown rendering** — Full MDX-style content with code highlighting
- 🏷 **Tag filtering** — Filter journals by topic
- 🌙 **Dark/light mode** — Persisted in localStorage, no flash
- ⚡ **Server components** — Fast page loads, SEO-friendly
- 📱 **Responsive** — Mobile-first, works on all devices
- 🚀 **Vercel + Neon** — Deploy for free in minutes

---

## 🗂 Project Structure

```
gyan-learns/
├── prisma/
│   ├── schema.prisma          # DB models: User, Journal, Account, Session
│   └── seed.ts                # Demo user + sample journals
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout — fonts, theme, providers
│   │   ├── page.tsx           # Homepage — all static sections + dynamic journal list
│   │   ├── not-found.tsx      # 404 page
│   │   │
│   │   ├── journal/
│   │   │   ├── page.tsx       # /journal — all entries with tag filter
│   │   │   └── [id]/
│   │   │       └── page.tsx   # /journal/[slug] — full entry page
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx       # /login — credentials form
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # /dashboard — protected, list all journals
│   │   │   ├── DashboardActions.tsx  # View/edit/delete/publish buttons
│   │   │   ├── new/
│   │   │   │   └── page.tsx   # /dashboard/new — create entry
│   │   │   └── edit/[id]/
│   │   │       └── page.tsx   # /dashboard/edit/[id] — edit entry
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts   # NextAuth handler
│   │       └── journals/
│   │           ├── route.ts   # GET (list) + POST (create)
│   │           └── [id]/
│   │               └── route.ts  # GET + PATCH + DELETE
│   │
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky nav with dark mode + auth state
│   │   ├── Hero.tsx           # Landing hero with orbs + stats
│   │   ├── JournalCard.tsx    # Single journal preview card
│   │   ├── JournalList.tsx    # Section wrapper for journal cards
│   │   ├── JournalForm.tsx    # Reusable create/edit form
│   │   ├── MarkdownRenderer.tsx  # ReactMarkdown wrapper
│   │   ├── Footer.tsx         # Site footer
│   │   └── SessionProvider.tsx   # NextAuth session wrapper
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # NextAuth config + providers
│   │   └── utils.ts           # slugify, formatDate, cn helpers
│   │
│   └── types/
│       └── index.ts           # Shared TypeScript types
│
├── .env.example               # Environment variable template
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/gyan-learns.git
cd gyan-learns
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
DATABASE_URL="postgresql://..."   # Your Neon (or local Postgres) URL
NEXTAUTH_SECRET="..."             # Random string: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

> **Option A — Local PostgreSQL:**
> ```bash
> createdb gyan_learns
> DATABASE_URL="postgresql://localhost:5432/gyan_learns"
> ```
>
> **Option B — Neon (free cloud Postgres):**
> 1. Sign up at [neon.tech](https://neon.tech)
> 2. Create a project → copy the connection string
> 3. Paste into `DATABASE_URL`

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# OR use migrations (recommended for production)
npm run db:migrate
```

### 4. Seed demo data

```bash
npm run db:seed
```

This creates:
- **User:** `gyan@example.com` / `admin123`
- **3 sample journals** about Kubernetes, Helm, and ArgoCD

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Authentication

### Email/Password (default)

The seed creates a demo account:
- **Email:** `gyan@example.com`
- **Password:** `admin123`

Visit `/login` to sign in.

### GitHub OAuth (optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → **New OAuth App**
2. Set:
   - **Homepage URL:** `http://localhost:3000`
   - **Callback URL:** `http://localhost:3000/api/auth/callback/github`
3. Copy **Client ID** and **Client Secret** into `.env.local`:
   ```env
   GITHUB_ID="your-client-id"
   GITHUB_SECRET="your-client-secret"
   NEXT_PUBLIC_GITHUB_ENABLED="true"
   ```
4. Restart the dev server

---

## 🌐 Deploying to Vercel + Neon

### Step 1 — Set up Neon database

1. Sign up at [neon.tech](https://neon.tech) (free tier)
2. Create a new project → **"gyan-learns"**
3. Copy the **connection string** (looks like `postgresql://user:pass@host/db?sslmode=require`)

### Step 2 — Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Add environment variables in Vercel dashboard:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` output |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |
   | `GITHUB_ID` | (optional) |
   | `GITHUB_SECRET` | (optional) |

4. Click **Deploy**

The `vercel.json` build command automatically runs `prisma migrate deploy` on every deploy.

### Step 3 — Seed production data (optional)

```bash
# Point to production DB temporarily
DATABASE_URL="your-neon-url" npm run db:seed
```

---

## 📝 Usage Guide

### Writing a Journal Entry

1. Sign in at `/login`
2. Go to `/dashboard` → click **"+ New Entry"**
3. Fill in:
   - **Title** — what you worked on
   - **Content** — full markdown content
   - **Tags** — comma-separated topics
   - **Key Learnings** — what clicked
   - **Challenges** — what was hard
   - **Reflection** — what you'd do differently
4. Toggle **Published** on/off (drafts are hidden from visitors)
5. Click **"Publish Entry"**

### Managing Entries

From `/dashboard`:
- 👁 **View** — open the public entry page
- ✏️ **Edit** — update content
- ⏸/▶ **Toggle** — publish or unpublish
- 🗑 **Delete** — permanently remove

### Tag Filtering

Visit `/journal?tag=Kubernetes` to filter by any tag. Tag pills are auto-generated from your entries.

---

## 🛠 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema changes (dev only, no migration files)
npm run db:migrate   # Create and apply migration files (production-safe)
npm run db:studio    # Open Prisma Studio (GUI for your database)
npm run db:seed      # Seed demo user + sample journals
```

---

## 🔧 Customization

### Adding a new section

1. Create your component in `src/components/`
2. Import it in `src/app/page.tsx`
3. Add a nav link in `src/components/Navbar.tsx`

### Adding a new database model (e.g. Notes)

1. Add model to `prisma/schema.prisma`
2. Run `npm run db:migrate -- --name add-notes`
3. Run `npm run db:generate`
4. Create API routes in `src/app/api/notes/`
5. Create page in `src/app/notes/`

### Changing the color accent

Edit the CSS variables in `src/app/globals.css`:
```css
:root {
  --accent: #2563eb;      /* Change to any color */
  --accent-dim: #dbeafe;  /* Light version for backgrounds */
}
```

---

## 🏗 Architecture Notes

- **Server components** are used for all data fetching (homepage, journal pages, dashboard list)
- **Client components** are used only where interactivity is needed (Navbar, JournalForm, DashboardActions)
- **API routes** handle all mutations (create, update, delete) — called from client components
- **Prisma** runs only on the server — never exposed to the client
- **NextAuth JWT strategy** — sessions stored in cookies, no DB session table needed for credentials auth

---

## 🐛 Troubleshooting

**`PrismaClientInitializationError`**
→ Check your `DATABASE_URL` is correct and the DB is accessible

**`Invalid session` after deploy**
→ Make sure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set in Vercel env vars

**Dark mode flashes on load**
→ The inline script in `layout.tsx` reads localStorage before React hydrates — this is intentional and prevents the flash

**`Module not found: @prisma/client`**
→ Run `npm run db:generate` to regenerate the client

---

## 📄 License

MIT — use this as a template for your own learning journal.

---

Built with ❤️ by Gyan Prakash · [LinkedIn](#) · [GitHub](#)
