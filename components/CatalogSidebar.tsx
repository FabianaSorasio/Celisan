"use client";

import { CATALOG_CATEGORIES, type CatalogCategoryFilter } from "@/lib/products";

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
      <nav
        className="lg:sticky lg:top-[5.5rem] flex flex-col gap-2"
        aria-label="Filtrar por categoría"
      >
        {CATALOG_CATEGORIES.map((category) => {
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
