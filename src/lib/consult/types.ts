export const CONSULT_CATEGORIES = ["SKIN", "HAIR"] as const;
export type ConsultCategory = (typeof CONSULT_CATEGORIES)[number];

export type ConsultStatus =
  | "CREATED"
  | "QUESTIONNAIRE_SUBMITTED"
  | "DRAI_DG_PENDING"
  | "DRAI_DG_PROCESSING"
  | "DRAI_DG_DIAGNOSED"
  | "DRAI_DG_PAYMENT_PENDING"
  | "DRAI_DG_PAYMENT_SUCCESS"
  | "DRAI_DG_PAYMENT_FAILED"
  | "DR_DG_PENDING"
  | "DR_DG_APPROVED"
  | "DR_DG_REJECTED"
  | "DRAI_KIT_PROCESSING"
  | "DRAI_KIT_PROCESSED"
  | "DR_KIT_PENDING"
  | "DR_KIT_CREATED";

export type QuestionType =
  | "SINGLE_SELECT"
  | "MULTI_SELECT"
  | "TEXT_INPUT"
  | "FILE_UPLOAD"
  | "BOOLEAN"
  | "SCALE";

export type QuestionUiType =
  | "RADIO_CARDS"
  | "DROPDOWN"
  | "BUTTON_GROUP"
  | "CHECKBOX_CARDS"
  | "CHIP_GROUP"
  | "TEXT_FIELD"
  | "TEXTAREA"
  | "NUMBER_FIELD"
  | "IMAGE_PICKER_GRID"
  | "YES_NO"
  | "SCALE_SLIDER";

export type GroupLayout = "VERTICAL" | "HORIZONTAL" | "GRID";

export type VisibilityOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "IN"
  | "NOT_IN"
  | "CONTAINS";

export type VisibilityRule =
  | {
      field: string;
      operator: VisibilityOperator;
      value: unknown;
    }
  | {
      operator: "AND" | "OR";
      rules: VisibilityRule[];
    };

export type ValidationRule = {
  type:
    | "MIN_VALUE"
    | "MAX_VALUE"
    | "MIN_LENGTH"
    | "MAX_LENGTH"
    | "PATTERN"
    | "MIN_ITEMS"
    | "MAX_ITEMS";
  value: number | string;
  error_message: string;
};

export type QuestionOption = {
  label: string;
  value: string;
  description?: string;
  icon_url?: string;
};

export type FileConstraints = {
  max_files: number;
  min_files?: number;
  max_size_mb: number;
  allowed_mime_types: string[];
};

export type QuestionnaireQuestion = {
  id: string;
  title: string;
  type: QuestionType;
  ui_type: QuestionUiType;
  hint?: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  visibility_rule?: VisibilityRule;
  validation?: ValidationRule[];
  file_constraints?: FileConstraints;
  scale?: { min: number; max: number; step?: number };
  analytics?: { event_name: string };
};

export type QuestionnaireGroup = {
  group_id: string;
  title?: string;
  layout: GroupLayout;
  questions: QuestionnaireQuestion[];
};

export type QuestionnaireStep = {
  step_id: string;
  title: string;
  subtitle?: string;
  groups: QuestionnaireGroup[];
};

export type QuestionnaireSchema = {
  questionnaire_id: string;
  category: ConsultCategory;
  version: number;
  locale?: string;
  steps: QuestionnaireStep[];
};

export type AnswerValue = string | number | boolean | string[] | File[] | null;

export type AnswersMap = Record<string, AnswerValue>;

export type QuestionAnswerPayload = {
  question_id: string;
  question: string;
  answer: string | string[] | number | boolean;
};

export type ConsultSubmitPayload = {
  category: ConsultCategory;
  questionnaire: {
    questionnaire_id: string;
    answers: QuestionAnswerPayload[];
  };
  images?: string[];
  videos?: string[];
};

export type ConsultSummary = {
  consult_id: string;
  status: ConsultStatus;
  category?: ConsultCategory;
  questionnaire_id?: string;
};

export function isConsultCategory(value: string): value is ConsultCategory {
  return (CONSULT_CATEGORIES as readonly string[]).includes(value);
}

export function categoryFromPath(segment: string): ConsultCategory | null {
  const upper = segment.trim().toUpperCase();
  return isConsultCategory(upper) ? upper : null;
}
