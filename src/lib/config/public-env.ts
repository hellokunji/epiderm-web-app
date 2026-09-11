/**
 * Browser-safe public config (inlined at build time).
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getPublicUserServiceHost(): string {
  const host =
    process.env.NEXT_PUBLIC_USER_SERVICE_HOST ??
    process.env.NEXT_PUBLIC_user_service_host;

  if (!host?.trim()) {
    throw new Error(
      "NEXT_PUBLIC_USER_SERVICE_HOST is not set (e.g. http://127.0.0.1:8001)",
    );
  }
  return trimTrailingSlash(host.trim());
}
