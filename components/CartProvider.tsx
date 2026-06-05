"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart";
import { cartItemKey } from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, sabor?: CartItem["sabor"]) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
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
        const key = cartItemKey(item);
        const existing = prev.find((i) => cartItemKey(i) === key);
        if (existing) {
          return prev.map((i) =>
            cartItemKey(i) === key
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
    (productId: string, sabor?: CartItem["sabor"]) => {
      const key = cartItemKey({ productId, sabor });
      setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
    },
    []
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      quantity: number,
      sabor?: CartItem["sabor"]
    ) => {
      if (quantity <= 0) {
        removeItem(productId, sabor);
        return;
      }
      const key = cartItemKey({ productId, sabor });
      setItems((prev) =>
        prev.map((i) => (cartItemKey(i) === key ? { ...i, quantity } : i))
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
