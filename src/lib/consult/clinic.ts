import { backendFetch } from "@/lib/api/server";
import { questionnaireFixture } from "@/lib/consult/fixtures";
import {
  canUseFixtureFallback,
  createFixtureConsult,
  fixturesForced,
  getFixtureConsult,
} from "@/lib/consult/fixture-store";
import type {
  ConsultCategory,
  ConsultSubmitPayload,
  ConsultSummary,
  QuestionnaireSchema,
} from "@/lib/consult/types";

export const CLINIC_PATHS = {
  questionnaire: (category: ConsultCategory) =>
    `/api/v1/questionnaire/?category=${encodeURIComponent(category)}`,
  submitQuestionnaire: "/api/v1/questionnaire",
  consults: "/api/v1/consults",
  consultAll: "/api/v1/consult/all",
  consult: (id: string) =>
    `/api/v1/consult/?consult_id=${encodeURIComponent(id)}`,
} as const;

function unwrapQuestionnaire(payload: unknown): QuestionnaireSchema | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const candidate = (record.data ?? record.questionnaire ?? payload) as Record<
    string,
    unknown
  >;
  if (
    typeof candidate.questionnaire_id === "string" &&
    Array.isArray(candidate.steps)
  ) {
    return candidate as unknown as QuestionnaireSchema;
  }
  return null;
}

export async function loadQuestionnaire(
  category: ConsultCategory,
): Promise<{ questionnaire: QuestionnaireSchema; source: "clinic" | "fixture" }> {
  if (fixturesForced()) {
    return { questionnaire: questionnaireFixture(category), source: "fixture" };
  }

  try {
    const res = await backendFetch(
      "clinic",
      CLINIC_PATHS.questionnaire(category),
    );
    if (res.ok) {
      const parsed = unwrapQuestionnaire(await res.json());
      if (parsed) return { questionnaire: parsed, source: "clinic" };
    }
    if (res.status === 401) {
      throw Object.assign(new Error("UNAUTHORIZED"), { status: 401 });
    }
    if (canUseFixtureFallback(res.status)) {
      return { questionnaire: questionnaireFixture(category), source: "fixture" };
    }
    throw Object.assign(new Error("Failed to load questionnaire"), {
      status: res.status,
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status?: number }).status === 401
    ) {
      throw error;
    }
    if (canUseFixtureFallback()) {
      return { questionnaire: questionnaireFixture(category), source: "fixture" };
    }
    throw error;
  }
}

export async function submitConsult(body: ConsultSubmitPayload): Promise<{
  status: number;
  payload: unknown;
}> {
  if (fixturesForced()) {
    return { status: 202, payload: submitFixture(body) };
  }

  const res = await backendFetch("clinic", CLINIC_PATHS.submitQuestionnaire, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => null);
  return { status: res.status, payload };
}

function submitFixture(body: ConsultSubmitPayload): ConsultSummary {
  const category = body.category === "HAIR" ? "HAIR" : "SKIN";
  return createFixtureConsult({
    category,
    questionnaire_id: body.questionnaire.questionnaire_id || "unknown",
  });
}

export async function loadConsult(consultId: string): Promise<unknown> {
  const fixture = getFixtureConsult(consultId);
  if (fixture) return fixture;
  if (fixturesForced()) {
    throw Object.assign(new Error("Consult not found"), { status: 404 });
  }

  const res = await backendFetch("clinic", CLINIC_PATHS.consult(consultId));
  if (res.status === 401) {
    throw Object.assign(new Error("UNAUTHORIZED"), { status: 401 });
  }
  if (!res.ok) {
    throw Object.assign(new Error("Consult not found"), { status: res.status });
  }
  return res.json();
}

export async function loadConsultList(): Promise<unknown> {
  if (fixturesForced()) {
    return { items: [] };
  }

  const res = await backendFetch("clinic", CLINIC_PATHS.consultAll);
  if (res.status === 401) {
    throw Object.assign(new Error("UNAUTHORIZED"), { status: 401 });
  }
  if (!res.ok) {
    throw Object.assign(new Error("Could not load consultations"), {
      status: res.status,
    });
  }
  return res.json();
}
