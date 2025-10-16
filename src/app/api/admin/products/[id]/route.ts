import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const safeId = decodeURIComponent(id);
  const p = await prisma.product.findUnique({ where: { id: safeId }, include: { variants: true } });
  return NextResponse.json(p || null);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const safeId = decodeURIComponent(id);
    const patch = await req.json();
    // Update scalars
    await prisma.product.update({
      where: { id: safeId },
      data: {
        name: patch.name ?? undefined,
        price: patch.price !== undefined ? Math.round(Number(patch.price)) : undefined,
        qty: patch.qty !== undefined ? Math.round(Number(patch.qty)) : undefined,
        categories: Array.isArray(patch.categories) ? patch.categories : undefined,
        description: patch.description ?? undefined,
        deliveryInfo: patch.deliveryInfo ?? undefined,
      },
    });
    // If variants provided, replace them for simplicity
    if (Array.isArray(patch.variants)) {
      await prisma.$transaction([
        prisma.variant.deleteMany({ where: { productId: safeId } }),
        prisma.product.update({
          where: { id: safeId },
          data: {
            variants: {
              create: patch.variants.map((v: { colorName: string; colorHex?: string | null; images?: string[]; isPrimary?: boolean }) => ({
                colorName: v.colorName,
                colorHex: v.colorHex ?? null,
                images: Array.isArray(v.images) ? v.images : [],
                isPrimary: Boolean(v.isPrimary),
              })),
            },
          },
        }),
      ]);
    }
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
    await prisma.product.delete({ where: { id: safeId } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
