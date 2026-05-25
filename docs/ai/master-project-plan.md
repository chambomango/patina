# Patina — Master Project Plan

> Product plan for the source-agnostic Product discovery and triage app.

### 1. Broad Description & Constraints

Patina is a local-first web app for discovering, collecting, filtering, and triaging Products from online sources. It starts with eBay's official Browse API so the first vertical slice can use a stable, sanctioned API before adding more sources.

The app lets the user define reusable Product search requests, run individual or all requests, normalize source results into a shared `Product` shape, store Products in a database, and review them in a responsive dashboard. Later versions add containerized hosting behind a VPN, scheduled collection, Craigslist support, and a possible external Facebook adapter module.

The problem it solves: marketplace-native search is shallow, inconsistent, and noisy. Patina gives the user a personal dashboard for collecting new Products from multiple sources into one normalized review workflow.

#### Constraints

- MVP 1 starts with eBay.
- MVP 1 runs locally through the Next.js development/runtime flow; Docker can wait until MVP 2 unless the implementation roadmap is updated.
- The app uses a single responsive UI that works and looks good on mobile and desktop. Mobile should feel mobile-appropriate; desktop should feel desktop-appropriate.
- MVP 1 UI starts utilitarian with Tailwind, shadcn/ui, and light/dark mode support.
- The user may supply a Claude Design design system or UI design later. Until then, UI should stay utilitarian, Tailwind/shadcn-based, responsive, and easy to replace.
- Remote access, scheduler, auth, notifications, and containerized hosting belong to MVP 2.
- Facebook is deferred. Do not build Facebook collection in MVP 1 or MVP 2. Preserve a source adapter boundary so a Facebook module can be added from another repo later if desired.
- External API/source access must be verified before depending on it.

### 2. Main Features

| Feature                                              | Purpose                                                                                     | Priority     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| Product search requests                              | Let the user define reusable searches for Products                                          | Must-have    |
| eBay Browse API source module                        | Collect the first real Product data through an official API                                 | Must-have    |
| Normalized `Product` model                           | Keep dashboard, DB, filters, and review states source-agnostic                              | Must-have    |
| Product dashboard                                    | Show collected Products in a responsive light/dark UI that feels good on mobile and desktop | Must-have    |
| Run one / run all Product search requests            | Let the user collect Products on demand from individual or all requests                     | Must-have    |
| Product database persistence                         | Save normalized Products and avoid losing collected results                                 | Must-have    |
| Product dedup / seen memory                          | Avoid re-adding the same Product as new every time it is collected                          | Must-have    |
| Review states: `new`, `interested`, `rejected`       | Support triage decisions that persist across collection runs                                | Must-have    |
| Basic dashboard filters and collection history       | Help the user focus on relevant Products and see recent collection results                  | Should-have  |
| Containerized hosted deployment behind VPN/Tailscale | Make the app reachable from personal devices without public exposure                        | Should-have  |
| Scheduled collection                                 | Run saved Product search requests automatically after hosted deployment                     | Should-have  |
| Craigslist source expansion                          | Add another source after the eBay vertical slice is useful                                  | Should-have  |
| Facebook external adapter boundary                   | Leave room for a later external Facebook module without building it now                     | Nice-to-have |
| Notifications                                        | Alert the user when new matching Products are collected                                     | Nice-to-have |
| Relevance scoring / AI-assisted classification       | Improve ranking once rules and manual review workflow are proven                            | Nice-to-have |

### 3. Solution Approach

**Selected Solution Approach:** Simple full-stack web app using Next.js, TypeScript, Tailwind, shadcn/ui, eBay Buy Browse API, SQLite with Drizzle ORM, and source modules that normalize external results into `Product`.

**Why:** Existing marketplace tools do not give the user enough control over reusable searches, cross-source normalization, persistent review states, and personal triage workflow. Starting with eBay's official API gives the project a safer and more reliable first vertical slice than starting with Facebook automation.

### 4. Preliminary Architectural Components

A Next.js app handles the responsive UI, Product search request management, Product collection actions, dashboard display, and review states. Server-side modules inside the Next.js project call external sources, keep credentials server-only, normalize source-specific results into `Product[]`, and write normalized Products to the database. The UI never calls eBay directly and never depends on raw eBay response shapes.

