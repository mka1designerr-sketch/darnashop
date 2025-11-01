import { NextResponse } from "next/server";

export async function GET() {
  // Only show debug info in development or with admin secret
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (!isDev) {
    return NextResponse.json({ error: "not_available_in_production" }, { status: 403 });
  }
  
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ADMIN_PASS: process.env.NEXT_PUBLIC_ADMIN_PASS,
    ADMIN_SECRET: process.env.ADMIN_SECRET ? `${process.env.ADMIN_SECRET.slice(0, 3)}...` : 'undefined',
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'undefined',
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV
  });
}