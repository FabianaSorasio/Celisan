export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sabor?: "Dulces" | "Salados";
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function itemSubtotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function cartItemKey(item: Pick<CartItem, "productId" | "sabor">): string {
  return `${item.productId}-${item.sabor ?? ""}`;
}

export function formatWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = items.map((i) => {
    const subtotal = itemSubtotal(i);
    const saborLabel = i.sabor ? ` (Sabor: ${i.sabor})` : "";
    return `${i.quantity} x ${i.name}${saborLabel} — Subtotal: $${subtotal.toLocaleString("es-AR")}`;
  });
  const detail = lines.join("\n");
  const totalFormatted = total.toLocaleString("es-AR");
  return (
    `¡Hola Celisan! Quiero confirmar mi pedido:\n\n` +
    `${detail}\n\n` +
    `*Total general: $${totalFormatted}*\n\n` +
    `Método de pago: Transferencia bancaria`
  );
}

export const WHATSAPP_NUMBER = "5493564626508";
