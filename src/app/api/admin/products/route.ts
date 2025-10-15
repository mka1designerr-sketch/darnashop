import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await prisma.product.findMany({ include: { variants: true } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const p = await req.json();
    if (!p?.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    const exists = await prisma.product.findUnique({ where: { id: p.id } });
    if (exists) return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        price: Math.round(Number(p.price || 0)),
        qty: Math.round(Number(p.qty || 0)),
        categories: Array.isArray(p.categories) ? p.categories : [],
        description: p.description ?? null,
        deliveryInfo: p.deliveryInfo ?? null,
        variants: {
          create: Array.isArray(p.variants)
            ? p.variants.map((v: { colorName: string; colorHex?: string | null; images?: string[]; isPrimary?: boolean }) => ({
                colorName: v.colorName,
                colorHex: v.colorHex ?? null,
                images: Array.isArray(v.images) ? v.images : [],
                isPrimary: Boolean(v.isPrimary),
              }))
            : [],
        },
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
