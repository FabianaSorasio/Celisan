import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Product } from "@/lib/products";
import { readJsonFromR2, saveJsonToR2 } from "@/lib/r2";

const R2_KEY = "data/products.json";
const LOCAL_PATH = join(process.cwd(), "data", "products.json");

/** Solo se usa si R2 todavía no tiene nada guardado (primer arranque). */
function getLocalFallback(): Product[] {
  try {
    if (!existsSync(LOCAL_PATH)) return [];
    return JSON.parse(readFileSync(LOCAL_PATH, "utf-8")) as Product[];
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const fromR2 = await readJsonFromR2<Product[]>(R2_KEY);
    if (fromR2) return fromR2;
  } catch {
    // R2 no disponible (ej: variables no configuradas en local) — usar el archivo local
  }
  return getLocalFallback();
}

export async function saveProducts(products: Product[]): Promise<void> {
  await saveJsonToR2(R2_KEY, products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
