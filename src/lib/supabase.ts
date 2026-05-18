import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.error("Supabase URL/Anon Key ausentes. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const MEDIA_BUCKET = "media";

/** Faz upload de uma imagem (Blob/File) para o bucket `media` e retorna a URL pública. */
export async function uploadImage(blob: Blob, folder = "misc", ext?: string): Promise<string> {
  const inferredExt =
    ext ||
    (blob.type === "image/png"
      ? "png"
      : blob.type === "image/webp"
      ? "webp"
      : blob.type === "image/avif"
      ? "avif"
      : "jpg");
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `${folder}/${Date.now()}-${rand}.${inferredExt}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: blob.type || `image/${inferredExt}`,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Converte dataURL para Blob (uso interno do uploader). */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bin = atob(b64);
  const len = bin.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
