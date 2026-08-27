import type { GiftCardStatus } from "@/lib/gift-card";

/** Badge colors for quickly scanning order status in the admin list/detail views. */
export const STATUS_BADGE_CLASS: Record<GiftCardStatus, string> = {
  waiting_payment: "border-amber-300 bg-amber-50 text-amber-800",
  paid: "border-green-300 bg-green-50 text-green-800",
  delivered: "border-slate-300 bg-slate-50 text-slate-700",
  delivery_failed: "border-red-300 bg-red-50 text-red-800",
  cancelled: "border-slate-300 bg-slate-100 text-slate-500",
  contacted: "border-blue-300 bg-blue-50 text-blue-800",
};
