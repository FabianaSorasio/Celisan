import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Coupon } from "@/lib/coupons";
import { readJsonFromR2, saveJsonToR2 } from "@/lib/r2";

const R2_KEY = "data/coupons.json";
const LOCAL_PATH = join(process.cwd(), "data", "coupons.json");

/** Solo se usa si R2 todavía no tiene nada guardado (primer arranque). */
function getLocalFallback(): Coupon[] {
  try {
    if (!existsSync(LOCAL_PATH)) return [];
    return JSON.parse(readFileSync(LOCAL_PATH, "utf-8")) as Coupon[];
  } catch {
    return [];
  }
}

export async function getCoupons(): Promise<Coupon[]> {
  try {
    const fromR2 = await readJsonFromR2<Coupon[]>(R2_KEY);
    if (fromR2) return fromR2;
  } catch {
    // R2 no disponible (ej: variables no configuradas en local) — usar el archivo local
  }
  return getLocalFallback();
}

export async function saveCoupons(coupons: Coupon[]): Promise<void> {
  await saveJsonToR2(R2_KEY, coupons);
}

/** Busca un cupón activo por código, sin importar mayúsculas/minúsculas ni espacios. */
export async function findActiveCoupon(code: string): Promise<Coupon | undefined> {
  const normalized = code.trim().toUpperCase();
  const coupons = await getCoupons();
  return coupons.find((c) => c.active && c.code.trim().toUpperCase() === normalized);
}
