import { notFound, redirect } from "next/navigation";
import { QuestionnaireWizard } from "@/components/consult/QuestionnaireWizard";
import { loadQuestionnaire } from "@/lib/consult/clinic";
import { categoryFromPath } from "@/lib/consult/types";
import { brand } from "@/lib/design/tokens";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const parsed = categoryFromPath(category);
  const label = parsed === "HAIR" ? "Hair" : "Skin";
  return {
    title: `${label} questionnaire`,
    description: `Start your ${brand.name} ${label.toLowerCase()} consult.`,
    robots: { index: false, follow: false },
  };
}

export default async function QuestionnairePage({ params }: PageProps) {
  const { category: raw } = await params;
  const category = categoryFromPath(raw);
  if (!category) notFound();

  let questionnaire;
  try {
    ({ questionnaire } = await loadQuestionnaire(category));
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 500;
    if (status === 401) {
      redirect(`/login?next=/consult/${raw}`);
    }
    throw error;
  }

  return (
    <div className="hero-surface flex flex-1 px-6 pb-20 pt-28">
      <QuestionnaireWizard schema={questionnaire} />
    </div>
  );
}
