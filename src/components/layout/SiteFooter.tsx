import Link from "next/link";
import { brand } from "@/lib/design/tokens";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-tight text-foreground">
            {brand.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI-assisted dermatology, confirmed by doctors, with care delivered
            to your door.
          </p>
        </div>

        <nav aria-label="Consult" className="text-sm">
          <p className="font-medium text-foreground">Consult</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/consult/skin" className="text-muted-foreground hover:text-primary">
                Skin consultation
              </Link>
            </li>
            <li>
              <Link href="/consult/hair" className="text-muted-foreground hover:text-primary">
                Hair consultation
              </Link>
            </li>
            <li>
              <Link href="/consults" className="text-muted-foreground hover:text-primary">
                All consultations
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company" className="text-sm">
          <p className="font-medium text-foreground">Company</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/#how-it-works" className="text-muted-foreground hover:text-primary">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy policy
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </p>
    </footer>
  );
}
