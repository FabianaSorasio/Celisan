import { readJsonFromR2, saveJsonToR2 } from "@/lib/r2";

export type ProductViewsData = Record<string, number>;

const R2_KEY = "data/product-views.json";

export async function getProductViews(): Promise<ProductViewsData> {
  try {
    const data = await readJsonFromR2<ProductViewsData>(R2_KEY);
    if (data) return data;
  } catch {
    // R2 no disponible — devolver vacío
  }
  return {};
}

/** No es atómico (lecturas concurrentes pueden pisarse); aceptable para este volumen de tráfico. */
export async function incrementProductView(productId: string): Promise<void> {
  const data = await getProductViews();
  data[productId] = (data[productId] ?? 0) + 1;
  await saveJsonToR2(R2_KEY, data);
}
