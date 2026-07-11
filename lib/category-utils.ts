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
  "línea soy sin gluten": "Viandas Soy Sin Gluten",
  "linea soy sin gluten": "Viandas Soy Sin Gluten",
  "viandas soy sin gluten": "Viandas Soy Sin Gluten",
  "menú listo": "Viandas Soy Sin Gluten",
  "menu listo": "Viandas Soy Sin Gluten",
  "panificados y pastas congeladas": "Panificación y Pastas Soy Sin Gluten",
  "panificados y pastas congeladas soy sin gluten": "Panificación y Pastas Soy Sin Gluten",
  "panificacion y pastas soy sin gluten": "Panificación y Pastas Soy Sin Gluten",
  "waffles congelados": "Waffles Congelados",
  "waffles con cobertura": "Waffles con Cobertura",
  desayunos: "Desayunos",
  "desayunos y viandas": "Desayunos",
  "vianda cumple": "Vianda Fiesta!",
  "vianda fiesta": "Vianda Fiesta!",
};

function normalizeText(value: string): string {
  return value.trim().normalize("NFC");
}

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

export function parseCategoryFilter(raw: string | null | undefined): CatalogCategoryFilter {
  if (!raw) return "Todas";
  const decoded = decodeURIComponent(raw);
  const normalized = normalizeText(decoded);
  if (normalized === "Todas") return "Todas";
  const match = CATALOG_CATEGORIES.find((c) => normalizeText(c) === normalized);
  return match ?? "Todas";
}

const WAFFLES_COBERTURA_ORDER = ["wcb-veggie", "wcb-jyq", "wcb-banana", "wcb-frutos"] as const;
const WAFFLES_CONGELADOS_ORDER = ["wc-dulces-x2", "wc-dulces-x4", "wc-choc-x2", "wc-choc-x4"] as const;

function sortByIdOrder(products: Product[], order: readonly string[]): Product[] {
  const rank = new Map(order.map((id, index) => [id, index]));
  return [...products].sort((a, b) => {
    const aRank = rank.get(a.id);
    const bRank = rank.get(b.id);
    if (aRank === undefined && bRank === undefined) return 0;
    if (aRank === undefined) return 1;
    if (bRank === undefined) return -1;
    return aRank - bRank;
  });
}

export function filterProductsByCategory(products: Product[], category: CatalogCategoryFilter): Product[] {
  // Filtra ocultos y sin stock primero
  const visible = products.filter((p) => p.available !== false);

  if (category === "Todas") return visible;
  const target = normalizeText(category);
  const list = visible.filter((p) => normalizeText(p.category) === target);

  if (category === "Waffles con Cobertura") return sortByIdOrder(list, WAFFLES_COBERTURA_ORDER);
  if (category === "Waffles Congelados") return sortByIdOrder(list, WAFFLES_CONGELADOS_ORDER);
  return list;
}
