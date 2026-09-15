"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { buildConsultPayload } from "@/lib/consult/answers";
import { errorMessageFromPayload, unwrapConsult } from "@/lib/consult/parse";
import { withUploadedMedia } from "@/lib/consult/uploads";
import type {
  AnswersMap,
  AnswerValue,
  QuestionnaireSchema,
} from "@/lib/consult/types";
import { isRuleVisible } from "@/lib/consult/visibility";
import { isQuestionRequired, validateStep } from "@/lib/consult/validation";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { QuestionField } from "@/components/consult/QuestionField";
import { cn } from "@/lib/utils/cn";

export function QuestionnaireWizard({
  schema,
}: {
  schema: QuestionnaireSchema;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const step = schema.steps[stepIndex];
  const isLast = stepIndex === schema.steps.length - 1;
  const progress = ((stepIndex + 1) / schema.steps.length) * 100;

  const groups = useMemo(
    () =>
      step.groups.map((group) => ({
        ...group,
        questions: group.questions.filter((question) =>
          isRuleVisible(question.visibility_rule, answers),
        ),
      })),
    [answers, step.groups],
  );

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function goNext() {
    const nextErrors = validateStep(step, answers);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStepIndex((index) => Math.min(index + 1, schema.steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  async function onSubmit() {
    const nextErrors = validateStep(step, answers);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    setSubmitError(null);
    try {
      const answersWithUrls = await withUploadedMedia(schema, answers);
      const res = await apiFetch("/api/consults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildConsultPayload(schema, answersWithUrls)),
      });
      const payload = await res.json().catch(() => null);
      const consult = unwrapConsult(payload);
      if (!res.ok || !consult?.consult_id) {
        throw new Error(
          errorMessageFromPayload(payload, "Could not submit questionnaire"),
        );
      }
      router.push(`/consults/${consult.consult_id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not submit questionnaire",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {schema.category === "HAIR" ? "Hair consult" : "Skin consult"}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-slow)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Step {stepIndex + 1} of {schema.steps.length}
        </p>
      </div>

      <h1 className="font-display text-4xl tracking-tight text-foreground">
        {step.title}
      </h1>
      {step.subtitle ? (
        <p className="mt-2 text-muted-foreground">{step.subtitle}</p>
      ) : null}

      <form
        className="mt-8 space-y-10"
        onSubmit={(event) => {
          event.preventDefault();
          if (isLast) void onSubmit();
          else goNext();
        }}
      >
        {groups.map((group) => (
          <section key={group.group_id} className="space-y-6">
            {group.title ? (
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h2>
            ) : null}
            <div
              className={cn(
                "space-y-6",
                group.layout === "GRID" && "sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0",
                group.layout === "HORIZONTAL" && "sm:flex sm:flex-wrap sm:gap-6 sm:space-y-0",
              )}
            >
              {group.questions.map((question) => (
                <div key={question.id} className="min-w-0 flex-1">
                  <Label htmlFor={question.id}>
                    {question.title}
                    {isQuestionRequired(question) ? (
                      <span className="text-destructive"> *</span>
                    ) : null}
                  </Label>
                  {question.hint ? (
                    <p className="mb-2 text-xs text-muted-foreground">
                      {question.hint}
                    </p>
                  ) : null}
                  <QuestionField
                    question={question}
                    value={answers[question.id] ?? null}
                    error={errors[question.id]}
                    onChange={(value) => setAnswer(question.id, value)}
                  />
                  {errors[question.id] ? (
                    <p
                      id={`${question.id}-error`}
                      className="mt-2 text-sm text-destructive"
                      role="alert"
                    >
                      {errors[question.id]}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}

        {submitError ? (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0 || pending}
          >
            Back
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Uploading…" : isLast ? "Submit for diagnosis" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
