import { redirect } from "next/navigation";
import { SimplePage } from "@/components/layout/SimplePage";
import { getSession } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Address",
  robots: { index: false, follow: false },
};

export default async function AddressPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/address");

  return (
    <SimplePage kicker="Account" title="Address">
      <p>No saved addresses yet. Delivery details will appear here when kits are ready to ship.</p>
    </SimplePage>
  );
}
