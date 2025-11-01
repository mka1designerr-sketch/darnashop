declare module "@vercel/blob" {
  export type PutOptions = {
    access?: "public" | "private";
    token?: string;
    contentType?: string;
  };
  export function put(
    name: string,
    data: Blob | ArrayBuffer | Uint8Array | File | Buffer,
    opts?: PutOptions
  ): Promise<{ url: string; pathname?: string }>;
}
