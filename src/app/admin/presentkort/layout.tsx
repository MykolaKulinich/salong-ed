import type { ReactNode } from "react";
import { requireAdminUser } from "@/lib/admin-auth";
import { signOutAction } from "@/app/admin/actions";

export default async function PresentkortAdminLayout({ children }: { children: ReactNode }) {
  // Authoritative server-side gate for this entire subtree. Re-checked again
  // by every data-access call in lib/gift-card-orders.ts and by the payment
  // Server Action itself — this layout check alone is not relied upon.
  await requireAdminUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-5 sm:gap-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Beställningar</p>
            <h1 className="mt-1 font-serif text-2xl text-foreground sm:text-3xl">Presentkort</h1>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="min-h-10 shrink-0 border border-border px-3 text-sm text-foreground transition-colors hover:border-foreground sm:px-4"
            >
              Logga ut
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
