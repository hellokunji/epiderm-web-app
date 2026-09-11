import { NextResponse } from "next/server";
import { loadQuestionnaire } from "@/lib/consult/clinic";
import { categoryFromPath } from "@/lib/consult/types";

export async function GET(request: Request) {
  const categoryParam = new URL(request.url).searchParams.get("category") ?? "";
  const category = categoryFromPath(categoryParam);
  if (!category) {
    return NextResponse.json(
      { error: "category must be SKIN or HAIR" },
      { status: 400 },
    );
  }

  try {
    const result = await loadQuestionnaire(category);
    return NextResponse.json({
      questionnaire: result.questionnaire,
      source: result.source,
    });
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 502;
    if (status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Unable to load questionnaire" },
      { status: status >= 400 ? status : 502 },
    );
  }
}
