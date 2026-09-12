import { SimplePage } from "@/components/layout/SimplePage";
import { brand } from "@/lib/design/tokens";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
};

export default function PrivacyPage() {
  return (
    <SimplePage kicker="Legal" title="Privacy policy">
      <p>
        {brand.name} collects the account details, questionnaire answers, and
        photos you submit so we can generate an assessment, request a doctor
        review, and fulfill medicine kits.
      </p>
      <p>
        We do not sell your health information. Photos and consult records are
        used only to provide care, improve clinical quality, and meet legal
        requirements.
      </p>
    </SimplePage>
  );
}
