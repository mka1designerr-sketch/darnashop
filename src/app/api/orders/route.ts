import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhook = process.env.ORDERS_WEBHOOK_URL || process.env.NEXT_PUBLIC_ORDERS_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ ok: false, error: "Webhook URL not configured" }, { status: 500 });
    }

    // Helper to persist minimal history and update stock
    async function logAndAdjust(items: Array<{ id: string; name: string; qty: number }>, createdAt: string) {
      const rows: { id: string; productId: string; productName: string; qty: number; remaining: number; createdAt: Date }[] = [];
      for (const it of items) {
        const p = await prisma.product.findUnique({ where: { id: it.id } });
        if (!p) continue;
        const prev = Number(p.qty || 0);
        const nextQty = Math.max(0, prev - Math.max(1, Number(it.qty || 1)));
        await prisma.product.update({ where: { id: it.id }, data: { qty: nextQty } });
        rows.push({
          id: `${it.id}-${Date.now()}`,
          productId: it.id,
          productName: it.name,
          qty: it.qty,
          remaining: nextQty,
          createdAt: new Date(createdAt),
        });
      }
      if (rows.length) {
        await prisma.orderHistory.createMany({ data: rows });
      }
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

      const results = [] as Array<{status: number; ok: boolean; body: string}>;
      // Persist locally and adjust stock
      try {
        type OrderItem = { id: string; name: string; qty?: number };
        const items = (body.items as OrderItem[]).map((it) => ({ id: it.id, name: it.name, qty: it.qty ?? 1 }));
        await logAndAdjust(items, createdAt);
      } catch {}
      for (const it of body.items) {
        const row = {
          productId: it.id || body.productId || "",
          productName: it.name || body.productName || "",
          price: it.price ?? body.price ?? "",
          color: it.color || body.color || "",
          size: it.size || body.size || "",
          qty: it.qty ?? body.qty ?? 1,
          ...common,
        };
        try {
          const res = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          });
          const text = await res.text().catch(() => "");
          results.push({ status: res.status, ok: res.ok, body: text });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          results.push({ status: 0, ok: false, body: msg });
        }
      }
      const okCount = results.filter((r) => r.ok).length;
      const failCount = results.length - okCount;
      return NextResponse.json({ ok: failCount === 0, sent: okCount, failed: failCount, results });
    }

    // Single-product payload: persist locally then forward as-is
    try {
      const createdAt = body.createdAt || new Date().toISOString();
      await logAndAdjust([{ id: body.productId || body.id, name: body.productName || body.name, qty: body.qty ?? 1 }], createdAt);
    } catch {}
    // Forward to webhook
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    return NextResponse.json({ ok: res.ok, status: res.status, body: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
