import type { AuthUser } from "@/lib/auth/types";

/** epiderm-user-service auth endpoints */
export const USER_AUTH_ENDPOINTS = {
  login: "/api/v1/auth/login",
  register: "/api/v1/auth/register",
  refresh: "/api/v1/auth/refresh",
} as const;

export type BackendUser = {
  id: string;
  fname?: string | null;
  lname?: string | null;
  email: string;
  phone?: string | null;
  role?: string;
  gender?: string | null;
  photo?: string | null;
  status?: string;
};

export type BackendTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  user: BackendUser;
};

export function mapBackendUser(user: BackendUser): AuthUser {
  const name = [user.fname, user.lname].filter(Boolean).join(" ").trim();
  return {
    id: user.id,
    email: user.email,
    name: name || user.email.split("@")[0] || "User",
  };
}
