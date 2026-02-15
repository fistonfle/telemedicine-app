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

async function getErrorCode(res: Response): Promise<string | undefined> {
  const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
  return err.error ?? err.message;
}

export async function fetchApi<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const isAuthCall =
    path.startsWith("/api/auth/login") ||
    path.startsWith("/api/auth/refresh");

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

  // If forbidden/unauthorized => check if token expired (skip for auth endpoints)
  if (!isAuthCall && (res.status === 401 || res.status === 403)) {
    const code = await getErrorCode(res);

    if (code === "TOKEN_EXPIRED") {
      try {
        // single-flight refresh: if one is already running, wait for it
        if (!refreshPromise) {
          refreshPromise = refreshTokenRequest().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        // (optional) ensure storage updated even if backend returns same token
        setStoredToken(newAccessToken);

        // retry once with new token
        res = await doFetch(newAccessToken);
      } catch (e) {
        clearStoredAuth();
        redirectToLogin();
        throw e instanceof Error ? e : new Error("REFRESH_FAILED");
      }
    } else {
      // not token-expired: treat as real unauthorized/forbidden
      // (optional) clear if you want
      // clearStoredAuth();
      throw new Error(code || "UNAUTHORIZED");
    }
  }

  if (!res.ok) {
    const code = await getErrorCode(res);
    throw new Error(code || res.statusText);
  }

  // if endpoint returns no content
  if (res.status === 204) return undefined as T;

  const json = (await res.json()) as T | { status: string; data: unknown; pagination?: unknown };
  // Backend may return wrapped success: { status: "success", data, pagination? }
  if (
    json &&
    typeof json === "object" &&
    "status" in json &&
    (json as { status: string }).status === "success" &&
    "data" in json
  ) {
    return (json as { data: T }).data as T;
  }
  return json as T;
}