import type {
  AnswersMap,
  AnswerValue,
  QuestionnaireQuestion,
} from "@/lib/consult/types";
import { isRuleVisible } from "@/lib/consult/visibility";
import type { QuestionnaireSchema } from "@/lib/consult/types";

export function flattenVisibleQuestions(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): QuestionnaireQuestion[] {
  return schema.steps.flatMap((step) =>
    step.groups.flatMap((group) =>
      group.questions.filter((question) =>
        isRuleVisible(question.visibility_rule, answers),
      ),
    ),
  );
}

export function answersToJson(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): Record<string, unknown> {
  const json: Record<string, unknown> = {};
  for (const question of flattenVisibleQuestions(schema, answers)) {
    const value = answers[question.id];
    if (question.type === "FILE_UPLOAD") {
      const files = Array.isArray(value)
        ? value.filter((item): item is File => item instanceof File)
        : [];
      json[question.id] = files.map((file) => file.name);
      continue;
    }
    json[question.id] = value ?? null;
  }
  return json;
}

export function buildConsultFormData(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): FormData {
  const form = new FormData();
  form.set("questionnaire_id", schema.questionnaire_id);
  form.set("version", String(schema.version));
  form.set("category", schema.category);
  form.set("answers", JSON.stringify(answersToJson(schema, answers)));

  for (const question of flattenVisibleQuestions(schema, answers)) {
    if (question.type !== "FILE_UPLOAD") continue;
    const value = answers[question.id];
    const files = Array.isArray(value)
      ? value.filter((item): item is File => item instanceof File)
      : [];
    for (const file of files) {
      form.append(question.id, file);
    }
  }

  return form;
}

export function defaultAnswer(question: QuestionnaireQuestion): AnswerValue {
  if (question.type === "MULTI_SELECT" || question.type === "FILE_UPLOAD") {
    return [];
  }
  if (question.type === "SCALE" && question.scale) {
    return question.scale.min;
  }
  return null;
}
