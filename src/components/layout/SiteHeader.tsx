"use client";

import { useState } from "react";
import Link from "next/link";
import { AccountDrawer } from "@/components/layout/AccountDrawer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { brand } from "@/lib/design/tokens";

export function SiteHeader() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
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
            <Link
              href="/consults"
              className="hidden h-9 items-center px-3 text-sm font-medium text-foreground transition-opacity hover:opacity-80 md:inline-flex"
            >
              All consultations
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card/80 px-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {user ? initials(user.name) : "P"}
              </span>
              <span className="pr-1">Profile</span>
            </button>
          </nav>
        </div>
      </header>
      <AccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
