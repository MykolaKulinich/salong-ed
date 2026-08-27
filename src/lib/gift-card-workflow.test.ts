import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * A minimal, purpose-built fake of the tiny slice of the Supabase query
 * builder gift-card-workflow.ts actually uses:
 *   .from(t).update(patch).eq(a,b).eq(c,d).select(cols).maybeSingle()
 *   .from(t).update(patch).eq(a,b).eq(c,d)                      (awaited directly)
 *   .from(t).select(cols).eq(a,b).maybeSingle()
 * Real PostgrestFilterBuilder instances are themselves thenable (awaiting
 * one without calling .select()/.maybeSingle() still resolves), so this
 * fake implements `then()` at every step.
 */
type Row = Record<string, unknown>;

class FakeQuery implements PromiseLike<{ data: Row | Row[] | null; error: null }> {
  constructor(
    private rows: Row[],
    private patch: Row | null,
    private filters: [string, unknown][],
    private single: boolean,
  ) {}

  eq(column: string, value: unknown): FakeQuery {
    return new FakeQuery(this.rows, this.patch, [...this.filters, [column, value]], this.single);
  }

  select(): FakeQuery {
    return new FakeQuery(this.rows, this.patch, this.filters, this.single);
  }

  maybeSingle(): FakeQuery {
    return new FakeQuery(this.rows, this.patch, this.filters, true);
  }

  private resolve() {
    const indexes = this.rows
      .map((row, i) => i)
      .filter((i) => this.filters.every(([col, val]) => this.rows[i][col] === val));

    if (this.patch) {
      for (const i of indexes) {
        this.rows[i] = { ...this.rows[i], ...this.patch };
      }
    }

    const matched = indexes.map((i) => this.rows[i]);
    return { data: this.single ? (matched[0] ?? null) : matched, error: null as null };
  }

  then<TResult1 = { data: Row | Row[] | null; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: Row | Row[] | null; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.resolve()).then(onfulfilled, onrejected);
  }
}

function createFakeSupabaseAdmin(rows: Row[]) {
  return {
    from() {
      return {
        update: (patch: Row) => new FakeQuery(rows, patch, [], false),
        select: () => new FakeQuery(rows, null, [], false),
      };
    },
  };
}

const dbState = vi.hoisted(() => ({ rows: [] as Row[] }));
const deliveryState = vi.hoisted(() => ({
  result: { ok: true } as { ok: true } | { ok: false; reason: "missing_recipient_email" | "pdf_generation_failed" | "send_failed" },
}));
const sendGiftCardDeliveryMock = vi.hoisted(() => vi.fn(async () => deliveryState.result));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: () => createFakeSupabaseAdmin(dbState.rows),
}));

vi.mock("@/lib/gift-card-delivery", () => ({
  sendGiftCardDelivery: sendGiftCardDeliveryMock,
}));

const {
  markGiftCardOrderPaid,
  confirmGiftCardPaymentAndDeliver,
  sendGiftCardOrderDelivery,
  retryGiftCardOrderDelivery,
  resendGiftCardOrderDelivery,
} = await import("./gift-card-workflow");

function makeOrder(overrides: Partial<Row> = {}): Row {
  return {
    id: "order-1",
    order_reference: "ED-2026-109180",
    status: "waiting_payment",
    amount: 1500,
    requested_treatment: null,
    recipient_name: null,
    message: null,
    customer_email: "buyer@example.com",
    delivery_target: "customer",
    recipient_email: null,
    paid_at: null,
    delivered_at: null,
    ...overrides,
  };
}

beforeEach(() => {
  dbState.rows = [makeOrder()];
  deliveryState.result = { ok: true };
  sendGiftCardDeliveryMock.mockClear();
});

describe("markGiftCardOrderPaid", () => {
  it("transitions waiting_payment -> paid and sets paid_at", async () => {
    const result = await markGiftCardOrderPaid("order-1");
    expect(result).toMatchObject({ ok: true, status: "paid", orderReference: "ED-2026-109180" });
    expect(dbState.rows[0].status).toBe("paid");
    expect(dbState.rows[0].paid_at).not.toBeNull();
  });
});

