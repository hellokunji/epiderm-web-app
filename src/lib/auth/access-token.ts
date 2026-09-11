/**
 * In-memory access token for browser API calls.
 * Used to set `Authorization: Bearer <token>` (httpOnly cookie alone is not
 * readable by JS, so protected calls to user/clinic services need this).
 */

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token && token.length > 0 ? token : null;
}

export function clearAccessToken(): void {
  accessToken = null;
}
