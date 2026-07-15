export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sabor?: string;
  /** Stock disponible al momento de agregarlo (limita cuánto se puede sumar/incrementar). */
  maxStock?: number;
  /** Categoría del producto (para cupones que aplican solo a ciertas categorías). */
  category?: string;
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

/** Dirección del local para retiro en persona */
export const RETIRO_DIRECCION = "Dean Funes 3019, Bº Cottolengo, San Francisco";

/** Días y horarios disponibles para retiro en el local */
export const RETIRO_HORARIOS: { dia: string; horario: string }[] = [
  { dia: "Lunes", horario: "17:30 a 20:00 hs" },
  { dia: "Martes", horario: "17:30 a 20:00 hs" },
  { dia: "Miércoles", horario: "17:30 a 20:00 hs" },
  { dia: "Jueves", horario: "17:30 a 20:00 hs" },
  { dia: "Viernes", horario: "17:30 a 20:00 hs" },
  { dia: "Sábado", horario: "10:00 a 12:00 hs" },
];

/** Días y horarios disponibles para delivery */
export const DELIVERY_HORARIOS: { dia: string; horario: string }[] = [
  { dia: "Lunes", horario: "11:30 a 13:00 hs" },
  { dia: "Miércoles", horario: "11:30 a 13:00 hs" },
  { dia: "Viernes", horario: "11:30 a 13:00 hs" },
];

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

/** Subtotal de los items del carrito que pertenecen a alguna de las categorías dadas. */
export function categorySubtotal(items: CartItem[], categories: string[]): number {
  return items
    .filter((i) => i.category && categories.includes(i.category))
    .reduce((sum, i) => sum + itemSubtotal(i), 0);
}

/**
 * Calcula el monto de descuento de un cupón (redondeado al peso).
 * Si el cupón tiene categorías, el % se aplica solo sobre el subtotal de esas
 * categorías; si no tiene categorías (o está vacío), se aplica sobre todo el
 * subtotal del carrito.
 */
export function calcCouponDiscount(
  items: CartItem[],
  subtotal: number,
  percent: number,
  categories?: string[]
): number {
  const base = categories && categories.length > 0 ? categorySubtotal(items, categories) : subtotal;
  return Math.round((base * percent) / 100);
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
  dia: string;
  horario: string;
  cuponCodigo?: string;
  cuponDescuento?: number;
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
    dia,
    horario,
    cuponCodigo,
    cuponDescuento,
  } = params;

  const lines = items.map((i) => {
    const sub = itemSubtotal(i);
    const saborLabel = i.sabor ? ` (${i.sabor})` : "";
    return `${i.quantity} x ${i.name}${saborLabel} — $${sub.toLocaleString("es-AR")}`;
  });

  const diaLabel = dia ? ` — ${dia}, ${horario}` : "";

  const entregaLabel =
    entrega === "retiro"
      ? `Retiro en local (${RETIRO_DIRECCION})${diaLabel}`
      : `Delivery a: ${calle} ${altura}${detalle ? ` (${detalle})` : ""}${diaLabel}`;

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

  const descuentoLinea =
    cuponCodigo && cuponDescuento
      ? `\nCupón ${cuponCodigo}: -$${cuponDescuento.toLocaleString("es-AR")}`
      : "";

  return (
    `¡Hola Celisan! Quiero confirmar mi pedido:\n\n` +
    `*Cliente:* ${nombre} — Tel: ${telefono}\n\n` +
    `*Productos:*\n${lines.join("\n")}\n\n` +
    `Subtotal: $${subtotal.toLocaleString("es-AR")}${descuentoLinea}${envioLinea}\n` +
    `*Total: $${total.toLocaleString("es-AR")}*\n\n` +
    `*Entrega:* ${entregaLabel}\n` +
    `*Pago:* ${pagoLabel}`
  );
}

export const WHATSAPP_NUMBER = "5493564626508";
