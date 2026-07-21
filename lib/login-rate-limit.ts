const MAX_ATTEMPTS = 5;
const WINDOW_MS = 1000 * 60 * 10; // 10 minutos

type Entry = { count: number; resetAt: number };

const attemptsByIp = new Map<string, Entry>();

function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** true si la IP ya superó el límite de intentos fallidos. */
export function isLoginBlocked(req: Request): boolean {
  const entry = attemptsByIp.get(getIp(req));
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attemptsByIp.delete(getIp(req));
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function registerFailedLogin(req: Request): void {
  const ip = getIp(req);
  const entry = attemptsByIp.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    attemptsByIp.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearLoginAttempts(req: Request): void {
  attemptsByIp.delete(getIp(req));
}
