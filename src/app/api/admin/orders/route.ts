import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await prisma.orderHistory.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}
