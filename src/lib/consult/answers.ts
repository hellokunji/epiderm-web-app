import type {
  AnswersMap,
  AnswerValue,
  ConsultSubmitPayload,
  QuestionAnswerPayload,
  QuestionnaireQuestion,
  QuestionnaireSchema,
} from "@/lib/consult/types";
import { isFileQuestion, mediaItems } from "@/lib/consult/validation";
import { isRuleVisible } from "@/lib/consult/visibility";

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

function mediaUrlsFromAnswer(value: AnswerValue): string[] {
  return mediaItems(value).filter(
    (item): item is string => typeof item === "string",
  );
}

function isVideoQuestion(question: QuestionnaireQuestion): boolean {
  return (question.file_constraints?.allowed_mime_types ?? []).some((type) =>
    type.startsWith("video/"),
  );
}

function scalarAnswer(
  value: AnswerValue,
): string | string[] | number | boolean | null {
  if (value == null) return null;
  if (typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const strings = value.filter((item): item is string => typeof item === "string");
    return strings.length > 0 ? strings : null;
  }
  return null;
}

export function buildConsultPayload(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): ConsultSubmitPayload {
  const payloadAnswers: QuestionAnswerPayload[] = [];
  const images: string[] = [];
  const videos: string[] = [];

  for (const question of flattenVisibleQuestions(schema, answers)) {
    const value = answers[question.id] ?? null;

    if (isFileQuestion(question)) {
      const urls = mediaUrlsFromAnswer(value);
      if (urls.length === 0) continue;
      payloadAnswers.push({
        question_id: question.id,
        question: question.title,
        answer: urls.length === 1 ? urls[0] : urls,
      });
      if (isVideoQuestion(question)) videos.push(...urls);
      else images.push(...urls);
      continue;
    }

    const answer = scalarAnswer(value);
    if (answer == null || answer === "") continue;
    payloadAnswers.push({
      question_id: question.id,
      question: question.title,
      answer,
    });
  }

  return {
    category: schema.category,
    questionnaire: {
      questionnaire_id: schema.questionnaire_id,
      answers: payloadAnswers,
    },
    ...(images.length > 0 ? { images } : {}),
    ...(videos.length > 0 ? { videos } : {}),
  };
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
