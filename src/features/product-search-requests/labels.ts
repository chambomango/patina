// App-facing labels for request fields, shared by the editor form and the request cards.
// These are intentionally friendly app terms, not raw eBay API parameter values; the eBay
// module maps them to eBay parameters later (Feature 1.3).

import type {
  BuyingOption,
  ProductCondition,
} from "@/features/product-search-requests/types/productSearchRequest";

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "New",
  used: "Used",
};

export const BUYING_OPTION_LABELS: Record<BuyingOption, string> = {
  fixed_price: "Buy It Now",
  auction: "Auction",
};
