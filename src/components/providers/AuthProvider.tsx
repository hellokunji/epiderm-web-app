"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, onAuthFailure } from "@/lib/api/client";
import {
  clearAccessToken,
  setAccessToken,
} from "@/lib/auth/access-token";
import type { AuthUser } from "@/lib/auth/types";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    return onAuthFailure(() => {
      clearAccessToken();
      setUser(null);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await apiFetch("/api/auth/me", {
          skipAuthRefresh: true,
          skipAuth: true,
        });
        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 401) {
            clearAccessToken();
            setUser(null);
          }
          return;
        }
        const data = (await res.json()) as {
          user: AuthUser;
          access_token?: string;
        };
        if (data.access_token) setAccessToken(data.access_token);
        setUser(data.user);
      } catch {
        // Keep SSR user on transient network errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSession();
    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  const refresh = useCallback(async () => {
    const res = await apiFetch("/api/auth/refresh", {
      method: "POST",
      skipAuthRefresh: true,
      skipAuth: true,
    });
    if (!res.ok) {
      clearAccessToken();
      setUser(null);
      return;
    }
    const data = (await res.json()) as {
      user: AuthUser;
      access_token?: string;
    };
    if (data.access_token) setAccessToken(data.access_token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      skipAuthRefresh: true,
      skipAuth: true,
    });
    clearAccessToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
