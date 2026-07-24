import { NextResponse } from "next/server";
import { incrementProductView } from "@/lib/product-views-data";
import {
  getCookieValue,
  hasCookie,
  OWNER_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  VIEWED_PRODUCTS_COOKIE,
} from "@/lib/visits";

/**
 * Ruta pública (sin login): se llama cuando un cliente toca la foto o el
 * video de un producto para ampliarlo. No cuenta si el dispositivo tiene
 * la cookie de "dueña del sitio", ni más de una vez por producto cada
 * 30 minutos desde el mismo navegador.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { productId?: string } | null;
  const productId = body?.productId?.trim();
  if (!productId) {
    return NextResponse.json({ error: "Falta productId" }, { status: 400 });
  }

  if (hasCookie(req, OWNER_COOKIE)) {
    return NextResponse.json({ counted: false, reason: "owner" });
  }

  const alreadyViewed = (getCookieValue(req, VIEWED_PRODUCTS_COOKIE) ?? "")
    .split(",")
    .filter(Boolean);

  if (alreadyViewed.includes(productId)) {
    return NextResponse.json({ counted: false, reason: "session" });
  }

  try {
    await incrementProductView(productId);
  } catch {
    return NextResponse.json({ counted: false, reason: "error" });
  }

  const res = NextResponse.json({ counted: true });
  const updated = [...alreadyViewed, productId].join(",");
  res.cookies.set(VIEWED_PRODUCTS_COOKIE, updated, {
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
