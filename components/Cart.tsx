"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import {
  cartItemKey,
  cartTotal,
  calcDeliveryCost,
  formatWhatsAppMessage,
  itemSubtotal,
  DELIVERY_GRATIS_DESDE,
  DELIVERY_COSTO,
  WHATSAPP_NUMBER,
  RETIRO_DIRECCION,
  RETIRO_HORARIOS,
  DELIVERY_HORARIOS,
} from "@/lib/cart";

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  // Formulario
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [entrega, setEntrega] = useState<"retiro" | "delivery">("retiro");
  const [calle, setCalle] = useState("");
  const [altura, setAltura] = useState("");
  const [detalle, setDetalle] = useState("");
  const [dia, setDia] = useState("");
  const [pago, setPago] = useState<"efectivo" | "transferencia">("transferencia");
  const [errors, setErrors] = useState<string[]>([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  const subtotal = cartTotal(items);
  const deliveryCost = calcDeliveryCost(subtotal, entrega);
  const total = subtotal + deliveryCost;

  const opcionesDia = entrega === "retiro" ? RETIRO_HORARIOS : DELIVERY_HORARIOS;
  const horarioSeleccionado = opcionesDia.find((o) => o.dia === dia)?.horario ?? "";

  const cambiarEntrega = (nueva: "retiro" | "delivery") => {
    setEntrega(nueva);
    setDia("");
  };

  const validate = () => {
    const errs: string[] = [];
    if (!nombre.trim()) errs.push("Ingresá tu nombre y apellido.");
    if (!telefono.trim()) errs.push("Ingresá tu número de teléfono.");
    if (!dia) errs.push(entrega === "retiro" ? "Elegí un día de retiro." : "Elegí un día de entrega.");
    if (entrega === "delivery") {
      if (!calle.trim()) errs.push("Ingresá la calle.");
      if (!altura.trim()) errs.push("Ingresá la altura.");
    }
    return errs;
  };

  const handleConfirm = () => {
    if (items.length === 0) return;
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    const text = encodeURIComponent(
      formatWhatsAppMessage({
        items,
        subtotal,
        deliveryCost,
        total,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        entrega,
        calle: calle.trim(),
        altura: altura.trim(),
        detalle: detalle.trim(),
        pago,
        dia,
        horario: horarioSeleccionado,
      })
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    clearCart();
    setPedidoEnviado(true);
  };

  if (pedidoEnviado) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => { setPedidoEnviado(false); onClose(); }} />
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-lg font-bold text-celisan-red">¡Pedido enviado!</div>
          <p className="text-sm text-gray-600 mt-2">
            Se abrió WhatsApp con el detalle. Completá el envío desde la app.
          </p>
          <button
            type="button"
            onClick={() => { setPedidoEnviado(false); onClose(); }}
            className="mt-5 w-full py-2.5 rounded-xl bg-celisan-red text-white font-semibold hover:opacity-90 transition-opacity"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-white flex flex-col shadow-2xl">

        {/* Header marca */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-celisan-red">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Mi Pedido
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold transition-colors" aria-label="Cerrar">✕</button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">

          {/* Lista de productos */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2 p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {items.map((item) => (
                <div key={cartItemKey(item)} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 leading-snug">
                      {item.name}
                      {item.sabor && <span className="text-gray-500 font-normal"> ({item.sabor})</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">${item.price.toLocaleString("es-AR")} c/u</p>
                    <p className="text-sm font-bold text-celisan-red mt-1">${itemSubtotal(item).toLocaleString("es-AR")}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.sabor)} className="w-7 h-7 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-lg leading-none flex items-center justify-center" aria-label="Menos">−</button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.sabor)} className="w-7 h-7 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-lg leading-none flex items-center justify-center" aria-label="Más">+</button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.productId, item.sabor)} className="text-xs text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="px-3 pb-4 space-y-3">

              {/* Datos del cliente */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-base">👤</span>
                  <span className="font-semibold text-sm text-gray-700">Datos del Cliente</span>
                </div>
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Nombre y apellido"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Entrega */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-base">📦</span>
                  <span className="font-semibold text-sm text-gray-700">Tipo de Entrega</span>
                </div>
                <div className="p-3 space-y-2">
                  {/* Toggle retiro / delivery */}
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      type="button"
                      onClick={() => cambiarEntrega("retiro")}
                      className={`flex-1 py-2 text-sm font-semibold transition-colors ${entrega === "retiro" ? "bg-celisan-red text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    >
                      Retiro en local
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarEntrega("delivery")}
                      className={`flex-1 py-2 text-sm font-semibold transition-colors border-l border-gray-200 ${entrega === "delivery" ? "bg-celisan-red text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    >
                      🛵 Delivery
                    </button>
                  </div>

                  {/* Selector de día (retiro y delivery) */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 px-1">
                      {entrega === "retiro" ? "Día de retiro" : "Día de entrega"}
                    </label>
                    <select
                      value={dia}
                      onChange={(e) => setDia(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red bg-white"
                    >
                      <option value="">Elegí un día...</option>
                      {opcionesDia.map((o) => (
                        <option key={o.dia} value={o.dia}>
                          {o.dia} — {o.horario}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 px-1 mt-1">
                      Fuera de estos días/horarios, consultanos por WhatsApp.
                    </p>
                  </div>

                  {entrega === "retiro" && (
                    <p className="text-xs text-gray-500 px-1">
                      📍 Retirás en <strong>{RETIRO_DIRECCION}</strong>
                    </p>
                  )}

                  {entrega === "delivery" && (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Calle"
                          value={calle}
                          onChange={(e) => setCalle(e.target.value)}
                          className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Altura"
                          value={altura}
                          onChange={(e) => setAltura(e.target.value)}
                          className="w-24 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Barrio, piso, casa, referencias..."
                        value={detalle}
                        onChange={(e) => setDetalle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-celisan-red/30 focus:border-celisan-red placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-400 px-1">
                        📍 Delivery solo en <strong>San Francisco (Córdoba)</strong>
                      </p>

                      {/* Info costo de envío */}
                      <div className={`rounded-lg px-3 py-2 text-xs font-medium ${deliveryCost === 0 ? "bg-celisan-red/10 text-celisan-red border border-celisan-red/20" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                        {deliveryCost === 0
                          ? "🎉 ¡Envío gratis por compra mayor a $30.000!"
                          : `🛵 Costo de envío: $${DELIVERY_COSTO.toLocaleString("es-AR")} — pedidos desde $${DELIVERY_GRATIS_DESDE.toLocaleString("es-AR")} son gratis`}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-base">💳</span>
                  <span className="font-semibold text-sm text-gray-700">Método de Pago</span>
                </div>
                <div className="p-3">
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setPago("efectivo")}
                      className={`flex-1 py-2 text-sm font-semibold transition-colors ${pago === "efectivo" ? "bg-celisan-red text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    >
                      💵 Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPago("transferencia")}
                      className={`flex-1 py-2 text-sm font-semibold transition-colors border-l border-gray-200 ${pago === "transferencia" ? "bg-celisan-red text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    >
                      🏦 Transferencia
                    </button>
                  </div>
                </div>
              </div>

              {/* Errores de validación */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  {errors.map((e) => (
                    <p key={e} className="text-xs text-red-600">• {e}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer fijo */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            {/* Subtotal + envío + total */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-AR")}</span>
              </div>
              {entrega === "delivery" && (
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span className={deliveryCost === 0 ? "text-celisan-red font-medium" : ""}>
                    {deliveryCost === 0 ? "Gratis 🎉" : `$${deliveryCost.toLocaleString("es-AR")}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-gray-800 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span className="text-celisan-red">${total.toLocaleString("es-AR")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl bg-celisan-red hover:opacity-90 text-white font-bold text-sm transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.847L.057 23.5l5.797-1.52A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.493-5.178-1.357l-.371-.22-3.841 1.007 1.027-3.748-.241-.387A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Finalizar Pedido por WhatsApp
            </button>

            <button type="button" onClick={clearCart} className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-600">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