describe("confirmGiftCardPaymentAndDeliver", () => {
  it("delivers automatically on successful payment confirmation", async () => {
    const result = await confirmGiftCardPaymentAndDeliver("order-1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.delivery).toMatchObject({ ok: true, status: "delivered" });
    }
    expect(dbState.rows[0].status).toBe("delivered");
    expect(dbState.rows[0].paid_at).not.toBeNull();
    expect(dbState.rows[0].delivered_at).not.toBeNull();
  });

  it("moves to delivery_failed when sending fails, while preserving paid_at", async () => {
    deliveryState.result = { ok: false, reason: "send_failed" };
    const result = await confirmGiftCardPaymentAndDeliver("order-1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.delivery).toMatchObject({ ok: false, status: "delivery_failed" });
    }
    expect(dbState.rows[0].status).toBe("delivery_failed");
    expect(dbState.rows[0].paid_at).not.toBeNull();
    expect(dbState.rows[0].delivered_at).toBeNull();
  });

  it("does not auto-deliver a second time on a duplicate confirmation call", async () => {
    const first = await confirmGiftCardPaymentAndDeliver("order-1");
    const second = await confirmGiftCardPaymentAndDeliver("order-1");

    expect(first.ok).toBe(true);
    expect(second).toEqual({ ok: false, status: "not_waiting_payment" });
    expect(sendGiftCardDeliveryMock).toHaveBeenCalledTimes(1);
  });
});

describe("retryGiftCardOrderDelivery", () => {
  it("retries a delivery_failed order to delivered", async () => {
    dbState.rows = [makeOrder({ status: "delivery_failed", paid_at: "2026-01-01T00:00:00.000Z" })];
    const result = await retryGiftCardOrderDelivery("order-1");
    expect(result).toMatchObject({ ok: true, status: "delivered" });
    expect(dbState.rows[0].status).toBe("delivered");
    expect(dbState.rows[0].paid_at).toBe("2026-01-01T00:00:00.000Z");
  });

  it("leaves status as delivery_failed, delivered_at null, when the retry itself fails", async () => {
    dbState.rows = [makeOrder({ status: "delivery_failed", paid_at: "2026-01-01T00:00:00.000Z" })];
    deliveryState.result = { ok: false, reason: "send_failed" };
    const result = await retryGiftCardOrderDelivery("order-1");
    expect(result).toMatchObject({ ok: false, status: "delivery_failed" });
    expect(dbState.rows[0].status).toBe("delivery_failed");
    expect(dbState.rows[0].delivered_at).toBeNull();
  });
});

describe("sendGiftCardOrderDelivery (paid recovery-send)", () => {
  it("delivers a paid order whose automatic delivery never ran", async () => {
    dbState.rows = [makeOrder({ status: "paid", paid_at: "2026-01-01T00:00:00.000Z" })];
    const result = await sendGiftCardOrderDelivery("order-1");
    expect(result).toMatchObject({ ok: true, status: "delivered" });
  });
});

describe("cancelled orders", () => {
  it("can never be delivered via any delivery path", async () => {
    dbState.rows = [makeOrder({ status: "cancelled" })];

    const viaSend = await sendGiftCardOrderDelivery("order-1");
    const viaRetry = await retryGiftCardOrderDelivery("order-1");
    const viaResend = await resendGiftCardOrderDelivery("order-1");

    expect(viaSend).toEqual({ ok: false, status: "not_eligible" });
    expect(viaRetry).toEqual({ ok: false, status: "not_eligible" });
    expect(viaResend).toEqual({ ok: false, status: "not_eligible" });
    expect(dbState.rows[0].status).toBe("cancelled");
    expect(sendGiftCardDeliveryMock).not.toHaveBeenCalled();
  });
});

describe("resendGiftCardOrderDelivery", () => {
  it("resends without creating a new order or changing order_reference/paid_at, refreshing delivered_at", async () => {
    dbState.rows = [
      makeOrder({
        status: "delivered",
        paid_at: "2026-01-01T00:00:00.000Z",
        delivered_at: "2026-01-01T00:05:00.000Z",
      }),
    ];

    const result = await resendGiftCardOrderDelivery("order-1");

    expect(result).toMatchObject({ ok: true, status: "delivered", orderReference: "ED-2026-109180" });
    expect(dbState.rows).toHaveLength(1);
    expect(dbState.rows[0].id).toBe("order-1");
    expect(dbState.rows[0].order_reference).toBe("ED-2026-109180");
    expect(dbState.rows[0].paid_at).toBe("2026-01-01T00:00:00.000Z");
    expect(dbState.rows[0].delivered_at).not.toBe("2026-01-01T00:05:00.000Z");
  });
});
