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
    <aside className="w-full lg:w-56 flex-shrink-0">
      {/* Mobile / tablet: chips que se envuelven en varias líneas */}
      <div className="flex lg:hidden flex-wrap gap-2">
        {VISIBLE_CATEGORIES.map((category) => {
          const active = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? "bg-olive text-cream shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-olive/40 hover:text-olive"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Desktop: columna fija lateral */}
      <nav
        className="hidden lg:flex lg:sticky lg:top-[5.5rem] flex-col gap-2"
        aria-label="Filtrar por categoría"
      >
        {VISIBLE_CATEGORIES.map((category) => {
          const active = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
    </aside>
  );
}
