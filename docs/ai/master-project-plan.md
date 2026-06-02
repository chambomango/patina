# Patina (Dashboard) — Master Project Plan

> Product plan for the Patina dashboard/control-plane repo. This is the dashboard's master plan; the collector is a separate repo with its own master plan.

## 0. How to Read This Plan

`patina` is the dashboard/control-plane Next.js app. It owns the UI, the shared database schema, and all database migrations. It does **not** run collection.

Collection is performed by a **separate collector service** that reads work from the same Neon Postgres database and writes normalized Product results back. **The dashboard is intentionally source-agnostic: it does not know which sources exist, and it does not know how the collector obtains Products.** The dashboard only knows the database contract — it creates run requests, reads run status, reads `Product` records, and writes review states. How those Products come to exist is outside the dashboard's knowledge and outside this plan.

This plan defines the dashboard's product scope, architecture, capability boundaries, and the database contract it owns. It does **not** define build order; the dashboard implementation roadmap sequences the work.

If the dashboard roadmap conflicts with this plan on scope, architecture, or the database contract, the roadmap is wrong: pause and reconcile against this plan first.

---

### 1. Broad Description & Constraints

Patina is a personal dashboard for discovering, filtering, and triaging Products collected from online sources into one normalized review workflow. The dashboard lets the user define reusable Product search requests, request collection runs, view run status and history, filter collected Products, and triage them (`new` / `interested` / `rejected`).

The dashboard does not collect anything itself. It requests work by creating `CollectionRun` records in the shared database and displays the Products and run results that the collector writes back. The value the dashboard provides is control and triage: reusable searches, cross-source normalization at the data level, persistent review states, and a clean personal review workflow — without coupling the UI to any source or collection method.

#### Source-agnostic boundary (core to this product)

- `Product` carries an opaque `source` string. The dashboard stores and can filter by it, but it **does not enumerate, hardcode, or special-case specific sources.** Which sources are valid is determined outside the dashboard.
- The dashboard contains no source adapters, no collection logic, no browser automation, no credentials for any source, and no knowledge of collection methods.
- The collector is treated as an opaque fulfiller of `CollectionRun` requests. The dashboard knows a collector exists and consumes runs; it knows nothing about how the collector works.

#### Constraints

- `patina` is the dashboard for displaying products and creating/editing search requests. So no collection execution, source adapters, or source credentials belong here.
- Neon Postgres is the shared, always-available database.
- **`patina` owns the database schema and all migrations (DDL).** The collector consumes the schema and never alters it.
- The dashboard requests work by creating `CollectionRun` records; it never executes collection.
- If the collector is offline, requested runs remain `requested` and the dashboard shows that the run is waiting for the collector.
- Single responsive UI that works and looks good on mobile and desktop; mobile feels mobile-appropriate, desktop feels desktop-appropriate.
- UI starts utilitarian with Tailwind, shadcn/ui, and light/dark mode. A Claude Design system may replace visuals later, so components stay simple and easy to restyle.
- Remote dashboard access, auth/private access, notifications, and hosted deployment are later capabilities.

### 2. Main Features

| Feature                                        | Purpose                                                                                                 | Priority             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| Product search requests                        | Let the user define reusable searches for Products                                                      | Must-have            |
| Normalized `Product` model                     | Keep dashboard, DB, filters, and review states source-agnostic                                          | Must-have            |
| Product dashboard                              | Show collected Products in a responsive light/dark UI that feels good on mobile and desktop             | Must-have            |
| Neon Postgres persistence                      | Keep Products, search requests, review states, and run records in an always-available shared DB         | Must-have            |
| Run-now collection requests                    | Let the dashboard request collection work without executing collection itself                           | Must-have            |
| Collection run status/history                  | Show requested/running/completed/failed runs and safe error summaries                                   | Must-have            |
| Product dedup / seen memory                    | Avoid re-adding the same Product as new (enforced by schema/contract; the collector upserts against it) | Must-have            |
| Review states: `new`, `interested`, `rejected` | Support triage decisions that persist across collection runs                                            | Must-have            |
| Basic dashboard filters                        | Help the user focus by review state, source value, and search request                                   | Should-have          |
| Schedule settings (forward-compat)             | Let the user configure recurring runs the collector will act on                                         | Should-have (later)  |
| Hosted/remote dashboard access                 | Make the dashboard reachable from personal devices after the local workflow is useful                   | Should-have (later)  |
| Notifications                                  | Alert the user when new matching Products are collected                                                 | Nice-to-have (later) |
| Relevance scoring / AI-assisted classification | Improve ranking once manual review workflow is proven                                                   | Nice-to-have (later) |

