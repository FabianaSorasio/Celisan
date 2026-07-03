export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sabor?: string;
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

/** Costo del delivery en pesos */
export const DELIVERY_COSTO = 2000;

/** Monto mínimo para envío gratis */
export const DELIVERY_GRATIS_DESDE = 30000;

/**
 * Calcula el costo de envío según tipo de entrega y subtotal.
 * Si es retiro en local → 0.
 * Si el subtotal supera DELIVERY_GRATIS_DESDE → 0.
 * En otro caso → DELIVERY_COSTO.
 */
export function calcDeliveryCost(
  subtotal: number,
  entrega: "retiro" | "delivery"
): number {
  if (entrega === "retiro") return 0;
  if (subtotal >= DELIVERY_GRATIS_DESDE) return 0;
  return DELIVERY_COSTO;
}

export interface FormatWhatsAppParams {
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  nombre: string;
  telefono: string;
  entrega: "retiro" | "delivery";
  calle: string;
  altura: string;
  detalle: string;
  pago: "efectivo" | "transferencia";
}

export function formatWhatsAppMessage(params: FormatWhatsAppParams): string {
  const {
    items,
    subtotal,
    deliveryCost,
    total,
    nombre,
    telefono,
    entrega,
    calle,
    altura,
    detalle,
    pago,
  } = params;

  const lines = items.map((i) => {
    const sub = itemSubtotal(i);
    const saborLabel = i.sabor ? ` (${i.sabor})` : "";
    return `${i.quantity} x ${i.name}${saborLabel} — $${sub.toLocaleString("es-AR")}`;
  });

  const entregaLabel =
    entrega === "retiro"
      ? "Retiro en local"
      : `Delivery a: ${calle} ${altura}${detalle ? ` (${detalle})` : ""}`;

  const envioLinea =
    entrega === "delivery"
      ? `\nEnvío: ${
          deliveryCost === 0
            ? "Gratis 🎉"
            : `$${deliveryCost.toLocaleString("es-AR")}`
        }`
      : "";

  const pagoLabel =
    pago === "efectivo" ? "Efectivo 💵" : "Transferencia bancaria 🏦";

  return (
    `¡Hola Celisan! Quiero confirmar mi pedido:\n\n` +
    `*Cliente:* ${nombre} — Tel: ${telefono}\n\n` +
    `*Productos:*\n${lines.join("\n")}\n\n` +
    `Subtotal: $${subtotal.toLocaleString("es-AR")}${envioLinea}\n` +
    `*Total: $${total.toLocaleString("es-AR")}*\n\n` +
    `*Entrega:* ${entregaLabel}\n` +
    `*Pago:* ${pagoLabel}`
  );
}

export const WHATSAPP_NUMBER = "5493564626508";
