import Link from "next/link";
import type { ReactNode } from "react";

export function SimplePage({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="hero-surface flex flex-1 px-6 pb-20 pt-28">
      <div className="mx-auto w-full max-w-2xl">
        {kicker ? (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display mt-3 text-4xl tracking-tight text-foreground">
          {title}
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground">{children}</div>
        <Link
          href="/"
          className="mt-10 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
