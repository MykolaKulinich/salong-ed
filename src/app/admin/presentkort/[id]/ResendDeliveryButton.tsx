"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { resendGiftCardOrderDeliveryAction } from "../actions";

/**
 * "Skicka igen" for an already-delivered order — requires the explicit
 * confirmation step AGENTS.md section 23 asks for, since this intentionally
 * re-sends a gift card that already went out successfully.
 */
export default function ResendDeliveryButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirming">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleResend() {
    setError(null);
    startTransition(async () => {
      const result = await resendGiftCardOrderDeliveryAction(orderId);
      if (!result.ok) {
        setError(result.error);
        setStep("idle");
        return;
      }
      router.refresh();
    });
  }

  if (step === "idle") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setStep("confirming")}
          className="min-h-11 border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground"
        >
          Skicka igen
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm text-accent-strong">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border border-accent/50 bg-[#f5eee5] p-5">
      <p className="text-sm text-foreground">Vill du skicka presentkortet igen?</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={isPending}
          className="min-h-11 w-full border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground disabled:opacity-60 sm:w-auto"
        >
          Avbryt
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={isPending}
          className="min-h-11 w-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-accent-strong disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Skickar…" : "Skicka igen"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-accent-strong">
          {error}
        </p>
      )}
    </div>
  );
}
