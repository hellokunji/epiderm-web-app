import {
  clearAuthCookies,
  readRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/lib/auth/constants";
import type { AuthTokens, AuthUser } from "@/lib/auth/types";
import {
  loginViaUserService,
  mapBackendUser,
  refreshViaUserService,
  registerViaUserService,
  UserServiceError,
  type BackendTokenResponse,
} from "@/lib/api/user-service";

/**
 * Auth service — proxies to epiderm-user-service.
 * Tokens are opaque; the frontend never verifies JWTs.
 */

type LoginInput = { email: string; password: string };
type SignupInput = { email: string; password: string; name: string };

function splitName(name: string): { fname?: string; lname?: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fname: parts[0] };
  return {
    fname: parts[0],
    lname: parts.slice(1).join(" "),
  };
}

function fromBackendResponse(data: BackendTokenResponse): {
  user: AuthUser;
  tokens: AuthTokens;
} {
  if (!data.access_token || !data.refresh_token || !data.user) {
    throw new Error("Invalid auth response from user-service");
  }

  return {
    user: mapBackendUser(data.user),
    tokens: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
      refreshExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
    },
  };
}

export async function loginWithPassword(
  input: LoginInput,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  try {
    const data = await loginViaUserService(input);
    return fromBackendResponse(data);
  } catch (error) {
    if (error instanceof UserServiceError && error.status === 401) {
      throw new Error("INVALID_CREDENTIALS");
    }
    throw error;
  }
}

export async function signupWithPassword(
  input: SignupInput,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  try {
    const { fname, lname } = splitName(input.name);
    const data = await registerViaUserService({
      email: input.email,
      password: input.password,
      fname,
      lname,
    });
    return fromBackendResponse(data);
  } catch (error) {
    if (error instanceof UserServiceError && error.code === "EMAIL_TAKEN") {
      throw new Error("EMAIL_TAKEN");
    }
    if (
      error instanceof UserServiceError &&
      (error.status === 409 || /already registered/i.test(error.message))
    ) {
      throw new Error("EMAIL_TAKEN");
    }
    throw error;
  }
}

/** Exchange refresh token with the backend for a new token pair. */
export async function refreshSession(): Promise<{
  user: AuthUser;
  tokens: AuthTokens;
} | null> {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) return null;

  try {
    const data = await refreshViaUserService(refreshToken);
    return fromBackendResponse(data);
  } catch {
    return null;
  }
}

export async function establishSession(result: {
  user: AuthUser;
  tokens: AuthTokens;
}): Promise<AuthUser> {
  await setAuthCookies(result.tokens, result.user);
  return result.user;
}

export async function destroySession(): Promise<void> {
  await clearAuthCookies();
}
