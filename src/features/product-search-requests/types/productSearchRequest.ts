// App-level, source-agnostic, reusable product search definition
// User creates in UI
// Source modules translate this into their own API parameters to use to make a search.

export type ProductCondition = "new" | "used";

export type BuyingOption = "fixed_price" | "auction";

export interface ProductSearchRequest {
  name: string;
  // Required keyword query sent to the source search.
  query: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  buyingOption?: BuyingOption;
}

// A ProductSearchRequest with a stable client-side id for list rendering and edit/delete.
// A durable, DB-assigned id arrives with persistence in Feature 1.4.
export interface SavedProductSearchRequest extends ProductSearchRequest {
  id: string;
}
