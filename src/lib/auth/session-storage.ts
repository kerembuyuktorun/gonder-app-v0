const SESSION_KEY = "gonder.auth.session";
const DB_KEY = "gonder.auth.db";

export type PersistedAuthDb = {
  users: unknown[];
  organizations: unknown[];
  memberships: unknown[];
  addresses: unknown[];
  passwords: Record<string, string>;
  otpChallenges: Record<
    string,
    { phone: string; expiresAt: string; consumed?: boolean }
  >;
  resetChallenges: Record<
    string,
    { email: string; expiresAt: string; consumed?: boolean }
  >;
  sessions?: Record<string, unknown>;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readSessionToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(SESSION_KEY);
}

export function writeSessionToken(token: string): void {
  if (!canUseStorage()) return;
  localStorage.setItem(SESSION_KEY, token);
}

export function clearSessionToken(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSION_KEY);
}

export function readAuthDb<T extends PersistedAuthDb>(fallback: T): T {
  if (!canUseStorage()) return structuredClone(fallback);
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    writeAuthDb(fallback);
    return structuredClone(fallback);
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    writeAuthDb(fallback);
    return structuredClone(fallback);
  }
}

export function writeAuthDb(db: PersistedAuthDb): void {
  if (!canUseStorage()) return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetAuthPersistence(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(DB_KEY);
}
