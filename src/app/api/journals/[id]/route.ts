// src/app/api/journals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  learnings: z.string().optional().nullable(),
  challenges: z.string().optional().nullable(),
  reflection: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

// ✅ FIXED GET
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;

  try {
    const journal = await prisma.journal.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    return NextResponse.json(journal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch journal" }, { status: 500 });
  }
}

// ✅ FIXED PATCH
export async function PATCH(req: NextRequest, context: any) {
  const { id } = context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (journal.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.journal.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update journal" }, { status: 500 });
  }
}

// ✅ FIXED DELETE
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (journal.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.journal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete journal" }, { status: 500 });
  }
}