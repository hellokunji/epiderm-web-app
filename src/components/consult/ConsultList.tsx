import Link from "next/link";
import type { ConsultSummary } from "@/lib/consult/types";
import { unwrapConsultList } from "@/lib/consult/parse";
import { diagnosisPhaseLabel } from "@/lib/consult/status";

export function ConsultCard({ consult }: { consult: ConsultSummary }) {
  return (
    <Link
      href={`/consults/${consult.consult_id}`}
      className="group block rounded-[var(--radius-lg)] border border-border bg-card/80 p-5 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {consult.category === "HAIR" ? "Hair" : "Skin"} consult
          </p>
          <p className="mt-2 font-display text-2xl text-foreground">
            {diagnosisPhaseLabel(consult.status)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {consult.status.replaceAll("_", " ")}
          </p>
        </div>
        <p className="text-sm font-medium text-primary group-hover:underline">
          Open
        </p>
      </div>
    </Link>
  );
}

export function ConsultList({ payload }: { payload: unknown }) {
  const consults = unwrapConsultList(payload);

  if (consults.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-card/80 p-8 text-center">
        <p className="text-foreground">No consultations yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Start a skin or hair consult to see it here.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/consult/skin"
            className="text-sm font-medium text-primary hover:underline"
          >
            Skin consult
          </Link>
          <Link
            href="/consult/hair"
            className="text-sm font-medium text-primary hover:underline"
          >
            Hair consult
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid gap-4">
      {consults.map((consult) => (
        <li key={consult.consult_id}>
          <ConsultCard consult={consult} />
        </li>
      ))}
    </ul>
  );
}
