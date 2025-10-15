import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; // 24h

export async function GET() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/AbderrahmeneDZ/Wilaya-Of-Algeria/refs/heads/master/Wilaya_Of_Algeria.json",
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("fetch_failed");
    const raw = (await res.json()) as Array<{ code: unknown; name: unknown; ar_name?: unknown }>;
    // Project to the shape expected by the client hook
    const data = raw.map((w) => {
      const ww = w as { code: unknown; name: unknown; ar_name?: unknown };
      return { code: Number(ww.code), name: String(ww.name), name_ar: (ww.ar_name as string) || undefined };
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch {
    // minimal fallback if remote unavailable
    return NextResponse.json([
      { code: 16, name: "Alger", name_ar: "الجزائر" },
      { code: 31, name: "Oran", name_ar: "وهران" },
      { code: 25, name: "Constantine", name_ar: "قسنطينة" },
    ]);
  }
}
