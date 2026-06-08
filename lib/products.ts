export const CATALOG_CATEGORIES = [
  "Todas",
  "Línea Soy Sin Gluten",
  "Panificados y Pastas congeladas Soy Sin Gluten",
  "Waffles Congelados",
  "Waffles con Cobertura",
  "Desayunos",
  "Vianda Cumple",
] as const;

export type CatalogCategoryFilter = (typeof CATALOG_CATEGORIES)[number];

export type ProductCategory = Exclude<CatalogCategoryFilter, "Todas">;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  stock: number;
}
