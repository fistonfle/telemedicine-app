import { API_URL } from "./config";
import { getStoredToken, clearStoredAuth, setStoredToken } from "../store/authStorage";
import { refreshTokenRequest } from "./authService";

export interface FetchOptions extends RequestInit {
  token?: string | null;
}

/** prevents multiple refresh calls in parallel */
let refreshPromise: Promise<string> | null = null;

function redirectToLogin() {
  // adjust route
  window.location.href = "/";
}

async function readError(res: Response): Promise<{ code?: string; message?: string }> {
  // Use clone() so we don't consume the original response body (we may need it later)
  const r = res.clone();

  // Try JSON first
  const json = (await r.json().catch(() => null)) as null | { error?: string; message?: string };
  if (json) {
    return { code: json.error, message: json.message };
  }

  // Fallback to text (some backends send plain text for 401/403)
  const text = await r.text().catch(() => "");
  return { message: text || undefined };
}

export async function fetchApi<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const isAuthCall =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/refresh");

  // build a request function so we can retry easily
  const doFetch = async (accessToken: string | null): Promise<Response> => {
    const headers: HeadersInit = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    };

    return fetch(url, { ...options, headers });
  };

  const initialToken = isAuthCall ? null : (options.token ?? getStoredToken());
  let res = await doFetch(initialToken);

  // If forbidden/unauthorized => attempt refresh (skip for auth endpoints)
  if (!isAuthCall && (res.status === 401 || res.status === 403)) {
    const { code, message } = await readError(res);

    // Many backends don't return a stable code; also treat "expired" messages as token expiry
    const looksExpired =
      code === "TOKEN_EXPIRED" ||
      (message?.toLowerCase().includes("expired") ?? false) ||
      (message?.toLowerCase().includes("jwt") ?? false);

    // If we had a token (meaning it was an authenticated call), try refresh once.
    // Even if the backend doesn't send TOKEN_EXPIRED, a 401 often means the access token is no longer valid.
    if (initialToken && (looksExpired || res.status === 401)) {
      try {
        // single-flight refresh: if one is already running, wait for it
        if (!refreshPromise) {
          refreshPromise = refreshTokenRequest().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        setStoredToken(newAccessToken);

        // retry once with new token
        res = await doFetch(newAccessToken);
      } catch (e) {
        clearStoredAuth();
        redirectToLogin();
        throw e instanceof Error ? e : new Error("REFRESH_FAILED");
      }
    } else {
      // not refreshable: treat as real unauthorized/forbidden
      throw new Error(code || message || "UNAUTHORIZED");
    }
  }

  if (!res.ok) {
    const { code, message } = await readError(res);
    throw new Error(code || message || res.statusText);
  }

  // if endpoint returns no content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}