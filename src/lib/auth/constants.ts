export const AUTH_COOKIES = {
  access: "epiderm_access_token",
  refresh: "epiderm_refresh_token",
  user: "epiderm_user",
} as const;

/** Access cookie max-age (default 1 hour). Backend owns real expiry. */
export const ACCESS_TOKEN_TTL_SECONDS = Number(
  process.env.AUTH_ACCESS_TOKEN_TTL ?? 3600,
);

/** Refresh cookie max-age (default 30 days). */
export const REFRESH_TOKEN_TTL_SECONDS = Number(
  process.env.AUTH_REFRESH_TOKEN_TTL ?? 60 * 60 * 24 * 30,
);
