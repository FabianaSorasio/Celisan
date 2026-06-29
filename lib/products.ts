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

export interface ProductVariant {
  nombre: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  video?: string;
  category: ProductCategory;
  stock: number;
  available?: boolean;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
  variantes?: ProductVariant[];
}
