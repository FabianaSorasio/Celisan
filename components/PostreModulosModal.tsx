"use client";

import { useState } from "react";

interface PostreModulosModalProps {
  productName: string;
  productPrice: number;
  onClose: () => void;
  onConfirm: (modulos: number, totalPrice: number) => void;
}

// Descuento del 5% acumulativo por nivel
const OPCIONES_MODULOS = [
  { n: 1, descuento: 0,  size: "10×10" },
  { n: 2, descuento: 5,  size: "20×10" },
  { n: 4, descuento: 10, size: "20×20" },
  { n: 6, descuento: 15, size: "20×30" },
  { n: 8, descuento: 20, size: "20×40" },
];

function calcTotal(basePrice: number, n: number, descuento: number): number {
  const precioUnitario = basePrice * (1 - descuento / 100);
  return Math.round(precioUnitario * n);
}

export default function PostreModulosModal({
  productName,
  productPrice,
  onClose,
  onConfirm,
}: PostreModulosModalProps) {
  const [selected, setSelected] = useState(OPCIONES_MODULOS[0]);

  const totalPrice = calcTotal(productPrice, selected.n, selected.descuento);
  const precioUnitario = Math.round(productPrice * (1 - selected.descuento / 100));
  const ahorro = selected.n * productPrice - totalPrice;

  const handleAgregar = () => {
    onConfirm(selected.n, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-celisan-red px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Postre individual</p>
            <h2 className="text-white font-bold text-lg leading-tight">{productName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition-colors"
            aria-label="Cerrar"
          >✕</button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">
              🍫 Medida base: <strong>10×10 cm</strong> por módulo
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              A más módulos, menor precio por unidad.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">¿Cuántos módulos querés?</p>
            <div className="grid grid-cols-5 gap-2">
              {OPCIONES_MODULOS.map((opcion) => {
                const isSelected = selected.n === opcion.n;
                const total = calcTotal(productPrice, opcion.n, opcion.descuento);
                return (
                  <button
                    key={opcion.n}
                    type="button"
                    onClick={() => setSelected(opcion)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-bold border-2 transition-all duration-200
                      ${isSelected
                        ? "bg-celisan-red text-white border-celisan-red shadow-md scale-[1.05]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-celisan-red hover:text-celisan-red"
                      }`}
                  >
                    <span className="text-base font-extrabold">{opcion.n}</span>
                    <span className="text-[9px] font-normal mt-0.5 leading-tight text-center">
                      {opcion.size}
                    </span>
                    {opcion.descuento > 0 && (
                      <span className={`text-[8px] font-bold mt-0.5 ${isSelected ? "text-white/80" : "text-green-600"}`}>
                        -{opcion.descuento}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 px-1">
              📐 Medida final: {selected.size} cm
            </p>
          </div>

          {/* Precio */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                ${precioUnitario.toLocaleString("es-AR")}/u × {selected.n} {selected.n === 1 ? "módulo" : "módulos"}
              </p>
              <p className="text-lg font-bold text-celisan-red mt-0.5">
                ${totalPrice.toLocaleString("es-AR")}
              </p>
            </div>
            {ahorro > 0 && (
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1.5 rounded-lg text-center leading-tight">
                Ahorrás<br />${ahorro.toLocaleString("es-AR")}
              </span>
            )}
          </div>

          <p className="text-[10px] text-gray-400 italic text-center">
            Este producto es por encargo anticipado. Te contactaremos para coordinar.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-1">
          <button
            type="button"
            onClick={handleAgregar}
            className="w-full py-3.5 rounded-xl bg-olive hover:bg-olive-light text-cream font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agregar al carrito — ${totalPrice.toLocaleString("es-AR")}
          </button>
        </div>
      </div>
    </div>
  );
}
