"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import DesayunoOrderModal from "@/components/DesayunoOrderModal";
import PostreModulosModal from "@/components/PostreModulosModal";

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-[10px] font-normal text-gray-400 mt-0.5 block">Sin stock</span>;
  if (stock === 1) return <span className="text-[10px] font-bold text-orange-500 mt-0.5 block">¡Queda uno solo!</span>;
  return <span className="text-[10px] font-bold text-green-600 mt-0.5 block">¡Hay stock!</span>;
}

interface ProductCardProps {
  product: Product;
}

type Sabor = "Dulces" | "Salados";

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isDesayuno = product.category === "Desayunos y Meriendas";
  const isViandaCumple = product.category === "Vianda Cumple";
  const isPostre = product.category === "Postres individuales";
  const isPedidoEspecial = isDesayuno || isViandaCumple || isPostre;
  const [showDesayunoModal, setShowDesayunoModal] = useState(false);
  const [showPostreModal, setShowPostreModal] = useState(false);
  const isCongelado = product.category === "Waffles Congelados";
  const isCongeladoConSelector = isCongelado && !product.sinSelectorSabor;
  const hasVariantes = !!product.variantes?.length;

  const firstInStock = product.variantes?.find((v) => v.stock > 0);
  const [sabor, setSabor] = useState<Sabor>("Dulces");
  const [variante, setVariante] = useState<string>(
    firstInStock?.nombre ?? product.variantes?.[0]?.nombre ?? ""
  );

  const selectedVarianteObj = product.variantes?.find((v) => v.nombre === variante);

  // Si el producto tiene stock por sabor, usarlo; si no, usar stock general
  const dulcesSinStock = product.stockDulces === 0;
  const saladosSinStock = product.stockSalados === 0;
  // Desayunos, Vianda Cumple y Postres siempre disponibles (son productos a pedido)
  const outOfStock = isPedidoEspecial
    ? false
    : hasVariantes
    ? (selectedVarianteObj ? selectedVarianteObj.stock <= 0 : true)
    : isCongeladoConSelector
    ? (sabor === "Dulces" ? dulcesSinStock : saladosSinStock)
    : product.stock <= 0;

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
        {outOfStock && (
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

        {/* Badge de delivery gratis para Desayunos y Vianda Cumple */}
        {product.category === "Desayunos y Meriendas" && (
          <div className="mb-3 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <span className="text-base">🛵</span>
            <span className="text-xs font-bold text-green-700 leading-tight">
              Delivery en la ciudad de San Francisco gratis!
            </span>
          </div>
        )}
        {product.category === "Vianda Cumple" && (
          <div className="mb-3 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <span className="text-base">🛵</span>
            <span className="text-xs font-bold text-green-700 leading-tight">
              Delivery en la ciudad de San Francisco gratis a partir de 2 unidades!
            </span>
          </div>
        )}

        {/* Badge postre individual por encargo */}
        {isPostre && (
          <div className="mb-3 flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
            <span className="text-base">🍫</span>
            <span className="text-xs font-bold text-amber-800 leading-tight">
              Individual 10×10 cm · Podés agrandar por módulo
            </span>
          </div>
        )}

        {/* Selector de variantes (ej: Hamburguesas de legumbres) */}
        {hasVariantes && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Elegí variante</p>
            <div className="grid grid-cols-2 gap-2">
              {product.variantes!.map((v) => {
                const isSelected = variante === v.nombre;
                const sinStock = v.stock <= 0;
                return (
                  <button
                    key={v.nombre}
                    type="button"
                    disabled={sinStock}
                    onClick={() => setVariante(v.nombre)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold border-2 transition-all duration-200
                      ${sinStock
                        ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                        : isSelected
                        ? "bg-olive text-cream border-olive shadow-md scale-[1.03]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-olive hover:text-olive"
                      }`}
                  >
                    <span className="text-sm">{v.nombre}</span>
                    <StockBadge stock={v.stock} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isCongeladoConSelector && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Elegí sabor
            </p>
            <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 shadow-inner">
              <button
                type="button"
                disabled={dulcesSinStock}
                onClick={() => setSabor("Dulces")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                  sabor === "Dulces"
                    ? "bg-[#C62828] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dulces
                {dulcesSinStock && <span className="block text-[9px] font-normal leading-tight">Sin stock</span>}
              </button>
              <button
                type="button"
                disabled={saladosSinStock}
                onClick={() => setSabor("Salados")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                  sabor === "Salados"
                    ? "bg-[#55572F] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Salados
                {saladosSinStock && <span className="block text-[9px] font-normal leading-tight">Sin stock</span>}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-celisan-red font-bold text-lg">
            ${product.price.toLocaleString("es-AR")}
          </span>
          {isDesayuno ? (
            <button
              type="button"
              onClick={() => setShowDesayunoModal(true)}
              className="px-5 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Encargar
            </button>
          ) : isPostre ? (
            <button
              type="button"
              onClick={() => setShowPostreModal(true)}
              className="px-5 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Encargar
            </button>
          ) : (
            <button
              type="button"
              disabled={outOfStock}
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  ...(hasVariantes ? { sabor: variante } : isCongelado ? { sabor } : {}),
                })
              }
              className="px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-light transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-olive"
            >
              {isViandaCumple ? "Encargar" : "Agregar"}
            </button>
          )}
        </div>
      </div>

      {showDesayunoModal && (
        <DesayunoOrderModal
          productName={product.name}
          productPrice={product.price}
          onClose={() => setShowDesayunoModal(false)}
        />
      )}

      {showPostreModal && (
        <PostreModulosModal
          productName={product.name}
          productPrice={product.price}
          onClose={() => setShowPostreModal(false)}
        />
      )}
    </article>
  );
}
