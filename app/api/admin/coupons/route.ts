import { NextResponse } from "next/server";
import { getCoupons, saveCoupons } from "@/lib/coupons-data";
import type { Coupon } from "@/lib/coupons";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(await getCoupons());
}

export async function PUT(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Se esperaba un array de cupones" }, { status: 400 });
  }
  for (const c of body as Coupon[]) {
    if (!c.code || typeof c.percent !== "number" || c.percent <= 0 || c.percent > 100) {
      return NextResponse.json(
        { error: `Cupón inválido: "${c.code}". El código no puede estar vacío y el % debe ser entre 1 y 100.` },
        { status: 400 }
      );
    }
  }
  await saveCoupons(body as Coupon[]);
  return NextResponse.json({ ok: true });
}
