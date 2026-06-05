"use client";

import { useCart } from "@/components/CartProvider";
import {
  cartItemKey,
  cartTotal,
  formatWhatsAppMessage,
  itemSubtotal,
  WHATSAPP_NUMBER,
} from "@/lib/cart";
import { useState } from "react";

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  const total = cartTotal(items);

  const handleConfirm = () => {
    if (items.length === 0) return;
    const text = encodeURIComponent(formatWhatsAppMessage(items, total));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    clearCart();
    setPedidoEnviado(true);
  };

  return (
    <>
      {pedidoEnviado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            aria-hidden
            onClick={() => setPedidoEnviado(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-antigravity p-6">
            <div className="text-celisan-red text-lg font-semibold">
              Pedido enviado
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Abrimos WhatsApp con el detalle de tu pedido. Completá el envío desde la app.
            </p>
            <button
              type="button"
              onClick={() => setPedidoEnviado(false)}
              className="mt-4 w-full py-2 rounded-xl bg-celisan-red text-white font-semibold hover:opacity-90 transition-opacity"
            >
              OK
            </button>
          </div>
        </div>
      )}

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

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-6">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => {
                  const subtotal = itemSubtotal(item);
                  return (
                    <div
                      key={cartItemKey(item)}
                      className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.name}
                          {item.sabor ? (
                            <span className="text-gray-600 font-normal">
                              {" "}
                              (Sabor: {item.sabor})
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ${item.price.toLocaleString("es-AR")} c/u
                        </p>
                        <p className="text-sm font-semibold text-celisan-red mt-1">
                          Subtotal: ${subtotal.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.sabor
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                            aria-label="Menos cantidad"
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
                                item.sabor
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                            aria-label="Más cantidad"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.productId, item.sabor)
                          }
                          className="text-xs text-red-600 hover:text-celisan-red font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-200 bg-cream space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-olive">
                    Total general
                  </span>
                  <span className="text-2xl font-bold text-celisan-red">
                    ${total.toLocaleString("es-AR")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-3 rounded-xl bg-celisan-red text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Confirmar Pedido por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
