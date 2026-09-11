import type { ConsultStatus } from "@/lib/consult/types";

const DIAGNOSIS_READY: ConsultStatus[] = [
  "DRAI_DG_DIAGNOSED",
  "DRAI_DG_PAYMENT_PENDING",
  "DRAI_DG_PAYMENT_SUCCESS",
  "DR_DG_PENDING",
  "DR_DG_APPROVED",
];

const DIAGNOSIS_FAILED: ConsultStatus[] = [
  "DRAI_DG_PAYMENT_FAILED",
  "DR_DG_REJECTED",
];

export function isDiagnosisReady(status: ConsultStatus): boolean {
  return DIAGNOSIS_READY.includes(status);
}

export function isDiagnosisFailed(status: ConsultStatus): boolean {
  return DIAGNOSIS_FAILED.includes(status);
}

export function diagnosisPhaseLabel(status: ConsultStatus): string {
  switch (status) {
    case "CREATED":
    case "QUESTIONNAIRE_SUBMITTED":
      return "We received your photos and answers";
    case "DRAI_DG_PENDING":
      return "Your case is queued for AI review";
    case "DRAI_DG_PROCESSING":
      return "Our vision model is reading your images";
    case "DRAI_DG_DIAGNOSED":
    case "DRAI_DG_PAYMENT_PENDING":
      return "Your AI assessment is ready";
    default:
      return "Working on your consult";
  }
}

export function diagnosisProgress(status: ConsultStatus): number {
  switch (status) {
    case "CREATED":
      return 8;
    case "QUESTIONNAIRE_SUBMITTED":
      return 22;
    case "DRAI_DG_PENDING":
      return 48;
    case "DRAI_DG_PROCESSING":
      return 76;
    default:
      return isDiagnosisReady(status) ? 100 : 30;
  }
}
