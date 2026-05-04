"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CartItem } from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variant?: string, sabor?: CartItem["sabor"]) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variant?: string,
    sabor?: CartItem["sabor"]
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = `${item.productId}-${item.variant ?? ""}-${item.sabor ?? ""}`;
        const existing = prev.find(
          (i) => `${i.productId}-${i.variant ?? ""}-${i.sabor ?? ""}` === key
        );
        if (existing) {
          return prev.map((i) =>
            `${i.productId}-${i.variant ?? ""}-${i.sabor ?? ""}` === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, variant?: string, sabor?: CartItem["sabor"]) => {
    setItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.productId === productId &&
              (i.variant ?? undefined) === variant &&
              (i.sabor ?? undefined) === sabor
            )
        )
    );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      quantity: number,
      variant?: string,
      sabor?: CartItem["sabor"]
    ) => {
      if (quantity <= 0) {
        removeItem(productId, variant, sabor);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId &&
          (i.variant ?? undefined) === variant &&
          (i.sabor ?? undefined) === sabor
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
