import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Coupon } from "@/lib/coupons";

const DATA_PATH = join(process.cwd(), "data", "coupons.json");

export function getCoupons(): Coupon[] {
  try {
    if (!existsSync(DATA_PATH)) return [];
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Coupon[];
  } catch {
    return [];
  }
}

export function saveCoupons(coupons: Coupon[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(coupons, null, 2), "utf-8");
}

/** Busca un cupón activo por código, sin importar mayúsculas/minúsculas ni espacios. */
export function findActiveCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return getCoupons().find((c) => c.active && c.code.trim().toUpperCase() === normalized);
}
