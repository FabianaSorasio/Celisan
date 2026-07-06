export const CATALOG_CATEGORIES = [
  "Todas",
  "Viandas Soy Sin Gluten",
  "Panificados y Pastas congeladas Soy Sin Gluten",
  "Waffles Congelados",
  "Waffles con Cobertura",
  "Postres individuales",
  "Desayunos y Meriendas",
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
  category: ProductCategory;
  stock: number;
  stockDulces?: number;  // stock por separado para selector Dulces/Salados
  stockSalados?: number;
  sinSelectorSabor?: boolean; // oculta el selector Dulces/Salados para productos de sabor único
  variantes?: ProductVariant[];
  images?: string[];
  video?: string;
  available?: boolean;
  imageX?: number;
  imageY?: number;
  imageZoom?: number;
}
