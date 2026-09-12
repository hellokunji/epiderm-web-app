import { SimplePage } from "@/components/layout/SimplePage";
import { brand } from "@/lib/design/tokens";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <SimplePage kicker="Legal" title="Terms & Conditions">
      <p>
        These terms govern your use of {brand.name} for AI-assisted dermatology
        consults, doctor review, and medicine fulfillment. By creating an
        account or starting a questionnaire, you agree to use the service for
        personal care and to provide accurate information.
      </p>
      <p>
        Assessments are decision-support tools and do not replace an in-person
        medical examination. A licensed doctor reviews findings before a
        prescription or kit is issued.
      </p>
    </SimplePage>
  );
}
