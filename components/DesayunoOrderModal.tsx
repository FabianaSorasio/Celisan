"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/cart";

interface DesayunoOrderModalProps {
  productName: string;
  productPrice: number;
  onClose: () => void;
}

const MOTIVOS = [
  "Cumpleaños",
  "Día festivo",
  "Regalo sorpresa",
  "Aniversario",
  "Día de la madre / padre",
  "Otro",
];

const GUSTOS_WAFFLE = [
  "Dulce — vainilla",
  "Salado",
];

export default function DesayunoOrderModal({
  productName,
  productPrice,
  onClose,
}: DesayunoOrderModalProps) {
  const isClasico = productName.toLowerCase().includes("clásico") || productName.toLowerCase().includes("clasico");
  const [para, setPara] = useState("");
  const [deParte, setDeParte] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [motivoCustom, setMotivoCustom] = useState("");
  const [gustoWaffle, setGustoWaffle] = useState(GUSTOS_WAFFLE[0]);
  const [direccion, setDireccion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const errs: string[] = [];
    if (!para.trim()) errs.push("Ingresá para quién es el desayuno.");
    if (!deParte.trim()) errs.push("Ingresá quién lo manda.");
    if (!direccion.trim()) errs.push("Ingresá la dirección de entrega.");
    if (motivo === "Otro" && !motivoCustom.trim()) errs.push("Describí el motivo.");
    return errs;
  };

  const handleEnviar = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);

    const motivoFinal = motivo === "Otro" ? motivoCustom.trim() : motivo;
    const precio = productPrice.toLocaleString("es-AR");

    const mensaje =
      `¡Hola Celisan! Quiero encargar un desayuno 🥐\n\n` +
      `*Producto:* ${productName} — $${precio}\n\n` +
      `*Para:* ${para.trim()}\n` +
      `*De parte de:* ${deParte.trim()}\n` +
      `*Motivo:* ${motivoFinal}\n` +
      (isClasico ? `*Gusto de waffle a elección:* ${gustoWaffle}\n` : "") +
      `*Dirección de envío:* ${direccion.trim()}\n` +
      (comentarios.trim() ? `*Comentarios:* ${comentarios.trim()}\n` : "") +
      `\nQuedo a la espera de confirmar el pedido y el pago. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-celisan-red px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Encargo especial</p>
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
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-gray-500 italic">
            Completá los datos del regalo y te contactamos por WhatsApp para coordinar el envío y el pago.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">¿Para quién es? *</label>
            <input
              type="text"
              placeholder="Nombre del destinatario"
              value={para}
              onChange={(e) => setPara(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">¿Quién lo manda? *</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={deParte}
              onChange={(e) => setDeParte(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Motivo *</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red bg-white"
            >
              {MOTIVOS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {motivo === "Otro" && (
              <input
                type="text"
                placeholder="Describí el motivo..."
                value={motivoCustom}
                onChange={(e) => setMotivoCustom(e.target.value)}
                className="mt-2 w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
              />
            )}
          </div>

          {isClasico && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                🧇 Gusto del waffle a elección *
              </label>
              <select
                value={gustoWaffle}
                onChange={(e) => setGustoWaffle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red bg-white"
              >
                {GUSTOS_WAFFLE.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección de envío *</label>
            <input
              type="text"
              placeholder="Calle, altura, barrio"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
            />
            <p className="text-[10px] text-gray-400 mt-1 px-1">📍 Delivery solo en San Francisco (Córdoba)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Comentarios adicionales</label>
            <textarea
              placeholder="Mensaje especial, preferencias, horario de entrega..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400 resize-none"
            />
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
        <div className="px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={handleEnviar}
            className="w-full py-3.5 rounded-xl bg-celisan-red hover:opacity-90 text-white font-bold text-sm transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.847L.057 23.5l5.797-1.52A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.493-5.178-1.357l-.371-.22-3.841 1.007 1.027-3.748-.241-.387A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Consultar disponibilidad por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
