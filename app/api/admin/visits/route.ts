import { NextResponse } from "next/server";
import { getVisitsData } from "@/lib/visits-data";
import { todayKey } from "@/lib/visits";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const data = await getVisitsData();
  const today = data.byDay[todayKey()] ?? 0;

  const last7Days = Object.entries(data.byDay)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 7)
    .reduce((sum, [, count]) => sum + count, 0);

  return NextResponse.json({ total: data.total, today, last7Days });
}
