// Format an amount as currency. Falls back to a plain $-prefixed value when the
// currency code is missing or not recognized by Intl.NumberFormat.

export function formatPrice(amount: number, currency: string | undefined): string {
  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(amount);
    } catch {
      // Fall through to plain formatting when the currency code isn't recognized.
    }
  }
  return `$${amount.toFixed(2)}`;
}
