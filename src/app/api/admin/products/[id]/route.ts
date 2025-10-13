import { NextRequest, NextResponse } from "next/server";
import { loadProducts, saveProducts } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const list = await loadProducts();
  const p = list.find((x: any) => x.id === id);
  return NextResponse.json(p || null);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    const patch = await req.json();
    const list = await loadProducts();
    const idx = list.findIndex((x: any) => x.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    list[idx] = { ...list[idx], ...patch };
    await saveProducts(list);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    const list = await loadProducts();
    const next = list.filter((x: any) => x.id !== id);
    await saveProducts(next);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
