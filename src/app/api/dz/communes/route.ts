import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; // 24h

export async function GET() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/dzcode-io/leblad/master/data/communes.json", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch_failed");
    const data = await res.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } });
  } catch {
    // minimal fallback if remote unavailable
    return NextResponse.json([
      { name: "Alger Centre", name_ar: "الجزائر الوسطى", wilaya_code: 16 },
      { name: "Bir Mourad Raïs", name_ar: "بئر مراد رايس", wilaya_code: 16 },
      { name: "Oran", name_ar: "وهران", wilaya_code: 31 },
      { name: "Es Senia", name_ar: "السانية", wilaya_code: 31 },
      { name: "Constantine", name_ar: "قسنطينة", wilaya_code: 25 },
    ]);
  }
}
