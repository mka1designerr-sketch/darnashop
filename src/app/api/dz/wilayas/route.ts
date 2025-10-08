import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; // 24h

export async function GET() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/dzcode-io/leblad/master/data/wilayas.json", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch_failed");
    const data = await res.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } });
  } catch {
    // minimal fallback if remote unavailable
    return NextResponse.json([
      { code: 16, name: "Alger", name_ar: "الجزائر" },
      { code: 31, name: "Oran", name_ar: "وهران" },
      { code: 25, name: "Constantine", name_ar: "قسنطينة" },
    ]);
  }
}
