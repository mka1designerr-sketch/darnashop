import { execSync } from "node:child_process";

const hasDb = !!process.env.DATABASE_URL;

try {
  if (hasDb) {
    console.log("[vercel-build] DATABASE_URL found -> pushing schema...");
    execSync("npm run db:push", { stdio: "inherit" });
    try {
      console.log("[vercel-build] seeding database...");
      execSync("npm run db:seed", { stdio: "inherit" });
    } catch (e) {
      console.warn("[vercel-build] seed failed; continuing build", e?.message || e);
    }
  } else {
    console.log("[vercel-build] No DATABASE_URL -> skipping db push/seed");
  }

  console.log("[vercel-build] building app...");
  execSync("npm run build", { stdio: "inherit" });
} catch (e) {
  console.error("[vercel-build] build failed", e?.message || e);
  process.exit(1);
}
