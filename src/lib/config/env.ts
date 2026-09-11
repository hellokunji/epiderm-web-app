/**
 * Server-side service hosts.
 * Never expose these via NEXT_PUBLIC_* — they are used from Route Handlers only.
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`${name} is not set`);
  }
  return value.trim();
}

export function getUserServiceHost(): string {
  return trimTrailingSlash(
    required(
      "USER_SERVICE_HOST",
      process.env.USER_SERVICE_HOST ?? process.env.user_service_host,
    ),
  );
}

export function getClinicServiceHost(): string {
  return trimTrailingSlash(
    required(
      "CLINIC_SERVICE_HOST",
      process.env.CLINIC_SERVICE_HOST ?? process.env.clinic_service_host,
    ),
  );
}