### 3. Solution Approach

**Selected Solution Approach:** A dashboard/control-plane web app using Next.js, TypeScript, Tailwind, shadcn/ui, Neon Postgres, and Drizzle ORM, with database-backed run requests. The dashboard reads and writes Neon and owns the schema. A separate collector service (its own repo) reads `CollectionRun` requests and writes Products back; the dashboard does not know or care how.

**Why:** Existing marketplace tools do not give the user enough control over reusable searches, normalization, persistent review states, and triage. Splitting the dashboard from collection keeps the UI stable and source-agnostic, and keeps the database available even when the collector's machine is off.

### 4. Architectural Components

The dashboard handles the responsive UI, search request management, run-now request creation, dashboard display, review states, filters, and run history. Server-side dashboard code reads/writes Neon and owns the schema, but never performs collection.

| Architectural Piece            | Responsibility                                                                           | Notes                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Next.js / TypeScript dashboard | Dashboard/control plane, routes/actions, UI, DB-backed app state                         | No collection logic, source adapters, or source credentials               |
| Database schema + migrations   | Single owner of all Drizzle schema and drizzle-kit migrations                            | Collector consumes this schema; only the dashboard runs DDL               |
| Tailwind + shadcn/ui           | Utilitarian responsive light/dark UI foundation                                          | Claude Design system may be supplied later                                |
| Product dashboard              | Display collected Products and review actions                                            | Uses normalized `Product` records; never source-specific types            |
| Product search request UI      | Create, edit, delete, run one, run all                                                   | Requests use app-level fields and an opaque `source` value                |
| Run-now request creation       | Insert `CollectionRun` records (`requested`, `manual`)                                   | Does not execute collection                                               |
| Neon Postgres database         | Store Products, search requests, review states, run records, and schedule fields (later) | Shared with the collector                                                 |
| Collector service              | Opaque fulfiller: consumes `CollectionRun` requests, writes Products                     | Separate repo; the dashboard knows nothing about its internals or sources |

#### UX / UI Direction

Utilitarian with Tailwind and shadcn/ui, but not careless. Dashboard, request UI, filters, run status, and review actions should work and look good on mobile and desktop. Single responsive design where practical, without forcing one viewport's pattern onto the other: mobile uses stacked cards, readable spacing, touch-friendly actions; desktop uses density, side-by-side layout, tables/grids, or denser cards. Light/dark from the start. A future Claude Design system may replace visuals, so components stay simple and restyleable.

#### Product Data Rules

`Product` is the dashboard's normalized internal item shape. Every collected item is a `Product` by the time the dashboard sees it; the dashboard never handles raw source payloads. The system stores normalized `Product` records only — no raw source JSON. If a future source needs a field the current shape lacks, add an explicit normalized field going forward; do not backfill unless there is a clear user-facing reason.

---

## 5. Database Contract (Dashboard-Owned)

The dashboard owns the Drizzle schema and all migrations. This section is the authoritative shape; the collector consumes it. Field names are the contract; exact column types are decided in the dashboard schema task but must satisfy the rules here. The schema is fully source-agnostic.

### 5.1 `product_search_requests`

A reusable, user-defined search.

- **Written by:** dashboard (create/edit/delete via UI).
- **Read by:** dashboard (editor, run modal, lists); collector (to interpret a claimed run).
- **Fields (MVP):** `id`, `name`, `query`, `minPrice` (nullable), `maxPrice` (nullable), `condition` (nullable), `buyingOption` (nullable), `source` (opaque source identifier; the dashboard does not enumerate valid values), `active` (boolean), `createdAt`, `updatedAt`.
- **Forward-compat (built later):** recurring-schedule fields live **here**: `scheduleEnabled`, `intervalMinutes` or `cron`, `lastRunAt`, `nextRunAt`. Not built now; documented so the later additive migration is clean.

### 5.2 `collection_runs`

