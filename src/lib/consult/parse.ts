import type {
  ConsultCategory,
  ConsultStatus,
  ConsultSummary,
} from "@/lib/consult/types";

function asConsultRecord(value: unknown): Record<string, unknown> | null {
  if (Array.isArray(value)) {
    const first = value[0];
    return first && typeof first === "object"
      ? (first as Record<string, unknown>)
      : null;
  }
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return null;
}

export function consultRecord(
  payload: unknown,
): Record<string, unknown> | null {
  const record = asConsultRecord(payload);
  if (!record) return null;
  return (
    asConsultRecord(record.data) ??
    asConsultRecord(record.consult) ??
    asConsultRecord(record.results) ??
    record
  );
}

export function unwrapConsult(payload: unknown): ConsultSummary | null {
  const candidate = consultRecord(payload);
  if (!candidate) return null;
  const consultId =
    (typeof candidate.consult_id === "string" && candidate.consult_id) ||
    (typeof candidate.id === "string" && candidate.id) ||
    null;
  if (!consultId) return null;
  return {
    consult_id: consultId,
    status: (candidate.status as ConsultStatus) ?? "QUESTIONNAIRE_SUBMITTED",
    category: candidate.category as ConsultCategory | undefined,
    questionnaire_id:
      typeof candidate.questionnaire_id === "string"
        ? candidate.questionnaire_id
        : undefined,
  };
}

export function errorMessageFromPayload(
  payload: unknown,
  fallback: string,
): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.error === "string" && record.error) return record.error;
  if (typeof record.detail === "string" && record.detail) return record.detail;
  if (Array.isArray(record.detail) && record.detail[0]) {
    const first = record.detail[0] as { msg?: string };
    if (typeof first.msg === "string" && first.msg) return first.msg;
  }
  return fallback;
}
