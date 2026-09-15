import { redirect } from "next/navigation";
import { ConsultList } from "@/components/consult/ConsultList";
import { loadConsultList } from "@/lib/consult/clinic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultations",
  robots: { index: false, follow: false },
};

export default async function ConsultsPage() {
  let payload: unknown = { items: [] };
  let loadError: string | null = null;

  try {
    payload = await loadConsultList();
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status: number }).status)
        : 502;
    if (status === 401) {
      redirect("/login?next=/consults");
    }
    loadError = "Could not load consultations. Please try again.";
  }

  return (
    <div className="hero-surface flex flex-1 px-6 pb-20 pt-28">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Consultations
        </p>
        <h1 className="font-display mt-3 text-4xl tracking-tight text-foreground">
          Your consults
        </h1>
        <p className="mt-3 text-muted-foreground">
          Open a consult to check its status or view an available diagnosis.
        </p>
        {loadError ? (
          <p className="mt-6 text-sm text-destructive" role="alert">
            {loadError}
          </p>
        ) : null}
        <div className="mt-10">
          <ConsultList payload={payload} />
        </div>
      </div>
    </div>
  );
}

