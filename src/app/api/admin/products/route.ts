import { NextRequest, NextResponse } from "next/server";
import { loadProducts, saveProducts } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await loadProducts();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const p = await req.json();
    if (!p?.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    const list = await loadProducts();
    if (list.find((x: any) => x.id === p.id)) {
      return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
    }
    list.push(p);
    await saveProducts(list);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
