// TEMPORARY dev-only preview data (Task 1.2.1a).
// Lets the dashboard render real-looking Products before eBay collection (Feature 1.3)
// and DB persistence (Feature 1.4) exist.

import type { Product } from "@/features/products/types/product";

export const seedProducts: Product[] = [
  {
    source: "ebay",
    sourceProductId: "v1|3041234567|0",
    sourceUrl: "https://www.ebay.com/itm/3041234567",
    title: "Vintage Pentax K1000 35mm Film Camera with 50mm Lens",
    price: 129.99,
    currency: "USD",
    imageUrl: "https://i.ebayimg.com/images/g/PentaxK1000/s-l500.jpg",
    condition: "Used",
    location: "Portland, OR, USA",
    discoveredAt: new Date("2026-05-21T14:30:00Z"),
    lastSeenAt: new Date("2026-05-24T09:15:00Z"),
    reviewState: "new",
  },
  {
    source: "ebay",
    sourceProductId: "v1|3049876543|0",
    sourceUrl: "https://www.ebay.com/itm/3049876543",
    title: "Mechanical Keyboard 60% Hot-Swappable RGB",
    price: 64.5,
    currency: "USD",
    // No imageUrl: card must handle a missing image gracefully.
    condition: "Open box",
    location: "Austin, TX, USA",
    discoveredAt: new Date("2026-05-22T18:00:00Z"),
    lastSeenAt: new Date("2026-05-24T09:15:00Z"),
    reviewState: "interested",
  },
  {
    source: "ebay",
    sourceProductId: "v1|3055551212|0",
    sourceUrl: "https://www.ebay.com/itm/3055551212",
    title: "Mid-Century Modern Leather Lounge Chair",
    // No price/currency: the source listing omitted a fixed price.
    imageUrl: "https://i.ebayimg.com/images/g/LoungeChair/s-l500.jpg",
    condition: "Used",
    location: "Brooklyn, NY, USA",
    discoveredAt: new Date("2026-05-19T11:45:00Z"),
    lastSeenAt: new Date("2026-05-23T20:05:00Z"),
    reviewState: "rejected",
  },
  {
    source: "ebay",
    sourceProductId: "v1|3061122334|0",
    sourceUrl: "https://www.ebay.com/itm/3061122334",
    title:
      "Industrial Articulating Task Lamp, Adjustable Cast-Iron Base, Matte Black Powder-Coat Finish, Reproduction of 1940s Factory Design",
    price: 212.0,
    currency: "USD",
    imageUrl: "https://i.ebayimg.com/images/g/TaskLamp/s-l500.jpg",
    // No condition, no location: optional fields absent.
    discoveredAt: new Date("2026-05-23T08:20:00Z"),
    lastSeenAt: new Date("2026-05-24T09:15:00Z"),
    reviewState: "new",
  },
  {
    source: "ebay",
    // No sourceProductId: dedup falls back to sourceUrl.
    sourceUrl: "https://www.ebay.com/itm/listing-without-stable-id",
    title: "Cast Iron Skillet 12 inch Pre-Seasoned",
    price: 24.95,
    currency: "USD",
    // No imageUrl, no location.
    condition: "New",
    discoveredAt: new Date("2026-05-24T07:00:00Z"),
    lastSeenAt: new Date("2026-05-24T09:15:00Z"),
    reviewState: "new",
  },
];
