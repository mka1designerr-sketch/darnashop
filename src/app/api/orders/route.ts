import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhook = process.env.NEXT_PUBLIC_ORDERS_WEBHOOK_URL || process.env.ORDERS_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ ok: false, error: "Webhook URL not configured" }, { status: 500 });
    }

    // If payload contains a cart with many items, expand into multiple rows
    if (Array.isArray(body.items) && body.items.length > 0) {
      const createdAt = body.createdAt || new Date().toISOString();
      const common = {
        name: body.name || "",
        phone: body.phone || "",
        address: body.address || "",
        // extra fields (ignored by current GAS but harmless)
        wilaya: body.wilaya || "",
        wilaya_code: body.wilaya_code || "",
        commune: body.commune || "",
        delivery_method: body.delivery_method || "",
        delivery_price: body.delivery_price ?? "",
        subtotal: body.subtotal ?? "",
        total: body.total ?? "",
        createdAt,
      };

      const posts = body.items.map((it: any) => {
        const row = {
          productId: it.id || body.productId || "",
          productName: it.name || body.productName || "",
          price: it.price ?? body.price ?? "",
          color: it.color || body.color || "",
          size: it.size || body.size || "",
          qty: it.qty ?? body.qty ?? 1,
          ...common,
        };
        return fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
      });

      const results = await Promise.allSettled(posts);
      const okCount = results.filter((r) => r.status === "fulfilled").length;
      const failCount = results.length - okCount;
      return NextResponse.json({ ok: failCount === 0, sent: okCount, failed: failCount });
    }

    // Single-product payload: forward as-is
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    return NextResponse.json({ ok: res.ok, status: res.status, body: text });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
