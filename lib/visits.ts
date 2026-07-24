export interface VisitsData {
  total: number;
  byDay: Record<string, number>;
}

export const OWNER_COOKIE = "celisan_owner";
export const SESSION_COOKIE = "celisan_visited";
export const OWNER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5; // 5 años
export const SESSION_COOKIE_MAX_AGE = 60 * 30; // 30 minutos

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function hasCookie(req: Request, name: string): boolean {
  const cookieHeader = req.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${name}=`).test(cookieHeader);
}

export function getCookieValue(req: Request, name: string): string | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const VIEWED_PRODUCTS_COOKIE = "celisan_viewed";
