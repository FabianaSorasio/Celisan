"use client";

import { useCart } from "@/components/CartProvider";
import {
  cartTotal,
  formatWhatsAppMessage,
  WHATSAPP_NUMBER,
} from "@/lib/cart";
import { useState } from "react";

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [selectedDay, setSelectedDay] = useState<"Martes" | "Viernes">(
    "Martes"
  );

  const total = cartTotal(items);

  const handleConfirm = () => {
    if (items.length === 0) return;
    const text = encodeURIComponent(
      formatWhatsAppMessage(items, total, selectedDay)
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-black/20"
          onClick={onClose}
          aria-hidden
        />
        <div className="relative w-full max-w-sm h-full bg-white border-l border-gray-200 shadow-antigravity flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-cream">
            <h2 className="font-semibold text-olive text-lg">Carrito</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500 p-6">
            <p>Tu carrito está vacío</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm h-full bg-white border-l border-gray-200 shadow-antigravity flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-cream">
          <h2 className="font-semibold text-olive text-lg">Carrito</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => {
          const key = item.variant
            ? `${item.productId}-${item.variant}`
            : item.productId;
          return (
            <div
              key={key}
              className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {item.name}
                  {item.variant ? ` (${item.variant})` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  ${(item.price * item.quantity).toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity - 1,
                      item.variant
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity + 1,
                      item.variant
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="ml-1 text-red-600 hover:text-celisan-red text-sm"
                  aria-label="Quitar"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-200 bg-cream space-y-3">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-celisan-red">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Día de entrega
          </label>
          <select
            value={selectedDay}
            onChange={(e) =>
              setSelectedDay(e.target.value as "Martes" | "Viernes")
            }
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-800 bg-white"
          >
            <option value="Martes">Martes</option>
            <option value="Viernes">Viernes</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-celisan-red text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Confirmar Pedido (WhatsApp)
        </button>
        <button
          type="button"
          onClick={clearCart}
          className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Vaciar carrito
        </button>
      </div>
      </div>
    </div>
  );
}
