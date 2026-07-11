import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";
import { isAuthenticated } from "@/lib/admin-auth";

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

  const uploadDir = join(process.cwd(), "public", "images", folder);
  mkdirSync(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  writeFileSync(join(uploadDir, filename), buffer);

  const publicPath = `/images/${folder}/${filename}`;
  return NextResponse.json({ path: publicPath });
}
