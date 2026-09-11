import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { brand } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Log in",
  description: `Sign in to your ${brand.name} account.`,
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "/";

  return (
    <div className="hero-surface flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md animate-fade-up pt-8">
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your email and password.
        </p>
        <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card/80 p-6 backdrop-blur-sm">
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
