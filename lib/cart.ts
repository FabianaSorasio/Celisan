export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatWhatsAppMessage(
  items: CartItem[],
  total: number,
  day: "Martes" | "Viernes"
): string {
  const lines = items.map(
    (i) => `${i.quantity}x ${i.name}${i.variant ? ` (${i.variant})` : ""} - $${i.price * i.quantity}`
  );
  const detail = lines.join("\n");
  return `¡Hola Celisan! Quiero encargar:\n${detail}\n\nPara el día ${day}.\nTotal: $${total}`;
}

export const WHATSAPP_NUMBER = "5491112345678"; // Reemplazar con número real
