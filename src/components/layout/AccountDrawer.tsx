"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const DRAWER_LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/address", label: "Address" },
  { href: "/consults", label: "All consultations", desktopInHeader: true },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy policy" },
] as const;

export function AccountDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  async function handleLogout() {
    await logout();
    onClose();
    router.refresh();
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-foreground/30 transition-opacity duration-[var(--motion-slow)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label="Close profile menu"
        hidden={!open}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-border bg-card shadow-xl transition-transform duration-[var(--motion-slow)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Profile
            </p>
            {user ? (
              <>
                <p className="mt-2 font-display text-2xl text-foreground">
                  {user.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to manage your consults and account.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {user ? null : (
            <>
              <DrawerLink href="/login" onClick={onClose}>
                Log in
              </DrawerLink>
              <DrawerLink href="/signup" onClick={onClose}>
                Sign up
              </DrawerLink>
            </>
          )}
          {DRAWER_LINKS.map((item) => (
            <DrawerLink
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={"desktopInHeader" in item && item.desktopInHeader ? "md:hidden" : undefined}
            >
              {item.label}
            </DrawerLink>
          ))}
        </nav>

        {user ? (
          <div className="border-t border-border px-3 py-4">
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex w-full items-center rounded-[var(--radius-md)] px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Log out
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function DrawerLink({
  href,
  onClick,
  children,
  className,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
