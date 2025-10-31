import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ slides: [] }, { status: 200 });
  }
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { position: "asc" } });
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ slides: [] }, { status: 200 });
  }
}
