import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL, CONTACT_TO } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { name, email, message, hp } = await req.json();
    if (hp) return NextResponse.json({ ok: true }); // honeypot
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // Persist message (best-effort)
    try {
      await prisma.contactMessage.create({ data: { name, email, message } });
    } catch (e) {
      // ignore persistence errors in API response
    }

    // Email notification (best-effort)
    try {
      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: CONTACT_TO,
          subject: `Nouveau message de contact — ${name}`,
          reply_to: email,
          text: `De: ${name} <${email}>
\nMessage:\n${message}`,
        } as any);
      }
    } catch (e) {
      // ignore email errors in API response
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
