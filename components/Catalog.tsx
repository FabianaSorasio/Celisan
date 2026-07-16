"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CatalogSidebar from "@/components/CatalogSidebar";
import ProductCard from "@/components/ProductCard";
import {
  filterProductsByCategory,
  parseCategoryFilter,
} from "@/lib/category-utils";
import { CATALOG_CATEGORIES } from "@/lib/products";
import type { CatalogCategoryFilter, Product } from "@/lib/products";

// Categorías ocultas temporalmente (siguen existiendo en los datos)
const HIDDEN_CATEGORIES: string[] = ["Waffles con Cobertura"];

interface CatalogProps {
  products: Product[];
}

export default function Catalog({ products }: CatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visibleProducts = useMemo(
    () => products.filter((p) => !HIDDEN_CATEGORIES.includes(p.category)),
    [products]
  );

  const selectedCategory = useMemo(
    () => parseCategoryFilter(searchParams.get("categoria")),
    [searchParams]
  );

  const setSelectedCategory = useCallback(
    (category: CatalogCategoryFilter) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "Todas") {
        params.delete("categoria");
      } else {
        params.set("categoria", category);
      }
      const query = params.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });
      // Esperamos a que la grilla filtrada termine de re-renderizarse
      // (cambia de alto) antes de scrollear, si no el scroll "smooth"
      // apunta a una posición que después queda fuera de la página.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    },
    [router, searchParams]
  );

  const filtered = useMemo(() => {
    const result = filterProductsByCategory(visibleProducts, selectedCategory);
    if (selectedCategory === "Todas") {
      return [...result].sort((a, b) => {
        const ai = CATALOG_CATEGORIES.indexOf(a.category as typeof CATALOG_CATEGORIES[number]);
        const bi = CATALOG_CATEGORIES.indexOf(b.category as typeof CATALOG_CATEGORIES[number]);
        return ai - bi;
      });
    }
    return result;
  }, [visibleProducts, selectedCategory]);

  return (
    <div>
      <CatalogSidebar
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="mt-8 mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-olive">
          {selectedCategory === "Todas"
            ? "Todos los productos"
            : selectedCategory}
        </h2>
        <p className="text-sm text-gray-600">
          {filtered.length}{" "}
          {filtered.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {selectedCategory === "Waffles con Cobertura" && (
        <section className="mb-8 rounded-2xl p-6 sm:p-8 text-center border border-gray-200 bg-white">
          <p className="text-sm sm:text-base font-semibold text-gray-800">
            Stock limitado - Martes y Viernes - Take away
          </p>
        </section>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
