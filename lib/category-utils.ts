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
  "linea soy sin gluten": "Línea Soy Sin Gluten",
  "línea soy sin gluten": "Línea Soy Sin Gluten",
  "waffles congelados": "Waffles Congelados",
  "waffles con cobertura": "Waffles con Cobertura",
  desayunos: "Desayunos",
  "vianda cumple": "Vianda Cumple",
};

function normalizeText(value: string): string {
  return value.trim().normalize("NFC");
}

/** Normaliza el valor de la columna Categoría de la planilla al nombre oficial. */
export function normalizeCategory(raw: string): ProductCategory | null {
  const trimmed = normalizeText(raw);
  if (!trimmed) return null;

  const exact = VALID_CATEGORIES.find(
    (c) => normalizeText(c) === trimmed
  );
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

  const match = CATALOG_CATEGORIES.find(
    (c) => normalizeText(c) === normalized
  );
  return match ?? "Todas";
}

/** Orden de visualización: Waffles con Cobertura */
const WAFFLES_COBERTURA_ORDER = [
  "wcb-veggie",
  "wcb-jyq",
  "wcb-banana",
  "wcb-frutos",
] as const;

export function sortWafflesConCobertura(products: Product[]): Product[] {
  const rank = new Map(
    WAFFLES_COBERTURA_ORDER.map((id, index) => [id, index])
  );
  return [...products].sort((a, b) => {
    const aRank = rank.get(a.id);
    const bRank = rank.get(b.id);
    if (aRank === undefined && bRank === undefined) return 0;
    if (aRank === undefined) return 1;
    if (bRank === undefined) return -1;
    return aRank - bRank;
  });
}

export function filterProductsByCategory(
  products: Product[],
  category: CatalogCategoryFilter
): Product[] {
  if (category === "Todas") return products;
  const target = normalizeText(category);
  const list = products.filter((p) => normalizeText(p.category) === target);
  if (category === "Waffles con Cobertura") {
    return sortWafflesConCobertura(list);
  }
  return list;
}
