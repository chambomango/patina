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
