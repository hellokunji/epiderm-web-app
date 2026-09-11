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
  ConsultSummary,
  ConsultStatus,
  QuestionnaireSchema,
} from "@/lib/consult/types";

export const CLINIC_PATHS = {
  questionnaire: (category: ConsultCategory) =>
    `/api/v1/questionnaire/?category=${encodeURIComponent(category)}`,
  consults: "/api/v1/consults",
  consult: (id: string) => `/api/v1/consults/${encodeURIComponent(id)}`,
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

function unwrapConsult(payload: unknown): ConsultSummary | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const candidate = (record.data ?? record.consult ?? payload) as Record<
    string,
    unknown
  >;
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

export async function loadQuestionnaire(
  category: ConsultCategory,
): Promise<{ questionnaire: QuestionnaireSchema; source: "clinic" | "fixture" }> {
  console.log("1");
  if (fixturesForced()) {
    return { questionnaire: questionnaireFixture(category), source: "fixture" };
  }
  console.log("2");

  try {
    const res = await backendFetch(
      "clinic",
      CLINIC_PATHS.questionnaire(category),
    );
    console.log("3", CLINIC_PATHS.questionnaire(category), res);
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

export async function submitConsult(formData: FormData): Promise<{
  consult: ConsultSummary;
  status: number;
}> {
  if (fixturesForced()) {
    return { consult: submitFixture(formData), status: 202 };
  }

  try {
    const res = await backendFetch("clinic", CLINIC_PATHS.consults, {
      method: "POST",
      body: formData,
    });

    if (res.status === 202 || res.ok) {
      const parsed = unwrapConsult(await res.json().catch(() => null));
      if (parsed) return { consult: parsed, status: res.status === 201 ? 201 : 202 };
    }

    if (res.status === 401) {
      throw Object.assign(new Error("UNAUTHORIZED"), { status: 401 });
    }

    if (canUseFixtureFallback(res.status)) {
      return { consult: submitFixture(formData), status: 202 };
    }

    const payload = (await res.json().catch(() => null)) as {
      detail?: string;
      error?: string;
    } | null;
    throw Object.assign(
      new Error(payload?.error ?? payload?.detail ?? "Submit failed"),
      { status: res.status },
    );
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
      return { consult: submitFixture(formData), status: 202 };
    }
    throw error;
  }
}

function submitFixture(formData: FormData): ConsultSummary {
  const category = String(formData.get("category") ?? "SKIN").toUpperCase() as ConsultCategory;
  const questionnaire_id = String(formData.get("questionnaire_id") ?? "unknown");
  return createFixtureConsult({
    category: category === "HAIR" ? "HAIR" : "SKIN",
    questionnaire_id,
  });
}

export async function loadConsult(consultId: string): Promise<ConsultSummary> {
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
  const parsed = unwrapConsult(await res.json());
  if (!parsed) {
    throw Object.assign(new Error("Invalid consult payload"), { status: 502 });
  }
  return parsed;
}
