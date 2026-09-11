"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { brand } from "@/lib/design/tokens";

export function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  return (
    <header className="absolute inset-x-0 top-0 z-20 animate-fade-in">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          {brand.name}
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {loading ? (
            <span className="h-9 w-20 rounded-[var(--radius-md)] bg-muted animate-pulse" />
          ) : user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center px-3 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
