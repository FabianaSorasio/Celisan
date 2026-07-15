import { NextResponse } from "next/server";
import { extname } from "path";
import { isAuthenticated } from "@/lib/admin-auth";
import { uploadToR2 } from "@/lib/r2";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
};

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "productos/sin-categoria";

  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }

  const ext = extname(file.name).toLowerCase() || ".png";
  const allowedImages = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const allowedVideos = [".mp4", ".webm", ".mov", ".m4v"];
  const allowed = [...allowedImages, ...allowedVideos];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }

  const isVideo = allowedVideos.includes(ext);
  const maxBytes = isVideo ? 50 * 1024 * 1024 : 20 * 1024 * 1024; // 50MB video, 20MB imagen
  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return NextResponse.json(
      { error: `Archivo demasiado grande (máx ${maxMb}MB)` },
      { status: 413 }
    );
  }

  const timestamp = Date.now();
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
  const filename = `${timestamp}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const key = `images/${folder}/${filename}`;

  const publicPath = await uploadToR2(key, buffer, contentType);
  return NextResponse.json({ path: publicPath });
}
