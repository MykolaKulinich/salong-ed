import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

// A separate root layout (its own <html>/<body>) via the Next.js "multiple
// root layouts" route-group pattern. The public site keeps its own root
// layout under app/(site)/layout.tsx with the marketing Header/Footer —
// deliberately not shared here, since an internal payment-confirmation tool
// has no use for site navigation or the "Boka tid" booking CTA.
export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s | Salong ED Administration",
  },
  // Never indexed, regardless of environment — see AGENTS.md section 18.
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
