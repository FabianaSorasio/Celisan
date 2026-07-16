"use client";

import { CATALOG_CATEGORIES, type CatalogCategoryFilter } from "@/lib/products";

// Categorías ocultas temporalmente del menú (siguen existiendo en los datos)
const HIDDEN_CATEGORIES: CatalogCategoryFilter[] = ["Waffles con Cobertura"];
const VISIBLE_CATEGORIES = CATALOG_CATEGORIES.filter(
  (c) => !HIDDEN_CATEGORIES.includes(c)
);

interface CatalogSidebarProps {
  selected: CatalogCategoryFilter;
  onSelect: (category: CatalogCategoryFilter) => void;
}

export default function CatalogSidebar({
  selected,
  onSelect,
}: CatalogSidebarProps) {
  return (
    <nav
      className="flex flex-wrap justify-center gap-2 sm:gap-2.5"
      aria-label="Filtrar por categoría"
    >
      {VISIBLE_CATEGORIES.map((category) => {
        const active = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              active
                ? "bg-olive text-cream shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-olive/40 hover:text-olive"
            }`}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
