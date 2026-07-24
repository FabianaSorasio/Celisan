import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Ruta interna para forzar la actualización de la home cuando los datos
 * se modifican fuera del flujo normal del admin (ej: un script directo a R2).
 * Protegida con el mismo secreto que firma la sesión de admin.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;

  if (!secret || token !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidated: "/" });
}
