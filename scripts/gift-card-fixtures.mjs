/**
 * Developer-only fixture data for visually verifying the gift-card PDF and
 * email — never a real customer order, never read from Supabase.
 */
export const FULL_FIXTURE = {
  brand: "Salong ED",
  title: "Presentkort",
  orderReference: "ED-2026-109180",
  amount: 1500,
  amountLabel: "1 500 kr",
  recipientName: "Anna",
  message: "Grattis på födelsedagen! Hoppas du får en underbar dag.",
  requestedTreatment: "Icoone",
};

export const MINIMAL_FIXTURE = {
  brand: "Salong ED",
  title: "Presentkort",
  orderReference: "ED-2026-109181",
  amount: 1000,
  amountLabel: "1 000 kr",
  recipientName: null,
  message: null,
  requestedTreatment: null,
};
