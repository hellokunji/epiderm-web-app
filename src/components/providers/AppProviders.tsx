"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { AuthUser } from "@/lib/auth/types";

export function AppProviders({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  return (
    <ThemeProvider>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
    </ThemeProvider>
  );
}
