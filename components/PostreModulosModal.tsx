"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/cart";

interface PostreModulosModalProps {
  productName: string;
  productPrice: number;
  onClose: () => void;
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
}: PostreModulosModalProps) {
  const [selected, setSelected] = useState(OPCIONES_MODULOS[0]);
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");

  const totalPrice = calcTotal(productPrice, selected.n, selected.descuento);
  const precioUnitario = Math.round(productPrice * (1 - selected.descuento / 100));
  const ahorro = selected.n * productPrice - totalPrice;

  const handleConsultar = () => {
    if (!fecha) {
      setError("Ingresá la fecha en que lo necesitás.");
      return;
    }
    setError("");

    const precio = totalPrice.toLocaleString("es-AR");
    const mensaje =
      `¡Hola Celisan! Quiero consultar disponibilidad para un postre 🍫\n\n` +
      `*Producto:* ${productName}\n` +
      `*Unidades:* ${selected.n} (${selected.size} cm)\n` +
      `*Precio estimado:* $${precio}\n` +
      `*Fecha que lo necesito:* ${fecha}\n\n` +
      `Quedo a la espera de confirmar disponibilidad y coordinar el pago. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">
              🍫 Medida base: <strong>10×10 cm</strong> por unidad
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              A más unidades, menor precio por unidad.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">¿Cuántas unidades querés?</p>
            <div className="grid grid-cols-5 gap-2">
              {OPCIONES_MODULOS.map((opcion) => {
                const isSelected = selected.n === opcion.n;
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
                ${precioUnitario.toLocaleString("es-AR")}/u × {selected.n} {selected.n === 1 ? "unidad" : "unidades"}
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

          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              📅 ¿Para qué fecha lo necesitás? *
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => { setFecha(e.target.value); setError(""); }}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <p className="text-[10px] text-gray-400 italic text-center">
            Te consultamos disponibilidad y coordinamos el pago por WhatsApp.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-1 flex-shrink-0 bg-white">
          <button
            type="button"
            onClick={handleConsultar}
            className="w-full py-3.5 rounded-xl bg-celisan-red hover:opacity-90 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.847L.057 23.5l5.797-1.52A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.493-5.178-1.357l-.371-.22-3.841 1.007 1.027-3.748-.241-.387A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Consultar disponibilidad — ${totalPrice.toLocaleString("es-AR")}
          </button>
        </div>
      </div>
    </div>
  );
}
