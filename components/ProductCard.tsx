"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import VideoModal from "@/components/VideoModal";

interface ProductCardProps {
  product: Product;
}

type Sabor = "Dulces" | "Salados";

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const isCongelado = product.category === "Waffles Congelados";

  // Los waffles de chocolate son solo dulces → no muestran selector de sabor
  const isChocolate = isCongelado && product.id.startsWith("wc-choc");
  const showSaborSelector = isCongelado && !isChocolate;

  const [sabor, setSabor] = useState<Sabor>("Dulces");
  const [videoOpen, setVideoOpen] = useState(false);
  const outOfStock = product.stock <= 0;

  const highlightedTitle = product.name.match(/(.*)\s(x[24]\.?)$/i);
  const detailLines = product.description
    ? product.description.split("\n").filter(Boolean)
    : [];

  return (
    <>
      <article
        className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-antigravity-hover border border-gray-100/80 flex flex-col h-full"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
        }}
      >
        {/* ── Imagen ──────────────────────────────────────────────── */}
        <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* Botón "Ver video" — solo si el producto tiene campo video */}
          {product.video && (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-semibold hover:bg-black/80 active:scale-95 transition-all backdrop-blur-sm z-10"
              aria-label={`Ver video de ${product.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Ver video
            </button>
          )}

          {outOfStock && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gray-900/80 text-white text-xs font-semibold">
              Sin stock
            </span>
          )}
        </div>

        {/* ── Contenido ───────────────────────────────────────────── */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {isCongelado && highlightedTitle ? (
              <>
                {highlightedTitle[1]}{" "}
                <strong>{highlightedTitle[2]}</strong>
              </>
            ) : (
              product.name
            )}
          </h3>

          {isCongelado ? (
            detailLines.length > 0 ? (
              <div className="mb-3 space-y-0.5">
                {detailLines.map((line) => (
                  <p
                    key={line}
                    className="text-sm font-semibold text-celisan-red leading-snug"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="mb-3 h-2" aria-hidden />
            )
          ) : product.description ? (
            <p className="text-sm text-gray-600 mb-3 whitespace-pre-line first-line:font-bold first-line:text-celisan-red">
              {product.description}
            </p>
          ) : (
            <div className="mb-3 h-1" aria-hidden />
          )}

          {/* Selector de sabor — solo para waffles de vainilla (no chocolate) */}
          {showSaborSelector && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Elegí sabor
              </p>
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

          {/* Precio + Agregar */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-celisan-red font-bold text-lg">
              ${product.price.toLocaleString("es-AR")}
            </span>
            <button
              type="button"
              disabled={outOfStock}
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  ...(showSaborSelector ? { sabor } : {}),
                })
              }
              className="px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-light transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-olive"
            >
              Agregar
            </button>
          </div>
        </div>
      </article>

      {/* Modal de video — se renderiza fuera del article para evitar overflow:hidden */}
      {videoOpen && product.video && (
        <VideoModal
          src={product.video}
          title={product.name}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </>
  );
}
