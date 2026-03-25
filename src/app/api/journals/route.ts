// src/app/api/journals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content is required"),
  learnings: z.string().optional(),
  challenges: z.string().optional(),
  reflection: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");

    const journals = await prisma.journal.findMany({
      where: {
        published: true,
        ...(tag ? { tags: { has: tag } } : {}),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(journals);
  } catch (error) {
    console.error("[GET /api/journals]", error);
    return NextResponse.json({ error: "Failed to fetch journals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    // Build unique slug
    const existingSlugs = await prisma.journal
      .findMany({ select: { slug: true } })
      .then((j) => j.map((x) => x.slug));

    let slug = slugify(data.title);
    let counter = 1;
    while (existingSlugs.includes(slug)) {
      slug = `${slugify(data.title)}-${counter++}`;
    }

    const journal = await prisma.journal.create({
      data: {
        ...data,
        slug,
        userId: session.user.id,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(journal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("[POST /api/journals]", error);
    return NextResponse.json({ error: "Failed to create journal" }, { status: 500 });
  }
}
