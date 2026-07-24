import { NextResponse } from "next/server";
import { getProductViews } from "@/lib/product-views-data";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const views = await getProductViews();
  const ranking = Object.entries(views)
    .map(([productId, count]) => ({ productId, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ ranking });
}
