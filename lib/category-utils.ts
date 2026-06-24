import {
  CATALOG_CATEGORIES,
  type CatalogCategoryFilter,
  type Product,
  type ProductCategory,
} from "@/lib/products";

const VALID_CATEGORIES = CATALOG_CATEGORIES.filter(
  (c): c is ProductCategory => c !== "Todas"
);

const CATEGORY_ALIASES: Record<string, ProductCategory> = {
  // Viandas Soy Sin Gluten (antes "Línea Soy Sin Gluten")
  "viandas soy sin gluten": "Viandas Soy Sin Gluten",
  "línea soy sin gluten": "Viandas Soy Sin Gluten",
  "linea soy sin gluten": "Viandas Soy Sin Gluten",
  "menú listo": "Viandas Soy Sin Gluten",
  "menu listo": "Viandas Soy Sin Gluten",
  // Panificación y Pastas Soy Sin Gluten (antes "Panificados y Pastas congeladas...")
  "panificación y pastas soy sin gluten": "Panificación y Pastas Soy Sin Gluten",
  "panificacion y pastas soy sin gluten": "Panificación y Pastas Soy Sin Gluten",
  "panificados y pastas congeladas soy sin gluten": "Panificación y Pastas Soy Sin Gluten",
  "panificados y pastas congeladas": "Panificación y Pastas Soy Sin Gluten",
  "panificados": "Panificación y Pastas Soy Sin Gluten",
  // Waffles
  "waffles congelados": "Waffles Congelados",
  "waffles con cobertura": "Waffles con Cobertura",
  // Resto
  desayunos: "Desayunos",
  "desayunos y viandas": "Desayunos",
  "vianda cumple": "Vianda Cumple",
  "viandas cumple": "Vianda Cumple",
};

/** IDs de waffles congelados — nunca deben aparecer en otras categorías */
const WAFFLES_CONGELADOS_IDS = new Set([
  "wc-dulces-x2", "wc-dulces-x4",
  "wc-choc-x2",   "wc-choc-x4",
  "wc-min-x2",    "wc-min-x4",
  "wc-may-x2",    "wc-may-x4",
]);

function normalizeText(value: string): string {
  return value.trim().normalize("NFC");
}

/** Normaliza el valor de la columna Categoría de la planilla al nombre oficial. */
export function normalizeCategory(raw: string): ProductCategory | null {
  const trimmed = normalizeText(raw);
  if (!trimmed) return null;

  const exact = VALID_CATEGORIES.find((c) => normalizeText(c) === trimmed);
  if (exact) return exact;

  const alias = CATEGORY_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;

  const fuzzy = VALID_CATEGORIES.find((c) =>
    trimmed.toLowerCase().includes(c.toLowerCase().slice(0, 12))
  );
  return fuzzy ?? null;
}

export function parseCategoryFilter(
  raw: string | null | undefined
): CatalogCategoryFilter {
  if (!raw) return "Todas";
  const decoded = decodeURIComponent(raw);
  const normalized = normalizeText(decoded);
  if (normalized === "Todas") return "Todas";
  const match = CATALOG_CATEGORIES.find((c) => normalizeText(c) === normalized);
  return match ?? "Todas";
}

/** Orden de visualización: Waffles con Cobertura */
const WAFFLES_COBERTURA_ORDER = [
  "wcb-veggie",
  "wcb-jyq",
  "wcb-banana",
  "wcb-frutos",
] as const;

/** Orden de visualización: Waffles Congelados */
const WAFFLES_CONGELADOS_ORDER = [
  "wc-dulces-x2",
  "wc-dulces-x4",
  "wc-choc-x2",
  "wc-choc-x4",
] as const;

function sortByIdOrder(
  products: Product[],
  order: readonly string[]
): Product[] {
  const rank = new Map(order.map((id, i) => [id, i]));
  return [...products].sort((a, b) => {
    const aR = rank.get(a.id);
    const bR = rank.get(b.id);
    if (aR === undefined && bR === undefined) return 0;
    if (aR === undefined) return 1;
    if (bR === undefined) return -1;
    return aR - bR;
  });
}

export function sortWafflesConCobertura(products: Product[]): Product[] {
  return sortByIdOrder(products, WAFFLES_COBERTURA_ORDER);
}

export function sortWafflesCongelados(products: Product[]): Product[] {
  return sortByIdOrder(products, WAFFLES_CONGELADOS_ORDER);
}

export function filterProductsByCategory(
  products: Product[],
  category: CatalogCategoryFilter
): Product[] {
  if (category === "Todas") return products;

  const target = normalizeText(category);

  const list = products.filter((p) => {
    // Bloquear waffles congelados en categorías que no les corresponden
    if (WAFFLES_CONGELADOS_IDS.has(p.id) && category !== "Waffles Congelados") {
      return false;
    }
    return normalizeText(p.category) === target;
  });

  if (category === "Waffles con Cobertura") return sortWafflesConCobertura(list);
  if (category === "Waffles Congelados") return sortWafflesCongelados(list);
  return list;
}
