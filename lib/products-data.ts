import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Product } from "@/lib/products";

const DATA_PATH = join(process.cwd(), "data", "products.json");

export function getProducts(): Product[] {
  try {
    if (!existsSync(DATA_PATH)) return [];
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}
