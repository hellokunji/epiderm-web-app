import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { getSession } from "@/lib/auth/session";
import { brand } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: `${brand.name} — Skin & hair care, doctor-confirmed`,
  description:
    "Submit photos, get an AI-assisted dermatology assessment, unlock full findings, and receive doctor-approved medicine kits.",
};

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <HomeHero isAuthenticated={Boolean(session)} />

      <section
        id="how-it-works"
        className="border-t border-border bg-card px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            From your first photo to a doctor-confirmed kit — one clear path.
          </p>

          <ol className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Share your concern",
                body: "Answer a short questionnaire and upload skin or hair photos and video.",
              },
              {
                step: "02",
                title: "AI + doctor review",
                body: "Our vision model drafts findings; a dermatologist confirms or requests more detail.",
              },
              {
                step: "03",
                title: "Care delivered",
                body: "Unlock your diagnosis, approve your kit, and get medicines fulfilled to your door.",
              },
            ].map((item) => (
              <li key={item.step}>
                <p className="text-sm font-medium tracking-widest text-primary">
                  {item.step}
                </p>
                <h3 className="mt-2 text-lg font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
