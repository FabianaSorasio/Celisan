import { readJsonFromR2, saveJsonToR2 } from "@/lib/r2";
import { todayKey, type VisitsData } from "@/lib/visits";

const R2_KEY = "data/visits.json";

export async function getVisitsData(): Promise<VisitsData> {
  try {
    const data = await readJsonFromR2<VisitsData>(R2_KEY);
    if (data) return data;
  } catch {
    // R2 no disponible — devolver datos vacíos
  }
  return { total: 0, byDay: {} };
}

/** Suma una visita nueva. No es atómico (lecturas concurrentes pueden pisarse),
 * aceptable para el volumen de tráfico de este sitio. */
export async function incrementVisit(): Promise<void> {
  const data = await getVisitsData();
  const key = todayKey();
  data.total += 1;
  data.byDay[key] = (data.byDay[key] ?? 0) + 1;
  await saveJsonToR2(R2_KEY, data);
}
