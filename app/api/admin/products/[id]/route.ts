import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, saveProducts } from "@/lib/products-data";
import type { Product } from "@/lib/products";
import { isAuthenticated } from "@/lib/admin-auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json() as Partial<Product>;
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  products[index] = { ...products[index], ...body, id: params.id };
  await saveProducts(products);
  revalidatePath("/");
  return NextResponse.json(products[index]);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== params.id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  await saveProducts(filtered);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
