/**
 * Browser fetch with Authorization Bearer + 401 → refresh → retry.
 */

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth/access-token";

const AUTH_PATH_PREFIX = "/api/auth/";

type AuthFailureListener = () => void;

const authFailureListeners = new Set<AuthFailureListener>();

export function onAuthFailure(listener: AuthFailureListener): () => void {
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
}

function notifyAuthFailure(): void {
  clearAccessToken();
  for (const listener of authFailureListeners) {
    listener();
  }
}

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function isAuthEndpoint(url: string): boolean {
  try {
    const path = url.startsWith("http") ? new URL(url).pathname : url;
    return path.startsWith(AUTH_PATH_PREFIX);
  } catch {
    return false;
  }
}

function canReplayBody(body: BodyInit | null | undefined): boolean {
  if (body == null) return true;
  if (typeof body === "string") return true;
  if (typeof Blob !== "undefined" && body instanceof Blob) return true;
  if (typeof FormData !== "undefined" && body instanceof FormData) return true;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
    return true;
  }
  if (body instanceof ArrayBuffer) return true;
  if (ArrayBuffer.isView(body)) return true;
  return false;
}

function withAuthHeaders(
  init: RequestInit,
  options: { skipAuth?: boolean },
): Headers {
  const headers = new Headers(init.headers);
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "same-origin",
  })
    .then(async (res) => {
      if (!res.ok) {
        clearAccessToken();
        return false;
      }
      const data = (await res.json()) as { access_token?: string };
      if (data.access_token) {
        setAccessToken(data.access_token);
      }
      return true;
    })
    .catch(() => {
      clearAccessToken();
      return false;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export type ApiFetchInit = RequestInit & {
  /** Skip 401 refresh/retry (default false). */
  skipAuthRefresh?: boolean;
  /** Skip attaching Authorization Bearer (default false). */
  skipAuth?: boolean;
};

/**
 * Drop-in fetch for app / backend API calls.
 * Sends `Authorization: Bearer <access_token>` when available.
 * On 401, refreshes session once and retries with the new token.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: ApiFetchInit = {},
): Promise<Response> {
  const {
    skipAuthRefresh = false,
    skipAuth = false,
    ...fetchInit
  } = init;

  const requestInit: RequestInit = {
    ...fetchInit,
    credentials: fetchInit.credentials ?? "same-origin",
    headers: withAuthHeaders(fetchInit, { skipAuth }),
  };

  const response = await fetch(input, requestInit);

  if (
    response.status !== 401 ||
    skipAuthRefresh ||
    isAuthEndpoint(resolveUrl(input)) ||
    !canReplayBody(requestInit.body)
  ) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    notifyAuthFailure();
    return response;
  }

  return fetch(input, {
    ...requestInit,
    headers: withAuthHeaders(fetchInit, { skipAuth }),
  });
}
