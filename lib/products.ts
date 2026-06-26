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
  /** Imagen principal (thumbnail y fallback) */
  image: string;
  /** Galería para carrusel. Si tiene más de un item se muestra carrusel en la card. */
  images?: string[];
  /** Ruta opcional a un video del producto (mp4). Se usa para mostrar modal de video. */
  video?: string;
  /** false = ocultar del catálogo sin borrar el producto */
  available?: boolean;
  category: ProductCategory;
  stock: number;
}
