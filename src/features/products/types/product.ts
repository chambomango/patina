// Normalized, source-agnostic Product object.
// Every source converts its raw results into this shape before storage, filtering, or UI.

export type ProductSource = "ebay";

export type ReviewState = "new" | "interested" | "rejected";

export interface Product {
  // Origin source; paired with `sourceProductId` as the primary dedup key.
  source: ProductSource;
  // Source's own item ID when available; the source URL is the dedupe fallback.
  sourceProductId?: string;
  sourceUrl: string;
  title: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  condition?: string;
  location?: string;
  // First collection that returned this Product; not reset when the item is seen again.
  discoveredAt: Date;
  // Most recent collection that returned this Product.
  lastSeenAt: Date;
  reviewState: ReviewState;
}
