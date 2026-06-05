"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CatalogSidebar from "@/components/CatalogSidebar";
import ProductCard from "@/components/ProductCard";
import {
  filterProductsByCategory,
  parseCategoryFilter,
} from "@/lib/category-utils";
import type { CatalogCategoryFilter, Product } from "@/lib/products";

interface CatalogProps {
  products: Product[];
}

export default function Catalog({ products }: CatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    },
    [router, searchParams]
  );

  const filtered = useMemo(
    () => filterProductsByCategory(products, selectedCategory),
    [products, selectedCategory]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
      <CatalogSidebar
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="flex-1 min-w-0">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
