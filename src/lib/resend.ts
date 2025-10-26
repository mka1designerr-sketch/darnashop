import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
export const resend = key ? new Resend(key) : null;
export const FROM_EMAIL = process.env.RESEND_FROM || "onboarding@resend.dev";
export const CONTACT_TO = process.env.CONTACT_TO || "mka.1.designerr@gmail.com";
