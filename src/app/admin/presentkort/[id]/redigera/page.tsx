import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getGiftCardOrderById } from "@/lib/gift-card-orders";
import EditOrderForm from "./EditOrderForm";

export const metadata: Metadata = {
  title: "Redigera beställning",
};

export default async function EditGiftCardOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getGiftCardOrderById(id);

  if (!order) notFound();

  // Only waiting_payment and paid orders may be edited — cancelled and
  // delivered are read-only in this pass. Reaching this URL any other way
  // (a stale bookmark, a direct visit) just sends Ewelina back to the order.
  if (order.status !== "waiting_payment" && order.status !== "paid") {
    redirect(`/admin/presentkort/${id}`);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-3xl text-foreground">Redigera beställning</h2>
      <p className="mt-2 text-sm text-muted">{order.order_reference}</p>
      <EditOrderForm order={order} />
    </div>
  );
}