MVP 1 uses eBay's official Browse API first. MVP 2 adds Docker/containerization, Oracle Cloud Always Free VM hosting behind Tailscale/VPN, SQLite file persistence through a Docker volume, and scheduled collection. MVP 3 validates and adds Craigslist if an acceptable source path is available. Facebook is deferred as a possible external module that can plug into the same source adapter boundary later.

**Existing Tool / Integration Check:** eBay Browse API is the first source and must be verified with the user's eBay Developer account and required API access. Craigslist support must be validated later before implementation. Facebook is intentionally deferred because it has no public Marketplace API and would introduce higher account/ToS risk.

| Architectural Piece                | Responsibility                                                        | Notes                                                                                                         |
| ---------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Next.js / TypeScript app           | Full-stack app, UI, server boundary, routes/actions                   | No separate backend app in MVP 1 unless the roadmap is updated                                                |
| Tailwind + shadcn/ui               | Utilitarian responsive light/dark UI foundation                       | Mobile and desktop should each get appropriate layout treatment; a Claude Design system may be supplied later |
| Product dashboard                  | Display collected Products and review actions                         | Uses normalized `Product` records, not source-specific types                                                  |
| Product search request UI          | Create, edit, delete, run one, and run all search requests            | Requests use app-level fields, not raw eBay API params                                                        |
| Next.js server boundary            | Keep source modules, DB access, env vars, and credentials server-side | UI components may call approved server actions/routes but cannot import source/DB internals                   |
| eBay source module                 | Map `ProductSearchRequest` to eBay Browse API calls                   | Uses item summary search first; item details only later if needed                                             |
| Product normalizer                 | Convert source-specific results into `Product[]`                      | `Product` is the internal object used by DB, dashboard, filters, and review states                            |
| Database                           | Store normalized Products, search requests, review states, run data   | SQLite with Drizzle ORM; local file in MVP 1 and Docker volume persistence in MVP 2                           |
| Drizzle ORM / drizzle-kit          | Typed schema, query helpers, and migration workflow                   | Use with SQLite for MVP 1; keeps a future Postgres/Neon migration possible if the app later needs it          |
| Product dedup                      | Avoid duplicate Products across collection runs                       | Use `source` + `sourceProductId` when available; URL fallback if needed                                       |
| Collection/run history             | Track when requests ran, status, and result counts                    | Supports later scheduler and health indicators                                                                |
| Craigslist source module           | Future source module after source path validation                     | Deferred until after eBay/local MVP is useful                                                                 |
| Docker/containerization            | Package the app for hosted self-use                                   | MVP 2 unless the roadmap is updated; SQLite file should persist through a Docker volume                       |
| Oracle Cloud Always Free VM        | Hosted runtime for the private deployment                             | MVP 2 target host unless later implementation reveals a better option                                         |
| Tailscale/VPN remote access        | Private remote access from personal devices                           | MVP 2; no public internet exposure                                                                            |
| Scheduler                          | Run Product search requests automatically                             | MVP 2; off until explicitly configured                                                                        |
| Notifications                      | Optional push alerts for new Products                                 | MVP 2 candidate: ntfy, likely after scheduled collection proves useful                                        |
| Facebook external adapter boundary | Allow future Facebook module from another repo                        | Do not implement Facebook collection in MVP 1 or MVP 2                                                        |

#### UX / UI Direction

MVP 1 uses a utilitarian UI built with Tailwind and shadcn/ui, but utilitarian does not mean careless. The dashboard, Product search request UI, filters, and review actions should work and look good on both mobile and desktop.

Use a single responsive design where practical, but do not force one viewport's layout pattern onto the other. Mobile should use mobile-appropriate patterns such as stacked cards, readable spacing, and touch-friendly actions. Desktop should use available space well with desktop-appropriate density, side-by-side layout, tables, grids, split panes, or denser cards where appropriate.

Light and dark mode should be supported from the beginning through the Tailwind/shadcn theme foundation. A future Claude Design design system may replace or refine the visuals, so MVP components should stay simple, composable, and easy to restyle.

#### Product Data Rules

`Product` is the app's normalized internal item shape. eBay results, Craigslist entries, Facebook listings, manual entries, or future source results must be converted into `Product` before entering storage, filtering, review state, or dashboard UI.