One unit of collection work. The dashboard↔collector coordination mechanism.

- **Written by:** dashboard inserts `{ status: 'requested', trigger: 'manual', productSearchRequestId }`. The collector updates the row through its lifecycle (the dashboard does not need to know how).
- **Read by:** both — dashboard shows status/history; collector polls for `requested` rows.
- **Fields (MVP):** `id`, `productSearchRequestId` (FK), `status` (`requested` | `running` | `completed` | `failed`; `cancelled` may be added later), `trigger` (`manual` for dashboard-created runs; a future scheduler may insert other values), `createdAt`, `startedAt` (nullable), `finishedAt` (nullable), `claimedAt` (nullable; used by the collector to claim runs and recover crashed ones), `insertedCount` (nullable), `updatedCount` (nullable), `errorSummary` (nullable, safe text — never secrets or raw provider internals).
- **Rule:** `collection_runs` carries **no recurring-schedule fields**. A run is a single execution. This keeps the future scheduler additive.
- **Dashboard's view of the lifecycle:** the dashboard creates `requested` runs and reads status. Transitions to `running`/`completed`/`failed`, the `claimedAt`/counts, and the Products themselves are produced by the collector; how is outside the dashboard's concern.

### 5.3 `products`

A normalized, deduplicated item.

- **Written by:** the collector (all fields except review state). The dashboard writes `reviewState` only (user triage).
- **Read by:** dashboard (display, filters).
- **Fields (MVP):** `id`, `source` (opaque), `sourceProductId` (nullable), `sourceUrl`, `title`, `price` (nullable), `currency` (nullable), `imageUrl` (nullable), `condition` (nullable), `location` (nullable), `reviewState` (`new` | `interested` | `rejected`, default `new`), `discoveredAt`, `lastSeenAt`. Optionally a link to the originating request for filtering.
- **Dedup key:** unique on (`source`, `sourceProductId`) when present; fall back to unique on (`source`, `sourceUrl`).
- **Review-state ownership:** `reviewState` is written only by the dashboard. The contract requires that re-collecting a Product preserve the existing `reviewState` and `discoveredAt` (the collector upserts accordingly). The dashboard relies on this: a user's triage decision is never reset by a later run.

### 5.4 Ownership and access summary

- The dashboard owns all DDL/migrations. The collector never alters the schema.
- The dashboard writes: `product_search_requests` (CRUD), `collection_runs` (insert `requested`/`manual`), `products.reviewState`.
- The dashboard reads: everything, for display.
- The collector (opaque to the dashboard) writes run lifecycle fields and Products. The dashboard does not implement or describe that behavior.

---

## 6. Scope (Dashboard Capability Boundaries)

Scope is capability milestones, not build order. The dashboard roadmap sequences tasks.

### Local working dashboard (first usable milestone)

- Next.js/Tailwind/shadcn foundation; normalized `Product`/`ProductSearchRequest` types; utilitarian responsive shell, request editor, run modal, Product card/list (done).
- Drizzle + Neon configured; schema for `product_search_requests`, `collection_runs`, `products` per §5.
- Product search requests persisted in Neon.
- `Run now` / `Run all` create `CollectionRun` records (`requested`, `manual`); they do not execute collection.
- Dashboard shows requested/running/completed/failed status from Neon, including a "waiting for collector" state.
- Dashboard shows saved Products from Neon; review states `new`/`interested`/`rejected` persist.
- Basic filters and run history as needed.

### Out of scope for the dashboard

- Any collection logic, source adapter, or source credential.
- Any knowledge of specific sources or collection methods.
- The scheduler process (schedule fields are forward-compat schema only).
- Hosted deployment, remote access, auth, notifications.
- Raw source JSON storage; purchase automation, messaging, bidding, offers, checkout; scoring/ML/price history; PWA/native behavior.

### Later

- Schedule settings UI writing the §5.1 schedule fields.
- Hosted/remote dashboard access (target chosen later; Neon stays shared; add auth appropriate to the target).
- Optional notifications.

---

## 7. Sequencing Pointer

This plan does not order tasks. For execution order, use the Patina dashboard implementation roadmap. If implementation reveals a conflict with the §5 contract, stop and reconcile this plan first, because the collector depends on the same contract.
