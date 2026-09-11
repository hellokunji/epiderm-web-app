import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_COOKIES,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/lib/auth/constants";
import type { AuthTokens, AuthUser } from "@/lib/auth/types";

const isProd = process.env.NODE_ENV === "production";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function baseCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setAuthCookies(
  tokens: AuthTokens,
  user: AuthUser,
): Promise<void> {
  const jar = await cookies();
  jar.set(
    AUTH_COOKIES.access,
    tokens.accessToken,
    baseCookieOptions(tokens.accessExpiresIn || ACCESS_TOKEN_TTL_SECONDS),
  );
  jar.set(
    AUTH_COOKIES.refresh,
    tokens.refreshToken,
    baseCookieOptions(tokens.refreshExpiresIn || REFRESH_TOKEN_TTL_SECONDS),
  );
  jar.set(
    AUTH_COOKIES.user,
    encodeURIComponent(JSON.stringify(user)),
    baseCookieOptions(tokens.refreshExpiresIn || REFRESH_TOKEN_TTL_SECONDS),
  );
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIES.access);
  jar.delete(AUTH_COOKIES.refresh);
  jar.delete(AUTH_COOKIES.user);
}

export async function readAccessToken(
  jar?: CookieStore,
): Promise<string | undefined> {
  const store = jar ?? (await cookies());
  return store.get(AUTH_COOKIES.access)?.value;
}

export async function readRefreshToken(
  jar?: CookieStore,
): Promise<string | undefined> {
  const store = jar ?? (await cookies());
  return store.get(AUTH_COOKIES.refresh)?.value;
}

export async function readAuthUser(
  jar?: CookieStore,
): Promise<AuthUser | null> {
  const store = jar ?? (await cookies());
  const raw = store.get(AUTH_COOKIES.user)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as AuthUser;
    if (
      typeof parsed?.id === "string" &&
      typeof parsed?.email === "string" &&
      typeof parsed?.name === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
