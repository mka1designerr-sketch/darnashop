import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const safeId = decodeURIComponent(id);
  const c = await prisma.category.findUnique({ where: { id: safeId } });
  return NextResponse.json(c || null);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const safeId = decodeURIComponent(id);
    const patch = await req.json();
    await prisma.category.update({
      where: { id: safeId },
      data: { name: patch.name ?? undefined, cover: patch.cover ?? undefined },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const safeId = decodeURIComponent(id);
    await prisma.category.delete({ where: { id: safeId } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
