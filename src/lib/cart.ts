export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sabor?: "Dulces" | "Salados";
}

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  nombre: string;
  telefono: string;
  entrega: "retiro" | "delivery";
  calle?: string;
  altura?: string;
  detalle?: string;
  pago: "efectivo" | "transferencia";
}

export const DELIVERY_GRATIS_DESDE = 30000;
export const DELIVERY_COSTO = 2000;
export const WHATSAPP_NUMBER = "5493564626508";

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function itemSubtotal(item: CartItem): number {
  return item.price * item.quantity;
}

export function cartItemKey(item: Pick<CartItem, "productId" | "sabor">): string {
  return `${item.productId}-${item.sabor ?? ""}`;
}

export function calcDeliveryCost(subtotal: number, entrega: "retiro" | "delivery"): number {
  if (entrega !== "delivery") return 0;
  return subtotal >= DELIVERY_GRATIS_DESDE ? 0 : DELIVERY_COSTO;
}

export function formatWhatsAppMessage(order: OrderDetails): string {
  const lines = order.items.map((i) => {
    const sub = itemSubtotal(i);
    const saborLabel = i.sabor ? ` (${i.sabor})` : "";
    return `• ${i.quantity} x ${i.name}${saborLabel} — $${sub.toLocaleString("es-AR")}`;
  });

  const entregaLine =
    order.entrega === "retiro"
      ? "Retiro en local"
      : `Delivery a: ${order.calle} ${order.altura}${order.detalle ? `, ${order.detalle}` : ""}`;

  const deliveryLine =
    order.entrega === "delivery"
      ? order.deliveryCost === 0
        ? "\n🎉 Envío gratis (compra mayor a $30.000)"
        : `\n🛵 Costo de envío: $${order.deliveryCost.toLocaleString("es-AR")}`
      : "";

  const pagoLabel =
    order.pago === "efectivo" ? "Efectivo" : "Transferencia bancaria";

  return (
    `¡Hola Celisan! Quiero hacer un pedido 🛒\n\n` +
    `*Productos:*\n${lines.join("\n")}\n\n` +
    `*Subtotal:* $${order.subtotal.toLocaleString("es-AR")}` +
    deliveryLine + "\n" +
    `*Total: $${order.total.toLocaleString("es-AR")}*\n\n` +
    `👤 *Cliente:* ${order.nombre}\n` +
    `📱 *Teléfono:* ${order.telefono}\n` +
    `📦 *Entrega:* ${entregaLine}\n` +
    `💳 *Pago:* ${pagoLabel}`
  );
}
