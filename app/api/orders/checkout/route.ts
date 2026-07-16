import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products-data";

interface CheckoutItem {
  productId: string;
  quantity: number;
  sabor?: string;
}

/**
 * Ruta pública (sin login): el carrito la llama al confirmar un pedido por
 * WhatsApp, para descontar el stock vendido. No bloquea el envío del pedido
 * si falla — el stock se puede corregir a mano desde el admin.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { items?: CheckoutItem[] } | null;
  const items = body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No hay items para descontar" }, { status: 400 });
  }

  const products = getProducts();

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !item.quantity || item.quantity <= 0) continue;

    const variante = product.variantes?.find((v) => v.nombre === item.sabor);
    const isCongeladoConSelector =
      product.category === "Waffles Congelados" && !product.sinSelectorSabor;

    if (variante) {
      variante.stock = Math.max(0, variante.stock - item.quantity);
    } else if (isCongeladoConSelector && (item.sabor === "Dulces" || item.sabor === "Salados")) {
      if (item.sabor === "Dulces") {
        product.stockDulces = Math.max(0, (product.stockDulces ?? 0) - item.quantity);
      } else {
        product.stockSalados = Math.max(0, (product.stockSalados ?? 0) - item.quantity);
      }
    } else {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  }

  saveProducts(products);
  return NextResponse.json({ ok: true });
}
