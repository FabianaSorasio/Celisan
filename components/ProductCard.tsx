"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import DesayunoOrderModal from "@/components/DesayunoOrderModal";
import PostreModulosModal from "@/components/PostreModulosModal";
import ViandaCumpleOrderModal from "@/components/ViandaCumpleOrderModal";
import ImageModal from "@/components/ImageModal";
import VideoModal from "@/components/VideoModal";

function StockBadge({ stock, isSelected }: { stock: number; isSelected?: boolean }) {
  if (stock <= 0) return <span className="text-[10px] font-normal text-gray-400 mt-0.5 block">Sin stock</span>;
  if (stock === 1)
    return (
      <span className={`text-[10px] font-bold mt-0.5 block ${isSelected ? "text-orange-200" : "text-orange-500"}`}>
        ¡Queda uno solo!
      </span>
    );
  return (
    <span className={`text-[10px] font-bold mt-0.5 block ${isSelected ? "text-lime-300" : "text-green-700"}`}>
      ¡Hay stock!
    </span>
  );
}

interface ProductCardProps {
  product: Product;
}

type Sabor = "Dulces" | "Salados";

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isDesayuno = product.category === "Desayunos y Meriendas";
  const isViandaCumple = product.category === "Vianda Fiesta!";
  const isPostre = product.category === "Postres individuales";
  const isPedidoEspecial = isDesayuno || isViandaCumple || isPostre;
  const [showDesayunoModal, setShowDesayunoModal] = useState(false);
  const [showPostreModal, setShowPostreModal] = useState(false);
  const [showViandaCumpleModal, setShowViandaCumpleModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // Carrusel — activo sólo cuando hay más de 1 imagen en el array
  const gallery = product.images && product.images.length > 1 ? product.images : null;
  const [slide, setSlide] = useState(0);
  const currentImage = gallery ? gallery[slide] : product.image;
  const prevSlide = () => setSlide((s) => (s - 1 + (gallery?.length ?? 1)) % (gallery?.length ?? 1));
  const nextSlide = () => setSlide((s) => (s + 1) % (gallery?.length ?? 1));
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
  const dulcesSinStock = (product.stockDulces ?? 0) <= 0;
  const saladosSinStock = (product.stockSalados ?? 0) <= 0;
  // Desayunos, Vianda Fiesta! y Postres siempre disponibles (son productos a pedido)
  const outOfStock = isPedidoEspecial
    ? false
    : hasVariantes
    ? (selectedVarianteObj ? selectedVarianteObj.stock <= 0 : true)
    : isCongeladoConSelector
    ? (sabor === "Dulces" ? dulcesSinStock : saladosSinStock)
    : product.stock <= 0;

  // Límite real de stock para lo que se está por agregar (según variante/sabor elegido)
  const currentMaxStock = hasVariantes
    ? selectedVarianteObj?.stock ?? 0
    : isCongeladoConSelector
    ? (sabor === "Dulces" ? product.stockDulces ?? 0 : product.stockSalados ?? 0)
    : product.stock;

  const highlightedTitle = product.name.match(/(.*)\s(x[24]\.?)$/i);
  const detailLines = product.description
    ? product.description.split("\n").filter(Boolean)
    : [];

  return (
    <article
      className={`group relative bg-white rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-300 ease-out border border-gray-100/80 flex flex-col h-full ${showDesayunoModal || showPostreModal || showViandaCumpleModal ? "" : "hover:-translate-y-2 hover:shadow-antigravity-hover"}`}
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
      }}
    >
      <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
        <button
          type="button"
          className="absolute inset-0 w-full h-full focus:outline-none cursor-zoom-in"
          onClick={() => (product.video ? setVideoOpen(true) : setImageOpen(true))}
          aria-label={product.video ? `Ver video de ${product.name}` : `Ampliar imagen de ${product.name}`}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 scale-[var(--img-zoom)] group-hover:scale-[calc(var(--img-zoom)*1.05)]"
            style={{
              objectPosition: `${product.imageX ?? 50}% ${product.imageY ?? 50}%`,
              transformOrigin: `${product.imageX ?? 50}% ${product.imageY ?? 50}%`,
              ["--img-zoom" as string]: product.imageZoom ?? 1,
            }}
            loading="lazy"
            decoding="async"
          />
        </button>
        {gallery && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors z-10"
              aria-label="Foto anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors z-10"
              aria-label="Foto siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSlide(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === slide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        {product.video && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVideoOpen(true);
            }}
            className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/50 text-white text-xs font-semibold flex items-center gap-1 hover:bg-black/70 transition-colors"
          >
            ▶ Video
          </button>
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
        ) : isDesayuno && product.description ? (
          (() => {
            const lines = product.description.split("\n").filter(Boolean);
            const PREVIEW = 3;
            const needsToggle = lines.length > PREVIEW;
            const visible = showFullDesc ? lines : lines.slice(0, PREVIEW);
            return (
              <div className="mb-3">
                <p className="text-sm text-gray-600 whitespace-pre-line first-line:font-bold first-line:text-celisan-red">
                  {visible.join("\n")}
                </p>
                {needsToggle && (
                  <button
                    type="button"
                    onClick={() => setShowFullDesc((v) => !v)}
                    className="mt-1 text-xs font-semibold text-celisan-red hover:underline focus:outline-none"
                  >
                    {showFullDesc ? "Ver menos ▲" : "Ver más ▼"}
                  </button>
                )}
              </div>
            );
          })()
        ) : product.description ? (
          <p className="text-sm text-gray-600 mb-3 whitespace-pre-line first-line:font-bold first-line:text-celisan-red">
            {product.description}
          </p>
        ) : (
          <div className="mb-3 h-1" aria-hidden />
        )}

        {/* Badge de delivery gratis para Desayunos y Vianda Fiesta! */}
        {product.category === "Desayunos y Meriendas" && (
          <div className="mb-3 flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <span className="text-base">🛵</span>
            <span className="text-xs font-bold text-green-700 leading-tight">
              Delivery en la ciudad de San Francisco gratis!
            </span>
          </div>
        )}
        {product.category === "Vianda Fiesta!" && (
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
              Individual 10×10 cm · Podés agrandar por unidad
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
                    <StockBadge stock={v.stock} isSelected={isSelected} />
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
          <span className="flex items-center gap-2">
            {outOfStock && (
              <span className="px-2.5 py-1 rounded-lg bg-gray-900/80 text-white text-xs font-semibold">
                Sin stock
              </span>
            )}
            <span className="text-celisan-red font-bold text-lg">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </span>
          {isDesayuno ? (
            <button
              type="button"
              onClick={() => setShowDesayunoModal(true)}
              className="px-5 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Consultar
            </button>
          ) : isPostre ? (
            <button
              type="button"
              onClick={() => setShowPostreModal(true)}
              className="px-5 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Consultar
            </button>
          ) : isViandaCumple ? (
            <button
              type="button"
              onClick={() => setShowViandaCumpleModal(true)}
              className="px-5 py-2.5 rounded-xl bg-celisan-red text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Consultar
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
                  maxStock: currentMaxStock,
                  category: product.category,
                  ...(hasVariantes ? { sabor: variante } : isCongelado ? { sabor } : {}),
                })
              }
              className="px-5 py-2.5 rounded-xl bg-olive text-cream text-sm font-semibold hover:bg-olive-light transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-olive"
            >
              Agregar
            </button>
          )}
        </div>
      </div>

      {showDesayunoModal && createPortal(
        <DesayunoOrderModal
          productName={product.name}
          productPrice={product.price}
          onClose={() => setShowDesayunoModal(false)}
        />,
        document.body
      )}

      {showPostreModal && createPortal(
        <PostreModulosModal
          productName={product.name}
          productPrice={product.price}
          onClose={() => setShowPostreModal(false)}
        />,
        document.body
      )}

      {showViandaCumpleModal && createPortal(
        <ViandaCumpleOrderModal
          productName={product.name}
          productPrice={product.price}
          onClose={() => setShowViandaCumpleModal(false)}
        />,
        document.body
      )}

      {imageOpen && createPortal(
        <ImageModal
          src={currentImage}
          alt={product.name}
          onClose={() => setImageOpen(false)}
        />,
        document.body
      )}

      {videoOpen && product.video && createPortal(
        <VideoModal
          src={product.video}
          title={product.name}
          onClose={() => setVideoOpen(false)}
        />,
        document.body
      )}
    </article>
  );
}
