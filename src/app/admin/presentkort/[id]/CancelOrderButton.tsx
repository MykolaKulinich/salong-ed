"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cancelGiftCardOrderAction } from "../actions";

export default function CancelOrderButton({
  orderId,
  orderReference,
}: {
  orderId: string;
  orderReference: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirming">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelGiftCardOrderAction(orderId);
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
          className="min-h-11 border border-red-300 px-5 text-sm text-red-700 transition-colors hover:border-red-500 hover:bg-red-50"
        >
          Avbryt beställning
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
    <div className="border border-red-300 bg-red-50 p-5">
      <p className="text-sm text-foreground">
        Är du säker på att du vill avbryta beställningen {orderReference}?
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={isPending}
          className="min-h-11 border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground disabled:opacity-60"
        >
          Behåll beställningen
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="min-h-11 bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? "Avbryter…" : "Avbryt beställningen"}
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
