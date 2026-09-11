import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { themeInitScript } from "@/lib/design/theme-script";
import { getSession } from "@/lib/auth/session";
import { brand } from "@/lib/design/tokens";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${brand.name} — AI dermatology, doctor-confirmed care`,
    template: `%s · ${brand.name}`,
  },
  description:
    "Tele-dermatology for skin and hair: AI-assisted assessment, doctor review, and medicine kits delivered to your door.",
  openGraph: {
    title: brand.name,
    description:
      "Expert dermatology care, guided by AI and confirmed by doctors.",
    type: "website",
    siteName: brand.name,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders initialUser={session?.user ?? null}>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
