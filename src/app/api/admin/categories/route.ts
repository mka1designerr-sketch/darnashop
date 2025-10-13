import { NextRequest, NextResponse } from "next/server";
import { loadCategories, saveCategories } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await loadCategories();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const c = await req.json();
    if (!c?.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    const list = await loadCategories();
    if (list.find((x: any) => x.id === c.id)) return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
    list.push(c);
    await saveCategories(list);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
