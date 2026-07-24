import { NextResponse } from "next/server";
import { incrementVisit } from "@/lib/visits-data";
import { hasCookie, OWNER_COOKIE, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/visits";

/**
 * Ruta pública (sin login): el sitio la llama una vez por carga de página
 * para contar la visita. No cuenta si el dispositivo tiene la cookie de
 * "dueña del sitio" (ver /api/track/exclude-device), ni más de una vez
 * cada 30 minutos desde el mismo navegador.
 */
export async function POST(req: Request) {
  if (hasCookie(req, OWNER_COOKIE)) {
    return NextResponse.json({ counted: false, reason: "owner" });
  }
  if (hasCookie(req, SESSION_COOKIE)) {
    return NextResponse.json({ counted: false, reason: "session" });
  }

  try {
    await incrementVisit();
  } catch {
    // Si falla el guardado (ej: R2 no disponible), no rompe la carga del sitio.
    return NextResponse.json({ counted: false, reason: "error" });
  }

  const res = NextResponse.json({ counted: true });
  res.cookies.set(SESSION_COOKIE, "1", {
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
