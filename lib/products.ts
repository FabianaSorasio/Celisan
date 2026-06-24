export const CATALOG_CATEGORIES = [
  "Todas",
  "Waffles Congelados",
  "Waffles con Cobertura",
  "Viandas Soy Sin Gluten",
  "Panificación y Pastas Soy Sin Gluten",
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
  /** Ruta opcional a un video del producto (mp4). Se usa para mostrar modal de video. */
  video?: string;
  category: ProductCategory;
  stock: number;
}
