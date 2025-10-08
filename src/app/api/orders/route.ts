import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhook = process.env.NEXT_PUBLIC_ORDERS_WEBHOOK_URL || process.env.ORDERS_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ ok: false, error: "Webhook URL not configured" }, { status: 500 });
    }
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // No need for CORS handling server-side
    });
    const text = await res.text().catch(() => "");
    return NextResponse.json({ ok: res.ok, status: res.status, body: text });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
