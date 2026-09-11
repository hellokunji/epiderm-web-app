import Link from "next/link";
import { brand } from "@/lib/design/tokens";

export function HomeHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="hero-surface relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-30">
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-gold-300/40 blur-3xl" />
        <div className="absolute bottom-16 left-10 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
        <p className="font-display animate-fade-up text-5xl tracking-tight text-foreground sm:text-7xl md:text-8xl">
          {brand.name}
        </p>
        <span
          className="animate-underline mt-3 block h-0.5 w-24 origin-left bg-primary sm:w-32"
          aria-hidden
        />

        <h1 className="animate-fade-up mt-8 max-w-xl text-balance text-2xl font-medium leading-snug text-foreground/90 sm:text-3xl [animation-delay:80ms]">
          Expert dermatology care, guided by AI and confirmed by doctors.
        </h1>

        <p className="animate-fade-up mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:140ms]">
          Photograph your skin or hair concerns, receive a clear assessment, and
          unlock doctor-reviewed care with medicine kits delivered to your door.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
          {isAuthenticated ? (
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              See how it works
            </a>
          ) : (
            <>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-border bg-card/60 px-6 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
