import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD no configurado" }, { status: 500 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "1", {
    httpOnly: false,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 horas
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "", { maxAge: 0, path: "/" });
  return res;
}
