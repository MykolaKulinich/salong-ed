"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { DeliveryActionResult } from "../actions";

/**
 * Single-click delivery action shared by the "Skicka presentkort" (paid
 * recovery-send) and "Försök skicka igen" (delivery_failed retry) buttons —
 * both are direct, undialogued recovery actions per AGENTS.md sections
 * 21–22. Compare with ResendDeliveryButton, which requires the explicit
 * confirmation step section 23 asks for.
 */
export default function SendDeliveryButton({
  orderId,
  label,
  pendingLabel,
  action,
}: {
  orderId: string;
  label: string;
  pendingLabel: string;
  action: (orderId: string) => Promise<DeliveryActionResult>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await action(orderId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="min-h-12 w-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-accent-strong disabled:opacity-60 sm:w-auto"
      >
        {isPending ? pendingLabel : label}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-accent-strong">
          {error}
        </p>
      )}
    </div>
  );
}
