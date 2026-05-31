// Temporary client-side simulated run (Task 1.2.3 placeholder).
// Real server-side execution against the eBay Browse API is wired in Task 1.3.4.
// The runner intentionally returns a "not wired" outcome so the UI exercises its
// pending / running / completed states without faking product results.

export type RunOutcome =
  | { status: "completed-not-wired" }
  | { status: "failed"; message: string };

export async function runProductSearchRequest(): Promise<RunOutcome> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { status: "completed-not-wired" };
}
