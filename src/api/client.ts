import { API_URL } from "./config";
import { getStoredToken, clearStoredAuth, setStoredToken, getStoredActiveProfileId } from "../store/authStorage";
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

/** Backend ApiError has message (user-facing) and error (e.g. "Bad Request"). Prefer message. */
async function getErrorBody(res: Response): Promise<{ message?: string; error?: string }> {
  return (await res.json().catch(() => ({}))) as { message?: string; error?: string };
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
    const activeProfileId = getStoredActiveProfileId();
    const headers: HeadersInit = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(activeProfileId ? { "X-Active-Profile-Id": activeProfileId } : {}),
      ...options.headers,
    };

    return fetch(url, { ...options, headers });
  };

  const initialToken = isAuthCall ? null : (options.token ?? getStoredToken());
  let res = await doFetch(initialToken);

  // If forbidden/unauthorized => attempt refresh (skip for auth endpoints)
  if (!isAuthCall && (res.status === 401 || res.status === 403)) {
    const err = await getErrorBody(res);
    // Backend puts TOKEN_EXPIRED in "error"; use "message" for user-facing text
    if (err.error === "TOKEN_EXPIRED") {
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
      throw new Error(err.message || err.error || "UNAUTHORIZED");
    }
  }

  if (!res.ok) {
    const err = await getErrorBody(res);
    throw new Error(err.message || err.error || res.statusText);
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