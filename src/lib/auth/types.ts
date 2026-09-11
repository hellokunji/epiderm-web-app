export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
};

export type AuthSession = {
  user: AuthUser;
};
