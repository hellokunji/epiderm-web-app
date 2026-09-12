import type { ConsultDiagnosis } from "@/lib/consult/types";

export function DiagnosisFindings({
  diagnosis,
  onBack,
}: {
  diagnosis: ConsultDiagnosis;
  onBack: () => void;
}) {
  const result = diagnosis.result;
  const symptoms = result?.observed_symptoms ?? [];

  return (
    <div className="animate-fade-up mx-auto w-full max-w-2xl text-left">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        AI diagnosis
      </p>
      <h1 className="font-display mt-3 text-4xl tracking-tight text-foreground">
        {result?.primary_concern ?? "Your assessment"}
      </h1>
      {result?.severity_level ? (
        <p className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
          Severity: {result.severity_level}
        </p>
      ) : null}

      {symptoms.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-foreground">Observed symptoms</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <li
                key={symptom}
                className="rounded-[var(--radius-md)] border border-border bg-card px-3 py-1.5 text-sm text-card-foreground"
              >
                {symptom}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result?.recommended_kit_type ? (
        <section className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-5">
          <h2 className="text-sm font-medium text-foreground">Recommended kit</h2>
          <p className="mt-2 text-lg text-foreground">
            {result.recommended_kit_type}
          </p>
        </section>
      ) : null}

      {result?.doctor_notes_summary ? (
        <section className="mt-6">
          <h2 className="text-sm font-medium text-foreground">Clinical notes</h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {result.doctor_notes_summary}
          </p>
        </section>
      ) : null}

      {diagnosis.error ? (
        <p className="mt-6 text-sm text-destructive" role="alert">
          {diagnosis.error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onBack}
        className="mt-10 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to status
      </button>
    </div>
  );
}
