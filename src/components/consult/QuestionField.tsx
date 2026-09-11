"use client";

import { useEffect } from "react";
import { ImagePickerGrid } from "@/components/consult/ImagePickerGrid";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";
import type {
  AnswerValue,
  QuestionnaireQuestion,
} from "@/lib/consult/types";

type QuestionFieldProps = {
  question: QuestionnaireQuestion;
  value: AnswerValue;
  error?: string;
  onChange: (value: AnswerValue) => void;
};

function asString(value: AnswerValue): string {
  if (value == null || typeof value === "boolean") return "";
  if (Array.isArray(value)) return "";
  return String(value);
}

function asStringList(value: AnswerValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asFiles(value: AnswerValue): File[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is File => item instanceof File);
}

function OptionIcon({ url }: { url?: string }) {
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-10 w-10 rounded-md object-cover" />
  );
}

function ScaleSliderField({
  question,
  value,
  describedBy,
  onChange,
}: {
  question: QuestionnaireQuestion;
  value: AnswerValue;
  describedBy?: string;
  onChange: (value: AnswerValue) => void;
}) {
  const min = question.scale?.min ?? 1;
  const max = question.scale?.max ?? 10;
  const step = question.scale?.step ?? 1;
  const current = typeof value === "number" ? value : min;

  useEffect(() => {
    if (typeof value !== "number") onChange(min);
    // Parent onChange identity is not stable; only seed once per empty value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, value, min]);

  return (
    <div className="space-y-2">
      <input
        id={question.id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        aria-describedby={describedBy}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--primary)]"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span className="font-medium text-foreground">{current}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function QuestionField({
  question,
  value,
  error,
  onChange,
}: QuestionFieldProps) {
  const describedBy = error ? `${question.id}-error` : undefined;

  if (question.ui_type === "RADIO_CARDS") {
    const selected = asString(value);
    return (
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={describedBy}>
        {(question.options ?? []).map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-left transition-colors",
                active
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border bg-card hover:border-primary/50",
              )}
            >
              <OptionIcon url={option.icon_url} />
              <span>
                <span className="block text-sm font-medium">{option.label}</span>
                {option.description ? (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.ui_type === "BUTTON_GROUP" || question.ui_type === "YES_NO") {
    const options =
      question.ui_type === "YES_NO"
        ? [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ]
        : (question.options ?? []);
    const selected =
      question.type === "BOOLEAN"
        ? value === true
          ? "true"
          : value === false
            ? "false"
            : ""
        : asString(value);

    return (
      <div className="flex flex-wrap gap-2" role="group" aria-describedby={describedBy}>
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(
                  question.type === "BOOLEAN"
                    ? option.value === "true"
                    : option.value,
                )
              }
              className={cn(
                "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.ui_type === "DROPDOWN") {
    return (
      <select
        id={question.id}
        value={asString(value)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value || null)}
        className="flex h-11 w-full rounded-[var(--radius-md)] border border-input bg-card px-3 text-sm text-foreground focus-visible:border-input-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <option value="">Select…</option>
        {(question.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (question.ui_type === "CHIP_GROUP" || question.ui_type === "CHECKBOX_CARDS") {
    const selected = asStringList(value);
    const isCards = question.ui_type === "CHECKBOX_CARDS";
    return (
      <div className={cn(isCards ? "grid gap-3 sm:grid-cols-2" : "flex flex-wrap gap-2")}>
        {(question.options ?? []).map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                onChange(
                  active
                    ? selected.filter((item) => item !== option.value)
                    : [...selected, option.value],
                );
              }}
              className={cn(
                "rounded-[var(--radius-md)] border text-left text-sm transition-colors",
                isCards ? "px-4 py-3" : "rounded-full px-3 py-1.5",
                active
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border bg-card hover:border-primary/50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.ui_type === "NUMBER_FIELD") {
    return (
      <Input
        id={question.id}
        type="number"
        inputMode="numeric"
        placeholder={question.placeholder}
        value={asString(value)}
        aria-describedby={describedBy}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === "" ? null : Number(raw));
        }}
      />
    );
  }

  if (question.ui_type === "TEXTAREA") {
    return (
      <Textarea
        id={question.id}
        placeholder={question.placeholder}
        value={asString(value)}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (question.ui_type === "SCALE_SLIDER") {
    return (
      <ScaleSliderField
        question={question}
        value={value}
        describedBy={describedBy}
        onChange={onChange}
      />
    );
  }

  if (question.ui_type === "IMAGE_PICKER_GRID") {
    return (
      <ImagePickerGrid
        files={asFiles(value)}
        constraints={question.file_constraints}
        error={error}
        onChange={onChange}
      />
    );
  }

  return (
    <Input
      id={question.id}
      type="text"
      placeholder={question.placeholder}
      value={asString(value)}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
