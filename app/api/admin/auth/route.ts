import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createSessionToken,
  isAuthenticated,
} from "@/lib/admin-auth";
import { clearLoginAttempts, isLoginBlocked, registerFailedLogin } from "@/lib/login-rate-limit";

function passwordsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  if (isLoginBlocked(req)) {
    return NextResponse.json(
      { error: "Demasiados intentos fallidos. Probá de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD no configurado" }, { status: 500 });
  }

  if (typeof password !== "string" || !passwordsMatch(password, expected)) {
    registerFailedLogin(req);
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  clearLoginAttempts(req);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}

/** Usado por el panel de admin para saber si la sesión sigue activa (la cookie es httpOnly, el navegador no puede leerla). */
export async function GET(req: Request) {
  return NextResponse.json({ ok: isAuthenticated(req) });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
