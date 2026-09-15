import { apiFetch } from "@/lib/api/client";
import {
  flattenVisibleQuestions,
  isVideoQuestion,
} from "@/lib/consult/answers";
import { errorMessageFromPayload } from "@/lib/consult/parse";
import type { AnswersMap, QuestionnaireSchema } from "@/lib/consult/types";
import { isFileQuestion, mediaItems } from "@/lib/consult/validation";

function uploadUrlFromResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const url = (payload as { url?: unknown }).url;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

async function uploadMediaFile(
  kind: "images" | "videos",
  file: File,
): Promise<string> {
  const form = new FormData();
  form.append("file", file, file.name);
  const res = await apiFetch(`/api/uploads/${kind}`, {
    method: "POST",
    body: form,
  });
  const payload = await res.json().catch(() => null);
  const url = uploadUrlFromResponse(payload);
  if (!res.ok || !url) {
    throw new Error(
      errorMessageFromPayload(
        payload,
        kind === "videos" ? "Could not upload video" : "Could not upload photo",
      ),
    );
  }
  return url;
}

export async function withUploadedMedia(
  schema: QuestionnaireSchema,
  answers: AnswersMap,
): Promise<AnswersMap> {
  const next: AnswersMap = { ...answers };

  for (const question of flattenVisibleQuestions(schema, answers)) {
    if (!isFileQuestion(question)) continue;

    const items = mediaItems(answers[question.id] ?? null);
    if (items.length === 0) continue;

    const videoQuestion = isVideoQuestion(question);
    const urls = await Promise.all(
      items.map((item) => {
        if (typeof item === "string") return item;
        const isVideo = videoQuestion || item.type.startsWith("video/");
        return uploadMediaFile(isVideo ? "videos" : "images", item);
      }),
    );
    next[question.id] = urls;
  }

  return next;
}
