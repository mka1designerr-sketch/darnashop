import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPublicImage } from "@/lib/blob";

function isAuthed(req: Request) {
  const header = req.headers.get("x-admin-secret");
  const secret = process.env.ADMIN_SECRET;
  
  // Debug authentication
  console.log("API Auth Debug:", {
    hasHeader: !!header,
    hasSecret: !!secret,
    secretValue: secret ? `${secret.slice(0, 3)}...` : 'undefined',
    headerValue: header ? `${header.slice(0, 3)}...` : 'undefined',
    match: header === secret
  });
  
  return Boolean(secret && header && header === secret);
}

export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ slides: [] }, { status: 200 });
  const slides = await prisma.heroSlide.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ slides });
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "database_unavailable" }, { status: 503 });

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_image" }, { status: 400 });
  }

  const title = (form.get("title") as string) || undefined;
  const subtitle = (form.get("subtitle") as string) || undefined;
  const ctaLabel = (form.get("ctaLabel") as string) || undefined;
  const ctaHref = (form.get("ctaHref") as string) || undefined;

  const count = await prisma.heroSlide.count();
  if (count >= 7) return NextResponse.json({ error: "max_reached" }, { status: 400 });

  try {
    console.log("Starting blob upload for file:", file.name, file.size, file.type);
    const imageUrl = await uploadPublicImage(file);
    console.log("Blob upload successful, URL:", imageUrl);
    
    const position = count; // append at end
    const slide = await prisma.heroSlide.create({
      data: { imageUrl, title, subtitle, ctaLabel, ctaHref, position },
    });
    console.log("Slide created successfully:", slide.id);
    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    const errorMessage = error instanceof Error ? error.message : "upload_failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "database_unavailable" }, { status: 503 });

  const body = await req.json();
  const order = (body && body.order) as string[] | undefined;
  if (!order || !Array.isArray(order)) return NextResponse.json({ error: "invalid_order" }, { status: 400 });

  // Reassign positions based on provided order array
  const updates = order.map((id, idx) =>
    prisma.heroSlide.update({ where: { id }, data: { position: idx } })
  );
  await prisma.$transaction(updates);
  const slides = await prisma.heroSlide.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ slides });
}

export async function DELETE(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "database_unavailable" }, { status: 503 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  try {
    await prisma.heroSlide.delete({ where: { id } });
    // Re-pack positions to be contiguous starting from 0
    const existing = await prisma.heroSlide.findMany({ orderBy: { position: "asc" } });
    const repositions = existing.map((s, idx) =>
      prisma.heroSlide.update({ where: { id: s.id }, data: { position: idx } })
    );
    await prisma.$transaction(repositions);
    const slides = await prisma.heroSlide.findMany({ orderBy: { position: "asc" } });
    return NextResponse.json({ slides }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }
}
