import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  persistedOrders: [] as Record<string, unknown>[],
  insertError: null as { code: string } | null,
}));

const sendNewGiftCardOrderNotificationMock = vi.hoisted(() =>
  vi.fn(async () => ({ ok: true as const })),
);

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: () => ({
    from: () => ({
      insert: (input: Record<string, unknown>) => {
        const persistedOrder = {
          id: "6f8c0e2a-4f47-4f67-9e0d-2b4f5e6a7c89",
          ...input,
        };
        state.persistedOrders.push(persistedOrder);

        return {
          select: () => ({
            single: async () => ({
              data: state.insertError ? null : persistedOrder,
              error: state.insertError,
            }),
          }),
        };
      },
    }),
  }),
}));

vi.mock("@/lib/gift-card-notification", () => ({
  NEW_GIFT_CARD_ORDER_NOTIFICATION_COLUMNS: "id, order_reference",
  sendNewGiftCardOrderNotification: sendNewGiftCardOrderNotificationMock,
}));

const { POST } = await import("./route");

const validSubmission = {
  amount: 1500,
  requestedTreatment: "",
  recipientName: "",
  message: "",
  customerName: "Anna Andersson",
  customerEmail: "buyer@example.com",
  customerPhone: "+46701234567",
  deliveryTarget: "customer",
  recipientEmail: "",
  website: "",
};

beforeEach(() => {
  state.persistedOrders = [];
  state.insertError = null;
  sendNewGiftCardOrderNotificationMock.mockReset();
  sendNewGiftCardOrderNotificationMock.mockResolvedValue({ ok: true });
});

async function postSubmission(input: unknown = validSubmission): Promise<Response> {
  return POST(
    new Request("http://localhost/api/presentkort", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
}

describe("POST /api/presentkort", () => {
  it("persists the order before making one internal notification attempt", async () => {
    sendNewGiftCardOrderNotificationMock.mockImplementationOnce(async () => {
      expect(state.persistedOrders).toHaveLength(1);
      return { ok: true as const };
    });

    const response = await postSubmission();

    expect(response.status).toBe(200);
    expect(state.persistedOrders).toHaveLength(1);
    expect(sendNewGiftCardOrderNotificationMock).toHaveBeenCalledTimes(1);
    expect(sendNewGiftCardOrderNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "6f8c0e2a-4f47-4f67-9e0d-2b4f5e6a7c89",
        status: "waiting_payment",
      }),
    );
  });

  it("keeps the successful order response when the notification provider throws", async () => {
    sendNewGiftCardOrderNotificationMock.mockRejectedValueOnce(new Error("provider unavailable"));

    const response = await postSubmission();

    expect(response.status).toBe(200);
    expect(state.persistedOrders).toHaveLength(1);
    expect(sendNewGiftCardOrderNotificationMock).toHaveBeenCalledTimes(1);
  });

  it("does not notify invalid or failed order creations", async () => {
    const invalidResponse = await postSubmission({ ...validSubmission, customerEmail: "not-an-email" });
    expect(invalidResponse.status).toBe(400);
    expect(sendNewGiftCardOrderNotificationMock).not.toHaveBeenCalled();

    state.persistedOrders = [];
    state.insertError = { code: "23503" };
    const failedResponse = await postSubmission();
    expect(failedResponse.status).toBe(500);
    expect(sendNewGiftCardOrderNotificationMock).not.toHaveBeenCalled();
  });
});
