import { notFound, redirect } from "next/navigation";
import { DiagnosisAwaiting } from "@/components/consult/DiagnosisAwaiting";
import { loadConsult } from "@/lib/consult/clinic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Awaiting diagnosis",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ consultId: string }>;
};

export default async function ConsultStatusPage({ params }: PageProps) {
  const { consultId } = await params;

  let consult;
  try {
    consult = await loadConsult(consultId);
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 404;
    if (status === 401) {
      redirect(`/login?next=/consults/${consultId}`);
    }
    notFound();
  }

  return (
    <div className="hero-surface flex flex-1 items-center px-6 pb-20 pt-28">
      <DiagnosisAwaiting initial={consult} />
    </div>
  );
}
