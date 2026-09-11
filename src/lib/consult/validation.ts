import type {
  AnswersMap,
  AnswerValue,
  FileConstraints,
  QuestionnaireQuestion,
  QuestionnaireStep,
} from "@/lib/consult/types";
import { isRuleVisible } from "@/lib/consult/visibility";

export function isQuestionRequired(question: QuestionnaireQuestion): boolean {
  const value = question.required as unknown;
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return false;
}

export function isEmptyAnswer(value: AnswerValue): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return Number.isNaN(value);
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return value.length === 0;
  return true;
}

function fileList(value: AnswerValue): File[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is File => item instanceof File);
}

function validateFiles(
  files: File[],
  constraints: FileConstraints | undefined,
): string | null {
  if (!constraints) return null;
  const min = constraints.min_files ?? 0;
  if (files.length < min) {
    return `Please add at least ${min} file${min === 1 ? "" : "s"}`;
  }
  if (files.length > constraints.max_files) {
    return `You can upload up to ${constraints.max_files} files`;
  }
  const maxBytes = constraints.max_size_mb * 1024 * 1024;
  for (const file of files) {
    if (file.size > maxBytes) {
      return `${file.name} exceeds ${constraints.max_size_mb} MB`;
    }
    if (
      constraints.allowed_mime_types.length > 0 &&
      !constraints.allowed_mime_types.includes(file.type)
    ) {
      return `${file.name} is not an allowed file type`;
    }
  }
  return null;
}

export function validateQuestion(
  question: QuestionnaireQuestion,
  value: AnswerValue,
): string | null {
  const required = isQuestionRequired(question);

  if (required && isEmptyAnswer(value)) {
    return "This field is required";
  }

  const isFileQuestion =
    question.type === "FILE_UPLOAD" ||
    question.ui_type === "IMAGE_PICKER_GRID";

  if (isFileQuestion) {
    const files = fileList(value);
    // Optional uploads with min_files in constraints must still be skippable.
    if (files.length === 0 && !required) return null;
    if (required && files.length === 0) {
      return "Please upload at least one photo";
    }
    return validateFiles(files, question.file_constraints);
  }

  if (isEmptyAnswer(value) || !question.validation) return null;

  const numeric =
    typeof value === "number" ? value : Number(String(value).trim());
  const text = typeof value === "string" ? value : String(value ?? "");
  const items = Array.isArray(value) ? value : [];

  for (const rule of question.validation) {
    if (rule.type === "MIN_VALUE" && Number(numeric) < Number(rule.value)) {
      return rule.error_message;
    }
    if (rule.type === "MAX_VALUE" && Number(numeric) > Number(rule.value)) {
      return rule.error_message;
    }
    if (rule.type === "MIN_LENGTH" && text.trim().length < Number(rule.value)) {
      return rule.error_message;
    }
    if (rule.type === "MAX_LENGTH" && text.trim().length > Number(rule.value)) {
      return rule.error_message;
    }
    if (rule.type === "PATTERN" && !new RegExp(String(rule.value)).test(text)) {
      return rule.error_message;
    }
    if (rule.type === "MIN_ITEMS" && items.length < Number(rule.value)) {
      return rule.error_message;
    }
    if (rule.type === "MAX_ITEMS" && items.length > Number(rule.value)) {
      return rule.error_message;
    }
  }

  return null;
}

export function visibleQuestions(step: QuestionnaireStep, answers: AnswersMap) {
  return step.groups.flatMap((group) =>
    group.questions.filter((question) =>
      isRuleVisible(question.visibility_rule, answers),
    ),
  );
}

export function validateStep(
  step: QuestionnaireStep,
  answers: AnswersMap,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const question of visibleQuestions(step, answers)) {
    const message = validateQuestion(question, answers[question.id] ?? null);
    if (message) errors[question.id] = message;
  }
  return errors;
}
