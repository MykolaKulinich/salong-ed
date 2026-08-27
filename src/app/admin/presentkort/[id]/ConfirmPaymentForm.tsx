"use client";

import { useState, useTransition } from "react";
import { confirmGiftCardPaymentAction } from "../actions";

export default function ConfirmPaymentForm({ orderId }: { orderId: string }) {
  const [step, setStep] = useState<"idle" | "confirming">("idle");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (done) {
    return (
      <p className="mt-8 border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
        Betalningen är bekräftad.
      </p>
    );
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await confirmGiftCardPaymentAction(orderId);
      if (!result.ok) {
        setError(result.error);
        setStep("idle");
        return;
      }
      setDone(true);
    });
  }

  if (step === "idle") {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={() => setStep("confirming")}
          className="min-h-12 w-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-accent-strong sm:w-auto"
        >
          Bekräfta betalning
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
    <div className="mt-8 border border-accent/50 bg-[#f5eee5] p-5">
      <p className="text-sm text-foreground">Har du kontrollerat att betalningen har kommit in?</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={isPending}
          className="min-h-11 border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground disabled:opacity-60"
        >
          Avbryt
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className="min-h-11 bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {isPending ? "Bekräftar…" : "Bekräfta betalning"}
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
