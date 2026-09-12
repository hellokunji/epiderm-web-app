import type {
  ConsultCategory,
  ConsultDiagnosis,
  ConsultStatus,
  ConsultSummary,
  DiagnosisResult,
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
    asConsultRecord(record.items) ??
    record
  );
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function consultDiagnosis(
  payload: unknown,
): ConsultDiagnosis | null {
  const record = consultRecord(payload);
  const raw = record?.diagnosis;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const diagnosis = raw as Record<string, unknown>;
  const resultRaw = diagnosis.result;
  let result: DiagnosisResult | null = null;
  if (resultRaw && typeof resultRaw === "object" && !Array.isArray(resultRaw)) {
    const row = resultRaw as Record<string, unknown>;
    result = {
      primary_concern:
        typeof row.primary_concern === "string" ? row.primary_concern : undefined,
      observed_symptoms: asStringList(row.observed_symptoms),
      severity_level:
        typeof row.severity_level === "string" ? row.severity_level : undefined,
      recommended_kit_type:
        typeof row.recommended_kit_type === "string"
          ? row.recommended_kit_type
          : undefined,
      doctor_notes_summary:
        typeof row.doctor_notes_summary === "string"
          ? row.doctor_notes_summary
          : undefined,
    };
  }
  return {
    consult_id:
      typeof diagnosis.consult_id === "string" ? diagnosis.consult_id : undefined,
    status: typeof diagnosis.status === "string" ? diagnosis.status : undefined,
    error: typeof diagnosis.error === "string" ? diagnosis.error : null,
    result,
  };
}

export function consultListItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  const items = record.items ?? record.data ?? record.results;
  return Array.isArray(items) ? items : [];
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
