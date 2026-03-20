"use client";

import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  // src usa ruta exacta desde raíz: /waffle-xxx.png (archivos en /public)
  const imageSrc = product.image;

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-antigravity-hover border border-gray-100/80"
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
      }}
    >
      <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 90vw, 20rem"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
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
              })
            }
            className="px-4 py-2 rounded-xl bg-olive text-cream text-sm font-medium hover:bg-olive-light transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
