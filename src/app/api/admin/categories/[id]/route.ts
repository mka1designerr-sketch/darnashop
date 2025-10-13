import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const c = await prisma.category.findUnique({ where: { id } });
  return NextResponse.json(c || null);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    const patch = await req.json();
    await prisma.category.update({
      where: { id },
      data: { name: patch.name ?? undefined, cover: patch.cover ?? undefined },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
