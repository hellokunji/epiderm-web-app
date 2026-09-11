import {
  readAccessToken,
  readRefreshToken,
} from "@/lib/auth/cookies";
import {
  destroySession,
  establishSession,
  refreshSession,
} from "@/lib/auth/service";
import { getClinicServiceHost, getUserServiceHost } from "@/lib/config/env";

/**
 * Server-side fetch to backend services.
 * Attaches the opaque access token; on 401, refreshes via user-service and retries once.
 *
 * Important: do NOT share in-flight refresh promises across requests — that would
 * leak one user's rotated token to another on a shared Node isolate.
 */

type Service = "user" | "clinic";

function serviceBase(service: Service): string {
  return service === "user" ? getUserServiceHost() : getClinicServiceHost();
}

async function rotateAccessToken(): Promise<string | null> {
  const result = await refreshSession();
  if (!result) {
    await destroySession();
    return null;
  }

  try {
    await establishSession(result);
  } catch {
    // Cookie writes are only allowed in Route Handlers / Server Actions.
    // Still return the new access token for this request's retry.
  }

  return result.tokens.accessToken;
}

export type BackendFetchInit = RequestInit & {
  /** Skip bearer auth + refresh (default false). */
  skipAuth?: boolean;
};

export async function backendFetch(
  service: Service,
  path: string,
  init: BackendFetchInit = {},
): Promise<Response> {
  const { skipAuth = false, headers, ...rest } = init;
  const url = `${serviceBase(service)}${path.startsWith("/") ? path : `/${path}`}`;
  console.log("4", url);
  const buildHeaders = async (token?: string): Promise<Headers> => {
    const next = new Headers(headers);
    if (!next.has("Accept")) next.set("Accept", "application/json");
    if (!skipAuth) {
      const access = token ?? (await readAccessToken());
      if (access) next.set("Authorization", `Bearer ${access}`);
    }
    return next;
  };

  const first = await fetch(url, {
    ...rest,
    headers: await buildHeaders(),
    cache: rest.cache ?? "no-store",
  });

  if (first.status !== 401 || skipAuth) {
    return first;
  }

  if (!(await readRefreshToken())) {
    return first;
  }

  const newAccess = await rotateAccessToken();
  if (!newAccess) {
    return first;
  }

  return fetch(url, {
    ...rest,
    headers: await buildHeaders(newAccess),
    cache: rest.cache ?? "no-store",
  });
}
