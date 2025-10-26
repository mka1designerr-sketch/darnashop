import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL, CONTACT_TO } from "@/lib/resend";

const isEmail = (v: string) => /.+@.+\..+/.test(v);

export async function POST(req: Request) {
  try {
    const { email, hp } = await req.json();
    if (hp) return NextResponse.json({ ok: true });
    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    try {
      await prisma.newsletterSubscription.create({ data: { email } });
    } catch (e: any) {
      // unique violation -> already subscribed, treat as success
    }

    try {
      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: CONTACT_TO,
          subject: "Nouvelle inscription à la newsletter",
          text: `Email: ${email}`,
        } as any);
      }
    } catch (e) {}

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
