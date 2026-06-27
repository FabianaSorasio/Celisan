"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import { cartItemKey } from "@/lib/cart";
import VideoModal from "@/components/VideoModal";
import ImageModal from "@/components/ImageModal";

interface ProductCardProps {
  product: Product;
}

type Sabor = "Dulces" | "Salados";

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();

  const isCongelado = product.category === "Waffles Congelados";

  // Los waffles de chocolate son solo dulces → no muestran selector de sabor
  const isChocolate = isCongelado && product.id.startsWith("wc-choc");
  const showSaborSelector = isCongelado && !isChocolate;

  const [sabor, setSabor] = useState<Sabor>("Dulces");
  const [videoOpen, setVideoOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const outOfStock = product.stock <= 0;

  // Carrusel — activo sólo cuando hay más de 1 imagen en el array
  const gallery = product.images && product.images.length > 1 ? product.images : null;
  const [slide, setSlide] = useState(0);
  const currentImage = gallery ? gallery[slide] : product.image;
  const prevSlide = () => setSlide((s) => (s - 1 + (gallery?.length ?? 1)) % (gallery?.length ?? 1));
  const nextSlide = () => setSlide((s) => (s + 1) % (gallery?.length ?? 1));

  // Busca el item en el carrito para mostrar contador inline
  const effectiveSabor = showSaborSelector ? sabor : undefined;
  const cartItem = items.find(
    (i) => cartItemKey(i) === cartItemKey({ productId: product.id, sabor: effectiveSabor })
  );
  const qty = cartItem?.quantity ?? 0;

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

          {/* ── Imagen / Carrusel ─────────────────────────────────── */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full focus:outline-none cursor-zoom-in"
            onClick={() => {
              if (product.video) setVideoOpen(true);
              else setImageOpen(true);
            }}
            aria-label={product.video ? `Ver video de ${product.name}` : `Ampliar imagen de ${product.name}`}
          >
            <img
              key={currentImage}
              src={currentImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </button>

          {/* ── Controles del carrusel ────────────────────────────── */}
          {gallery && (
            <>
              {/* Flecha izquierda */}
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

              {/* Flecha derecha */}
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

              {/* Dots */}
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

              {/* Ícono zoom arriba a la derecha */}
              <span className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 101.414-1.414L13.89 10.6A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
            </>
          )}

          {/* ── Sin carrusel: íconos de lupa / video ─────────────── */}
          {!gallery && !product.video && (
            <span className="absolute bottom-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 101.414-1.414L13.89 10.6A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {!gallery && product.video && (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-semibold hover:bg-black/80 active:scale-95 transition-all backdrop-blur-sm z-10"
              aria-label={`Ver video de ${product.name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Ver video
            </button>
          )}

          {outOfStock && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gray-900/80 text-white text-xs font-semibold pointer-events-none">
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

          {/* Precio + Agregar / Contador */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-celisan-red font-bold text-lg">
              ${product.price.toLocaleString("es-AR")}
            </span>

            {qty > 0 ? (
              /* Contador inline cuando el producto ya está en el carrito */
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(product.id, qty - 1, effectiveSabor)
                  }
                  className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold text-base flex items-center justify-center active:scale-95 transition-all"
                  aria-label="Menos cantidad"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold text-gray-800">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(product.id, qty + 1, effectiveSabor)
                  }
                  className="w-8 h-8 rounded-lg bg-olive text-cream hover:bg-olive-light font-bold text-base flex items-center justify-center active:scale-95 transition-all"
                  aria-label="Más cantidad"
                >
                  +
                </button>
              </div>
            ) : (
              /* Botón Agregar cuando el producto no está en el carrito */
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
            )}
          </div>
        </div>
      </article>

      {/* Modal de video — fuera del article para evitar overflow:hidden */}
      {videoOpen && product.video && (
        <VideoModal
          src={product.video}
          title={product.name}
          onClose={() => setVideoOpen(false)}
        />
      )}

      {/* Lightbox de imagen — muestra la foto actual (carrusel o imagen única) */}
      {imageOpen && !product.video && (
        <ImageModal
          src={currentImage}
          alt={product.name}
          onClose={() => setImageOpen(false)}
        />
      )}
    </>
  );
}
