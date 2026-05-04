"use client";

import { useState } from "react";
import Cart from "./Cart";
import { useCart } from "./CartProvider";
import Image from "next/image";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCart();
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-gray-200/80">
        <div className="relative max-w-6xl mx-auto px-4 py-4 flex items-center justify-between min-h-[3.5rem]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Sin TACC a la izquierda */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-16 flex items-center justify-start">
              <img
                src="/sin_gluten_legal-01.png"
                alt="Sin TACC"
                className="w-full h-full object-contain object-left"
              />
            </div>
          </div>

          {/* Logo Celisan Central */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img 
              src="/logo-celisan.png" 
              alt="Celisan" 
              className="h-10 sm:h-14 md:h-16 w-auto transition-transform hover:scale-105" 
            />
          </div>

          {/* Botón Carrito a la derecha */}
          <button
            type="button"
            onClick={() => setCartOpen((o) => !o)}
            className="relative flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-olive text-cream font-medium hover:bg-olive-light transition-colors"
          >
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-celisan-red text-white text-xs font-bold">
                {count}
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>
      </header>
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </>
  );
}
