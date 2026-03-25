// src/types/index.ts
import type { Journal, User } from "@prisma/client";

export type JournalWithUser = Journal & {
  user: Pick<User, "id" | "name" | "email">;
};

export type JournalSummary = Pick<
  Journal,
  "id" | "title" | "slug" | "tags" | "createdAt" | "published"
> & {
  excerpt?: string;
};

export type CreateJournalInput = {
  title: string;
  content: string;
  learnings?: string;
  challenges?: string;
  reflection?: string;
  tags: string[];
  published?: boolean;
};

export type UpdateJournalInput = Partial<CreateJournalInput>;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
