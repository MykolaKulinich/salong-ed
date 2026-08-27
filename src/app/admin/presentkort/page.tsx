import type { Metadata } from "next";
import { listGiftCardOrders } from "@/lib/gift-card-orders";
import OrderCard from "./OrderCard";

export const metadata: Metadata = {
  title: "Beställningar",
};

export default async function PresentkortOrdersPage() {
  const orders = await listGiftCardOrders();

  if (orders.length === 0) {
    return <p className="text-muted">Inga beställningar ännu.</p>;
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id}>
          <OrderCard order={order} />
        </li>
      ))}
    </ul>
  );
}
