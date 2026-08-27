// Vitest-only stand-in for the real "server-only" package, which
// unconditionally throws when imported outside a Next.js build (by design —
// so a client bundle can never pull in server secrets). Aliased in place of
// it in vitest.config.ts so tests can import real server-only-guarded
// modules (e.g. lib/gift-card-workflow.ts) directly, instead of
// reimplementing their logic just to make it testable.
export {};
