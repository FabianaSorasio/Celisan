"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

interface ProductCardProps {
  product: Product;
}

type Sabor = "Dulces" | "Salados";

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isCongelado = product.category === "Waffles Congelados";
  const hasVariantes = !!product.variantes?.length;

  const firstInStock = product.variantes?.find((v) => v.stock > 0);
  const [sabor, setSabor] = useState<Sabor>("Dulces");
  const [variante, setVariante] = useState<string>(
    firstInStock?.nombre ?? product.variantes?.[0]?.nombre ?? ""
  );

  const selectedVarianteObj = product.variantes?.find(
    (v) => v.nombre === variante
  );
  const varianteSinStock = selectedVarianteObj
    ? selectedVarianteObj.stock <= 0
    : false;

  const outOfStock = hasVariantes ? varianteSinStock : product.stock <= 0;

  const highlightedTitle = product.name.match(/(.*)\s(x[24]\.?)$/i);
  const detailLines = product.description
    ? product.description.split("\n").filter(Boolean)
    : [];

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-antigravity-hover border border-gray-100/80 flex flex-col h-full"
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
      }}
    >
      <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${product.video ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
          loading="lazy"
          decoding="async"
        />
        {product.video && (
          <>
            <video
              src={product.video}
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              autoPlay
              muted
              loop
              playsInline
            />
            <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/50 text-white text-xs font-semibold flex items-center gap-1 group-hover:opacity-0 transition-opacity duration-300">
              ▶ Video
            </span>
          </>
        )}
        {!hasVariantes && product.stock <= 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gray-900/80 text-white text-xs font-semibold">
            Sin stock
          </span>
        )}
      </div>

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

        {/* Selector Waffles Congelados (Dulces / Salados) */}
        {isCongelado && (
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

        {/* Selector de variantes (ej: Hamburguesas de legumbres) */}
        {hasVariantes && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Elegí variante
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {product.variantes!.map((v) => {
                const isSelected = variante === v.nombre;
                const sinStock = v.stock <= 0;
                return (
                  <button
                    key={v.nombre}
                    type="button"
                    disabled={sinStock}
                    onClick={() => setVariante(v.nombre)}
                    className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold border transition-all duration-200
                      ${
                        sinStock
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-olive text-cream border-olive shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-olive hover:text-olive"
                      }`}
                  >
                    <span>{v.nombre}</span>
                    {sinStock ? (
                      <span className="text-[10px] font-normal text-gray-400 mt-0.5">
                        Sin stock
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-normal mt-0.5 ${
                          isSelected ? "text-cream/80" : "text-olive"
                        }`}
                      >
                        ¡Hay stock!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
                ...(isCongelado ? { sabor } : {}),
                ...(hasVariantes ? { sabor: variante } : {}),
              })
            }
            className="px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-light transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-olive"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
