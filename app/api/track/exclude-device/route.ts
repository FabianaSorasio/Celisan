import { NextResponse } from "next/server";
import { OWNER_COOKIE, OWNER_COOKIE_MAX_AGE } from "@/lib/visits";

/**
 * Ruta pública: se abre una sola vez por dispositivo (celular, PC) para
 * marcarlo como "dueña del sitio" y que sus visitas no sumen al contador
 * del admin. Deja una cookie de larga duración en ese navegador.
 */
export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Dispositivo excluido — Celisan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="font-family: system-ui, sans-serif; background: #FFFDF5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center;">
  <div>
    <div style="font-size: 3rem; margin-bottom: 0.5rem;">✅</div>
    <h1 style="color: #55572F; font-size: 1.3rem; margin-bottom: 0.5rem;">Listo</h1>
    <p style="color: #444; max-width: 320px;">Este dispositivo y navegador ya no se va a contar como visita en el panel de admin.</p>
  </div>
</body>
</html>`;

  const res = new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  res.cookies.set(OWNER_COOKIE, "1", {
    maxAge: OWNER_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
