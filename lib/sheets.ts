import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { catalogSeed } from "@/lib/catalog-seed";
import { normalizeCategory } from "@/lib/category-utils";
import type { Product } from "@/lib/products";

const DATA_PATH = join(process.cwd(), "data", "products.json");

/** Lee el archivo JSON del admin si existe. */
function getLocalProducts(): Product[] | null {
  try {
    if (!existsSync(DATA_PATH)) return null;
    const raw = readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as Product[];
    return data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

const SHEET_COLUMNS = [
  "ID",
  "Nombre",
  "Categoría",
  "Precio",
  "Descripción",
  "Imagen_URL",
  "Stock",
] as const;

function parsePrice(value: string): number {
  const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  return Math.round(parseFloat(cleaned) || 0);
}

function parseStock(value: string): number {
  const n = parseInt(value.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function rowToProduct(cells: string[]): Product | null {
  if (cells.length < 7) return null;
  const [id, name, categoryRaw, priceRaw, description, imageRaw, stockRaw] = cells;
  if (!id?.trim() || !name?.trim()) return null;
  const category = normalizeCategory(categoryRaw ?? "");
  if (!category) return null;

  const image = imageRaw?.trim() || "/logo-celisan.png";
  const imagePath = image.startsWith("http")
    ? image
    : image.startsWith("/")
      ? image
      : `/${image}`;

  return {
    id: id.trim(),
    name: name.trim(),
    category,
    price: parsePrice(priceRaw ?? "0"),
    description: (description ?? "").trim(),
    image: imagePath,
    stock: parseStock(stockRaw ?? "1"),
  };
}

export function parseSheetCsv(csv: string): Product[] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    const next = csv[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
      continue;
    }
    if (ch === "," && !inQuotes) { row.push(current); current = ""; continue; }
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++;
      row.push(current); current = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
      continue;
    }
    current += ch;
  }
  if (current.length || row.length) {
    row.push(current);
    if (row.some((c) => c.trim())) rows.push(row);
  }
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim());
  const hasHeader = SHEET_COLUMNS.every((col, i) =>
    header[i]?.toLowerCase().includes(col.toLowerCase().slice(0, 4))
  );
  const dataRows = hasHeader ? rows.slice(1) : rows;
  return dataRows.map((r) => rowToProduct(r)).filter((p): p is Product => p !== null);
}

function parseApiValues(values: string[][]): Product[] {
  if (!values.length) return [];
  const header = values[0].map((h) => String(h).trim());
  const colIndex = (name: string) =>
    header.findIndex((h) => h.toLowerCase().startsWith(name.toLowerCase().slice(0, 4)));
  const idx = {
    id: colIndex("ID"), name: colIndex("Nombre"), category: colIndex("Categoría"),
    price: colIndex("Precio"), description: colIndex("Descripción"),
    image: colIndex("Imagen"), stock: colIndex("Stock"),
  };
  if (idx.id < 0 || idx.name < 0) {
    return values.slice(1).map((r) => rowToProduct(r.map(String))).filter(Boolean) as Product[];
  }
  return values.slice(1).map((row) => {
    const cells = [
      String(row[idx.id] ?? ""), String(row[idx.name] ?? ""), String(row[idx.category] ?? ""),
      String(row[idx.price] ?? ""), String(row[idx.description] ?? ""),
      String(row[idx.image] ?? ""), String(row[idx.stock] ?? "1"),
    ];
    return rowToProduct(cells);
  }).filter((p): p is Product => p !== null);
}

async function fetchFromSheetsApi(sheetId: string, apiKey: string, range: string): Promise<Product[]> {
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`);
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Sheets API ${res.status}`);
  const data = (await res.json()) as { values?: string[][] };
  const products = parseApiValues(data.values ?? []);
  if (!products.length) throw new Error("Sin filas válidas en la planilla");
  return products;
}

async function fetchFromCsvExport(sheetId: string): Promise<Product[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`CSV export ${res.status}`);
  const csv = await res.text();
  const products = parseSheetCsv(csv);
  if (!products.length) throw new Error("CSV sin productos válidos");
  return products;
}

/**
 * Prioridad: 1) data/products.json (admin) → 2) Google Sheets → 3) catalogSeed
 */
export async function fetchProducts(): Promise<Product[]> {
  // 1. JSON local del admin (fuente principal)
  const local = getLocalProducts();
  if (local) return local;

  // 2. Google Sheets (si está configurado)
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY?.trim();
  const range = process.env.GOOGLE_SHEET_RANGE?.trim() || "Hoja 1!A1:G500";

  if (sheetId) {
    try {
      if (apiKey) return await fetchFromSheetsApi(sheetId, apiKey, range);
      return await fetchFromCsvExport(sheetId);
    } catch {
      // cae al seed
    }
  }

  // 3. Fallback al seed estático
  return catalogSeed;
}
