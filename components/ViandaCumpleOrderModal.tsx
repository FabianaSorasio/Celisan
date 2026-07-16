"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/cart";

interface ViandaCumpleOrderModalProps {
  productName: string;
  productPrice: number;
  onClose: () => void;
}

const CANTIDADES = Array.from({ length: 10 }, (_, i) => i + 1);
const DELIVERY_GRATIS_DESDE_UNIDADES = 2;

export default function ViandaCumpleOrderModal({
  productName,
  productPrice,
  onClose,
}: ViandaCumpleOrderModalProps) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  const totalPrice = productPrice * cantidad;
  const deliveryGratis = cantidad >= DELIVERY_GRATIS_DESDE_UNIDADES;

  const validate = () => {
    const errs: string[] = [];
    if (!nombre.trim()) errs.push("Ingresá tu nombre.");
    if (!fecha) errs.push("Ingresá la fecha de entrega.");
    return errs;
  };

  const handleEnviar = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);

    const precio = totalPrice.toLocaleString("es-AR");

    const mensaje =
      `¡Hola Celisan! Quiero consultar disponibilidad para una Vianda Fiesta! 🎉\n\n` +
      `*Producto:* ${productName}\n` +
      `*Cantidad:* ${cantidad} ${cantidad === 1 ? "vianda" : "viandas"}\n` +
      `*Precio estimado:* $${precio}\n\n` +
      `*Nombre:* ${nombre.trim()}\n` +
      `*Fecha de entrega:* ${fecha}\n` +
      `\nQuedo a la espera de confirmar disponibilidad y coordinar el pago. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-celisan-red px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Vianda Fiesta!</p>
            <h2 className="text-white font-bold text-lg leading-tight">{productName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition-colors"
            aria-label="Cerrar"
          >✕</button>
        </div>

        {/* Formulario */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <p className="text-xs text-gray-500 italic">
            Completá tus datos y te contactamos por WhatsApp para confirmar disponibilidad y coordinar el pago.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">📅 Fecha de entrega *</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">¿Cuántas viandas querés?</label>
            <div className="grid grid-cols-5 gap-2">
              {CANTIDADES.map((n) => {
                const isSelected = cantidad === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCantidad(n)}
                    className={`py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200
                      ${isSelected
                        ? "bg-celisan-red text-white border-celisan-red shadow-md scale-[1.05]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-celisan-red hover:text-celisan-red"
                      }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Precio + delivery */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                ${productPrice.toLocaleString("es-AR")}/u × {cantidad}
              </p>
              <p className="text-lg font-bold text-celisan-red mt-0.5">
                ${totalPrice.toLocaleString("es-AR")}
              </p>
            </div>
            <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${deliveryGratis ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <span className="text-base">🛵</span>
              <span className={`text-[11px] font-bold leading-tight ${deliveryGratis ? "text-green-700" : "text-amber-800"}`}>
                {deliveryGratis
                  ? "Delivery gratis en San Francisco"
                  : `Delivery gratis desde ${DELIVERY_GRATIS_DESDE_UNIDADES} unidades`}
              </span>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              {errors.map((e) => (
                <p key={e} className="text-xs text-red-600">• {e}</p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 flex-shrink-0 bg-white">
          <button
            type="button"
            onClick={handleEnviar}
            className="w-full py-3.5 rounded-xl bg-celisan-red hover:opacity-90 text-white font-bold text-sm transition-opacity flex items-center justify-center gap-2 shadow-sm"
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
