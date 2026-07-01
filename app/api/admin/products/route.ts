import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products-data";
import type { Product } from "@/lib/products";

function isAuthenticated(req: Request): boolean {
  const cookie = req.headers.get("cookie") ?? "";
  return cookie.includes("admin_auth=1");
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(getProducts());
}

export async function PUT(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Se esperaba un array de productos" }, { status: 400 });
  }
  saveProducts(body as Product[]);
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json() as Partial<Product>;
  if (!body.id || !body.name || !body.category) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const products = getProducts();
  if (products.find((p) => p.id === body.id)) {
    return NextResponse.json({ error: "Ya existe un producto con ese ID" }, { status: 409 });
  }

  const newProduct: Product = {
    id: body.id,
    name: body.name,
    description: body.description ?? "",
    price: body.price ?? 0,
    image: body.image ?? "/logo-celisan.png",
    images: body.images,
    video: body.video,
    category: body.category,
    stock: body.stock ?? 0,
    available: body.available ?? true,
    imageX: body.imageX ?? 50,
    imageY: body.imageY ?? 50,
    imageZoom: body.imageZoom ?? 1,
  };

  products.push(newProduct);
  saveProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
