import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/AbderrahmeneDZ/Wilaya-Of-Algeria/refs/heads/master/Commune_Of_Algeria.json",
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("fetch_failed");
    const raw = (await res.json()) as Array<{ name: unknown; ar_name?: unknown; wilaya_id: unknown }>;
    // Project to the shape expected by the client hook
    const data = raw.map((c) => {
      const cc = c as { name: unknown; ar_name?: unknown; wilaya_id: unknown };
      return { name: String(cc.name), name_ar: (cc.ar_name as string) || undefined, wilaya_code: Number(cc.wilaya_id) };
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
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
