import { put } from "@vercel/blob";

export async function uploadPublicImage(file: File, folder = "hero") {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  // Debug blob token
  console.log("Blob upload debug:", {
    hasToken: !!token,
    tokenPrefix: token ? `${token.slice(0, 8)}...` : 'undefined',
    fileSize: file.size,
    fileType: file.type
  });
  
  if (!token) throw new Error("Missing BLOB_READ_WRITE_TOKEN");

  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/gi, "");
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt || "jpg"}`;

  console.log("Attempting blob upload with name:", name);
  const { url } = await put(name, file, { access: "public", token });
  console.log("Blob upload completed, URL:", url);
  return url;
}
