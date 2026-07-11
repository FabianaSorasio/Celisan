import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products-data";
import type { Product } from "@/lib/products";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json() as Partial<Product>;
  const products = getProducts();
  const index = products.findIndex((p) => p.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  products[index] = { ...products[index], ...body, id: params.id };
  saveProducts(products);
  return NextResponse.json(products[index]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const products = getProducts();
  const filtered = products.filter((p) => p.id !== params.id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  saveProducts(filtered);
  return NextResponse.json({ ok: true });
}
