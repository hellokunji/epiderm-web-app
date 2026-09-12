import Link from "next/link";
import { ConsultCard } from "@/components/consult/ConsultList";
import { brand } from "@/lib/design/tokens";
import type { ConsultSummary } from "@/lib/consult/types";

export function HomeHero({
  isAuthenticated,
  latestConsult,
}: {
  isAuthenticated: boolean;
  latestConsult: ConsultSummary | null;
}) {
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

        {latestConsult ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
            <section className="animate-fade-up [animation-delay:200ms]">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Last consultation
              </p>
              <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground">
                Continue where you left off
              </h2>
              <p className="mt-2 mb-5 text-sm text-muted-foreground">
                Your most recent consult is ready to review.
              </p>
              <ConsultCard consult={latestConsult} />
            </section>

            <section className="animate-fade-up [animation-delay:260ms]">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                New visit
              </p>
              <h2 className="font-display mt-2 text-3xl tracking-tight text-foreground">
                Book a new consultation
              </h2>
              <p className="mt-2 mb-5 text-sm text-muted-foreground">
                Start a fresh skin or hair assessment.
              </p>
              <NewConsultCards />
            </section>
          </div>
        ) : (
          <div className="animate-fade-up mt-10 max-w-xl [animation-delay:200ms]">
            <h2 className="font-display text-3xl tracking-tight text-foreground">
              Book a consultation
            </h2>
            <p className="mt-2 mb-5 text-sm text-muted-foreground">
              Choose a concern to begin your questionnaire.
            </p>
            <NewConsultCards />
          </div>
        )}

        {!isAuthenticated ? (
          <p className="animate-fade-up mt-5 text-sm text-muted-foreground [animation-delay:280ms]">
            You will sign in before the questionnaire.{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function NewConsultCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/consult/skin"
        className="group rounded-[var(--radius-lg)] border border-border bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-primary"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Consult
        </p>
        <p className="mt-2 font-display text-3xl text-foreground">Skin</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Acne, redness, pigmentation, and barrier concerns.
        </p>
        <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
          Start skin questionnaire
        </p>
      </Link>
      <Link
        href="/consult/hair"
        className="group rounded-[var(--radius-lg)] border border-border bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-primary"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Consult
        </p>
        <p className="mt-2 font-display text-3xl text-foreground">Hair</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thinning, dandruff, scalp irritation, and breakage.
        </p>
        <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
          Start hair questionnaire
        </p>
      </Link>
    </div>
  );
}
