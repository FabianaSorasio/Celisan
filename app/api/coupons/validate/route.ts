import { NextResponse } from "next/server";
import { findActiveCoupon } from "@/lib/coupons-data";

/** Ruta pública (sin login): el carrito la usa para validar un código de cupón. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { code?: string } | null;
  const code = body?.code?.trim();
  if (!code) {
    return NextResponse.json({ ok: false, error: "Ingresá un código de cupón." }, { status: 400 });
  }

  const coupon = await findActiveCoupon(code);
  if (!coupon) {
    return NextResponse.json({ ok: false, error: "Cupón inválido o vencido." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    code: coupon.code,
    percent: coupon.percent,
    categories: coupon.categories ?? [],
  });
}