The app stores normalized `Product` records only. It does not store raw source response JSON in MVP 1. If a future source exposes useful fields that the current `Product` shape does not include, add explicit normalized fields going forward. Do not backfill old records unless there is a clear user-facing reason.

This is acceptable because the app is optimized for discovering and triaging new Products, not preserving complete historical source payloads. Older Products may be sold or irrelevant by the time new fields are added.

### 5. Scope

#### MVP 1: Local eBay Product dashboard

- User runs Next.js initialization and Tailwind/shadcn setup commands.
- AI resumes after generated files exist, inspects the generated structure, and defines the `Product` type.
- Local Next.js app with TypeScript, Tailwind, and shadcn/ui.
- Utilitarian Product dashboard using Tailwind/shadcn with light/dark mode support that works and looks good on mobile and desktop.
- Product search request editor.
- Run individual Product search requests.
- Run all Product search requests.
- eBay Browse API module using server-side credentials.
- `ProductSearchRequest` mapped to eBay Browse API parameters.
- eBay results normalized into `Product[]`.
- Normalized Products saved to SQLite through Drizzle ORM.
- Dashboard displays saved Products from the database.
- Review states: `new`, `interested`, `rejected`.
- Dedup by source/source product ID where possible, with URL fallback where needed.
- Basic filters and collection/search history if needed for MVP usability.

#### Out of Scope for MVP 1

- Facebook collection, Playwright automation, session handling, or anti-detection/evasion behavior.
- Craigslist source implementation.
- Docker/containerized runtime unless the implementation roadmap is updated.
- Hosted deployment.
- Tailscale/VPN access.
- Scheduler or background worker.
- Notifications.
- Multi-user auth.
- Public internet exposure.
- Raw source JSON storage.
- Purchase automation, seller messaging, bidding, offers, or checkout.
- Scoring, ML ranking, price-history metrics, or PWA/native app behavior.

#### MVP 2: Containerized hosted app behind VPN

- Docker/containerized runtime.
- Oracle Cloud Always Free VM as the default hosted target.
- Hosted deployment behind Tailscale/VPN with no public internet exposure.
- SQLite database file mounted in a Docker volume.
- Environment variable configuration for hosted use.
- Single-user access protection if needed once remote access is enabled.
- Scheduled Product collection inside the app/container runtime.
- Collection/run health visibility.
- Optional ntfy notifications if scheduled collection proves useful.

#### MVP 3: Craigslist source expansion

- Validate acceptable Craigslist source path before implementing.
- Add Craigslist source module only after validation.
- Normalize Craigslist results into `Product[]`.
- Keep dashboard and DB source-agnostic.

#### Later / Deferred: Facebook external adapter module

- Keep Facebook deferred.
- Preserve a small source adapter boundary so a future Facebook module from another repo can return `Product[]`.
- Do not build Facebook collection in this repo during MVP 1 or MVP 2.
- Do not design a heavy plugin framework before there is a real second or third source need.

### 6. Implementation Plan

| Phase                           | Goal                                                       | Deliverables                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Local app foundation         | Create the generated Next.js/Tailwind/shadcn base          | User-run scaffold/setup commands; AI inspection of generated structure; `Product` type                                                            |
| 2. Product dashboard foundation | Build the local utilitarian dashboard and request UI       | Product dashboard shell, Product cards/list, search request editor, run-one/run-all controls                                                      |
| 3. eBay vertical slice          | Collect real eBay results and normalize them into Products | eBay Browse API server module, `ProductSearchRequest` mapping, Product normalization                                                              |
| 4. Local persistence and triage | Save and review Products locally                           | SQLite + Drizzle layer, Product persistence, dedup, DB-backed dashboard, `new`/`interested`/`rejected` states                                     |
| 5. MVP 1 use and refinement     | Use the local app and adjust Product/request shape         | Feedback-driven improvements, basic filters/history, design-system handoff readiness                                                              |
| 6. MVP 2 hosted/scheduled build | Containerize and run privately online                      | Docker runtime, Oracle Cloud VM, Tailscale deployment, SQLite Docker volume, scheduled collection, health indicators, optional ntfy notifications |
| 7. MVP 3 source expansion       | Add another source without rewriting core                  | Craigslist source validation and adapter if acceptable                                                                                            |
| 8. Later Facebook module option | Preserve future optional FB support                        | Adapter contract review; possible external module integration plan                                                                                |

---
