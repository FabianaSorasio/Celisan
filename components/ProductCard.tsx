"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isCongelado = product.category === "congelados";
  const [sabor, setSabor] = useState<"Dulces" | "Salados">("Dulces");
  const highlightedTitle = product.name.match(/(.*)\s(x[24]\.)$/i);
  const descriptionLines = product.description.split("\n");

  const imageSrc = product.image;

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-antigravity-hover border border-gray-100/80"
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
      }}
    >
      {/* Contenedor de Imagen */}
      <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Contenido de la Card */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {isCongelado && highlightedTitle ? (
            <>
              {highlightedTitle[1]} <strong>{highlightedTitle[2]}</strong>
            </>
          ) : (
            product.name
          )}
        </h3>

        <p className="text-sm text-gray-600 mb-3 whitespace-pre-line first-line:text-celisan-red">
          {descriptionLines.map((line, index) => (
            <span key={`${product.id}-desc-${index}`} className={line.trim().startsWith("Medida:") ? "font-bold" : ""}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>

        {isCongelado && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-700 mb-2">Elegí sabor</p>
            <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 shadow-inner">
              <button
                type="button"
                onClick={() => setSabor("Dulces")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  sabor === "Dulces"
                    ? "bg-[#C62828] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dulces
              </button>
              <button
                type="button"
                onClick={() => setSabor("Salados")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  sabor === "Salados"
                    ? "bg-[#55572F] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Salados
              </button>
            </div>
          </div>
        )}

        {/* Precio y Botón Agregar */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-celisan-red font-bold text-lg">
            ${product.price.toLocaleString("es-AR")}
          </span>
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                variant: product.variant,
                sabor: isCongelado ? sabor : undefined,
              })
            }
            className="px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-light transition-all active:scale-95 shadow-sm"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
