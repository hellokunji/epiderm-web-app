import type {
  ConsultCategory,
  ConsultStatus,
  ConsultSummary,
} from "@/lib/consult/types";

type FixtureConsult = {
  consult_id: string;
  category: ConsultCategory;
  questionnaire_id: string;
  created_at: number;
};

type GlobalStore = typeof globalThis & {
  __epidermFixtureConsults?: Map<string, FixtureConsult>;
};

function store(): Map<string, FixtureConsult> {
  const g = globalThis as GlobalStore;
  if (!g.__epidermFixtureConsults) {
    g.__epidermFixtureConsults = new Map();
  }
  return g.__epidermFixtureConsults;
}

function statusForAge(ms: number): ConsultStatus {
  if (ms < 2500) return "QUESTIONNAIRE_SUBMITTED";
  if (ms < 5500) return "DRAI_DG_PENDING";
  if (ms < 10000) return "DRAI_DG_PROCESSING";
  return "DRAI_DG_DIAGNOSED";
}

export function createFixtureConsult(input: {
  category: ConsultCategory;
  questionnaire_id: string;
}): ConsultSummary {
  const consult_id = `consult_${crypto.randomUUID()}`;
  store().set(consult_id, {
    consult_id,
    category: input.category,
    questionnaire_id: input.questionnaire_id,
    created_at: Date.now(),
  });
  return {
    consult_id,
    status: "QUESTIONNAIRE_SUBMITTED",
    category: input.category,
    questionnaire_id: input.questionnaire_id,
  };
}

export function getFixtureConsult(consultId: string): ConsultSummary | null {
  const row = store().get(consultId);
  if (!row) return null;
  return {
    consult_id: row.consult_id,
    category: row.category,
    questionnaire_id: row.questionnaire_id,
    status: statusForAge(Date.now() - row.created_at),
  };
}

export function fixturesForced(): boolean {
  return process.env.USE_QUESTIONNAIRE_FIXTURES === "true";
}

export function canUseFixtureFallback(status?: number): boolean {
  if (fixturesForced()) return true;
  if (process.env.NODE_ENV !== "development") return false;
  if (status == null) return true;
  return status === 404 || status === 501 || status >= 502;
}
