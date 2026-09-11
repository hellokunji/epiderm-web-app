import { getPublicUserServiceHost } from "@/lib/config/public-env";
import { setAccessToken } from "@/lib/auth/access-token";
import type { AuthUser } from "@/lib/auth/types";
import {
  USER_AUTH_ENDPOINTS,
  mapBackendUser,
  type BackendTokenResponse,
} from "@/lib/api/user-auth";

function authUrl(path: string): string {
  const base = getPublicUserServiceHost();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

async function postToUserService(
  path: string,
  body: unknown,
): Promise<BackendTokenResponse> {
  const res = await fetch(authUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
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
    throw new Error(detail);
  }

  return (await res.json()) as BackendTokenResponse;
}

/** Persist tokens into httpOnly cookies; keep access token in memory for Bearer. */
async function persistSession(data: BackendTokenResponse): Promise<AuthUser> {
  setAccessToken(data.access_token);

  const user = mapBackendUser(data.user);
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user,
    }),
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? "Failed to establish session");
  }

  const payload = (await res.json()) as { user: AuthUser };
  return payload.user;
}

export async function loginFromBrowser(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const data = await postToUserService(USER_AUTH_ENDPOINTS.login, {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
  return persistSession(data);
}

export async function registerFromBrowser(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthUser> {
  const parts = input.name.trim().split(/\s+/).filter(Boolean);
  const fname = parts[0];
  const lname = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

  const data = await postToUserService(USER_AUTH_ENDPOINTS.register, {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    fname: fname || null,
    lname: lname || null,
  });
  return persistSession(data);
}
