"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";
import type { ConsultSummary } from "@/lib/consult/types";
import {
  diagnosisPhaseLabel,
  diagnosisProgress,
  isDiagnosisFailed,
  isDiagnosisReady,
} from "@/lib/consult/status";

const SCAN_LINES = [
  "Mapping texture and tone",
  "Checking lesion patterns",
  "Comparing with clinical priors",
  "Drafting a structured finding",
];

export function DiagnosisAwaiting({
  initial,
}: {
  initial: ConsultSummary;
}) {
  const [consult, setConsult] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [line, setLine] = useState(0);
  const ready = isDiagnosisReady(consult.status);
  const failed = isDiagnosisFailed(consult.status);
  const progress = diagnosisProgress(consult.status);

  useEffect(() => {
    if (ready || failed) return;
    const timer = window.setInterval(() => {
      setLine((current) => (current + 1) % SCAN_LINES.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [failed, ready]);

  useEffect(() => {
    if (ready || failed) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await apiFetch(`/api/consults/${consult.consult_id}`);
        if (!res.ok) {
          throw new Error("Could not refresh consult status");
        }
        const next = (await res.json()) as ConsultSummary;
        if (!cancelled) {
          setConsult(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Polling failed");
        }
      }
    }

    void poll();
    const timer = window.setInterval(() => void poll(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [consult.consult_id, failed, ready]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        AI diagnosis
      </p>

      <div className="relative mt-10 flex h-56 w-56 items-center justify-center">
        <span className="diagnosis-ring diagnosis-ring-1" />
        <span className="diagnosis-ring diagnosis-ring-2" />
        <span className="diagnosis-ring diagnosis-ring-3" />
        <div className="diagnosis-orb relative z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full">
          {!ready && !failed ? <span className="diagnosis-scan" /> : null}
          <span className="relative z-10 font-display text-3xl text-primary-foreground">
            {ready ? "✓" : failed ? "!" : "AI"}
          </span>
        </div>
      </div>

      <h1 className="font-display mt-10 text-4xl tracking-tight text-foreground">
        {ready
          ? "Your assessment is ready"
          : failed
            ? "We could not complete this review"
            : "Reading your consult"}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {diagnosisPhaseLabel(consult.status)}
        {!ready && !failed ? ` — ${SCAN_LINES[line]}.` : "."}
      </p>

      <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{consult.status}</p>

      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {ready ? (
        <div className="mt-10 space-y-3">
          <p className="text-sm text-muted-foreground">
            Unlock the full findings and request a doctor review in the next
            step.
          </p>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Continue
          </Link>
        </div>
      ) : null}
    </div>
  );
}
