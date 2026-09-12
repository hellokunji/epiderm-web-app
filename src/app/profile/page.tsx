import { redirect } from "next/navigation";
import { SimplePage } from "@/components/layout/SimplePage";
import { getSession } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/profile");

  return (
    <SimplePage kicker="Account" title="Profile">
      <p className="text-foreground">{session.user.name}</p>
      <p>{session.user.email}</p>
    </SimplePage>
  );
}
