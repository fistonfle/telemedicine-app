import { API_URL } from "./config";

export const AUTH_TOKEN_KEY = "telemedicine_access_token";

export function getStoredToken(): string | null {
  return typeof localStorage !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
}

export function setStoredToken(token: string | null): void {
  if (typeof localStorage !== "undefined" && token != null) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearStoredToken(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function fetchApi<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = options.token ?? getStoredToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    if (token) {
      clearStoredToken();
      window.location.href = "/login";
    }
    return undefined as T;
  }
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    throw new Error(err.message || err.error || res.statusText);
  }
  return res.json() as Promise<T>;
}
