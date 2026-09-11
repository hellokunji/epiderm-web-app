import { getUserServiceHost } from "@/lib/config/env";
import {
  USER_AUTH_ENDPOINTS,
  type BackendTokenResponse,
} from "@/lib/api/user-auth";

export {
  USER_AUTH_ENDPOINTS,
  mapBackendUser,
  type BackendUser,
  type BackendTokenResponse,
} from "@/lib/api/user-auth";

export class UserServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "UserServiceError";
  }
}

function authUrl(path: string): string {
  const base = getUserServiceHost().replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(authUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    let code: string | undefined;
    try {
      const data = (await res.json()) as {
        detail?: string | { msg?: string }[];
      };
      if (typeof data.detail === "string") {
        detail = data.detail;
      } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
        detail = data.detail[0].msg;
      }
    } catch {
      // keep default
    }

    if (res.status === 401) code = "UNAUTHORIZED";
    if (res.status === 409) code = "EMAIL_TAKEN";

    throw new UserServiceError(detail, res.status, code);
  }

  return (await res.json()) as T;
}

export async function loginViaUserService(input: {
  email: string;
  password: string;
}): Promise<BackendTokenResponse> {
  return postJson<BackendTokenResponse>(USER_AUTH_ENDPOINTS.login, {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
}

export async function registerViaUserService(input: {
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  phone?: string;
}): Promise<BackendTokenResponse> {
  return postJson<BackendTokenResponse>(USER_AUTH_ENDPOINTS.register, {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    fname: input.fname || null,
    lname: input.lname || null,
    phone: input.phone || null,
  });
}

export async function refreshViaUserService(
  refreshToken: string,
): Promise<BackendTokenResponse> {
  return postJson<BackendTokenResponse>(USER_AUTH_ENDPOINTS.refresh, {
    refresh_token: refreshToken,
  });
}
