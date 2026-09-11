import {
  readAccessToken,
  readAuthUser,
  readRefreshToken,
} from "@/lib/auth/cookies";
import type { AuthSession, AuthUser } from "@/lib/auth/types";

/**
 * Read-only session for RSC / layouts.
 * Does not verify JWTs — cookie presence + cached user profile only.
 * Token validity is enforced by backend APIs (401 → interceptor refresh).
 */
export async function getSession(): Promise<AuthSession | null> {
  const [access, refresh, user] = await Promise.all([
    readAccessToken(),
    readRefreshToken(),
    readAuthUser(),
  ]);

  if (!user) return null;
  if (!access && !refresh) return null;

  return { user };
}

export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}
