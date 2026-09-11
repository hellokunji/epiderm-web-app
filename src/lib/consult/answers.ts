import type {
  AnswersMap,
  AnswerValue,
  QuestionnaireQuestion,
} from "@/lib/consult/types";
import { isRuleVisible } from "@/lib/consult/visibility";
import type { QuestionnaireSchema } from "@/lib/consult/types";

export function flattenQuestions(
  schema: QuestionnaireSchema,
): QuestionnaireQuestion[] {
  return schema.steps.flatMap((step) =>
    step.groups.flatMap((group) => group.questions),
  );
}

export function flattenVisibleQuestions(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): QuestionnaireQuestion[] {
  return flattenQuestions(schema).filter((question) =>
    isRuleVisible(question.visibility_rule, answers),
  );
}

function isFileQuestion(question: QuestionnaireQuestion): boolean {
  return (
    question.type === "FILE_UPLOAD" ||
    question.ui_type === "IMAGE_PICKER_GRID"
  );
}

function filesFromAnswer(value: AnswerValue): File[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is File => item instanceof File);
}

function serializeAnswer(
  question: QuestionnaireQuestion,
  value: AnswerValue,
): unknown {
  if (isFileQuestion(question)) {
    return filesFromAnswer(value).map((file) => file.name);
  }
  return value ?? null;
}

export function answersToJson(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): Record<string, unknown> {
  const json: Record<string, unknown> = {};
  for (const question of flattenQuestions(schema)) {
    json[question.id] = serializeAnswer(question, answers[question.id] ?? null);
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
  if (schema.locale) form.set("locale", schema.locale);

  const answerMap = answersToJson(schema, answers);
  form.set("answers", JSON.stringify(answerMap));

  for (const question of flattenQuestions(schema)) {
    const serialized = answerMap[question.id];
    if (isFileQuestion(question)) {
      for (const file of filesFromAnswer(answers[question.id] ?? null)) {
        form.append(question.id, file);
      }
      continue;
    }
    if (serialized == null) {
      form.set(question.id, "");
      continue;
    }
    form.set(
      question.id,
      typeof serialized === "string" ? serialized : JSON.stringify(serialized),
    );
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
