import { put } from "@vercel/blob";

export async function uploadPublicImage(file: File, folder = "hero") {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("Missing BLOB_READ_WRITE_TOKEN");

  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/gi, "");
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt || "jpg"}`;

  const { url } = await put(name, file, { access: "public", token });
  return url;
}
