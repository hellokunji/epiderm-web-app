"use client";

export default function ConsultError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="hero-surface flex flex-1 flex-col items-center justify-center px-6 pt-28 text-center">
      <h1 className="font-display text-3xl text-foreground">
        Couldn’t load this questionnaire
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The clinic service may be unavailable. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-md)] bg-primary px-5 text-sm font-medium text-primary-foreground"
      >
        Retry
      </button>
    </div>
  );
}
