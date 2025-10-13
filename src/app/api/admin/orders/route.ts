import { NextResponse } from "next/server";
import { loadOrders } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await loadOrders();
  // sort newest first
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(list);
}
