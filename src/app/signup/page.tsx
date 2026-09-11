import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { brand } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Sign up",
  description: `Create your ${brand.name} account to start a dermatology consult.`,
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="hero-surface flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md animate-fade-up pt-8">
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start with email and password — then share your skin or hair concern.
        </p>
        <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card/80 p-6 backdrop-blur-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
