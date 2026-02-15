export const AUTH_TOKEN_KEY = "telemedicine_access_token";
export const AUTH_REFRESH_TOKEN_KEY = "telemedicine_refresh_token";

export function getStoredToken(): string | null {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null;
}

export function getStoredRefreshToken(): string | null {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)
    : null;
}

export function setStoredToken(token: string | null): void {
  if (typeof localStorage === "undefined") return;
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function setStoredRefreshToken(token: string | null): void {
  if (typeof localStorage === "undefined") return;
  if (token) localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
}

export function clearStoredAuth(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
}