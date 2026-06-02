# Patina — Project Implementation Roadmap

> Implementation roadmap for the Patina dashboard/control-plane repo.

## How to Use This Roadmap

Use this roadmap for writing code in the specified tasks in order and light tracking of the code written. Figure out what to code from what is written for each task and examine the broader context from the documentation and linked rules/project files.

The Master Project Plan defines what the product is. This roadmap defines the build sequence for turning the Patina dashboard repo into working software.

If you have to update this roadmap, assume that another AI coding agent will execute it later without access to the planning conversation. Preserve execution-critical decisions directly in the roadmap.

### Source Documents

Use these documents together:

| Source Document | Purpose |
| --------------- | ------- |
| `./master-project-plan.md` | Big picture project plan. Scoped and goes over architecture and MVPs in more detail |
| `../../.claude/rules/coding-principles-rules-and-workflow.md` | Principles, rules, and workflow to abide by |
| `./project-implementation-roadmap.md` | Implementation guide for project, what code to write, tech stack to implement, tasks to execute |

If this roadmap conflicts with the Master Project Plan, pause and call out the conflict, then ask how to move forward and whether the plan should change.

If this roadmap appears to conflict with the coding rules, follow the coding rules for implementation behavior and update this roadmap if the project-specific plan is wrong.

### Architecture Pivot Note

After Feature 1.2, the project changed from a single Next.js app that directly collected results from a source into a split architecture:

- `patina` remains the dashboard/control-plane UI and is source-agnostic.
- `patina-collector` will be a separate local service that executes source collection. The dashboard knows nothing about its sources or methods.
- Neon Postgres replaces SQLite as the shared always-available database.
- `Run now` creates database-backed `CollectionRun` requests instead of directly executing source collection in the dashboard app.
- The dashboard no longer contains any source-specific collection path.

Completed UI foundation work from Feature 1.1 and Feature 1.2 is preserved. The unstarted in-dashboard collection path has been removed from the active Patina dashboard roadmap.

### How to Implement This Roadmap

#### Implementing Tasks Rules

- Work on the active assigned task(s) I ask you to and complete only the work needed for the task(s) outcome; no scope creep. Do not add work belonging to later Tasks, Features, or Epics.
- Follow coding rules and principles defined in `../../.claude/rules/coding-principles-rules-and-workflow.md`.
- If you are considering how to code a task and realize there is ambiguity in implementation that would affect fundamentally how the project is written or expanded upon in the future, pause and we will address it before moving forward.
- Update task status after each completed Task.
- If implementation reveals an architecture issue, stop and ask how to move forward and we will address this roadmap before coding further.
- If you're in agent mode and I ask you to make a plan for a task before coding then create the plan file at `../implementation-plans`.
  - plans should be brief and should not become a second roadmap. Each one should include:
    1. **Plain-English summary** — what you will code
    2. **Files to add or modify** — for each file: action, create / modify / delete

#### I will run certain commands rule

For commands that scaffold, initialize, install, migrate, or generate files, the coding agent should not run them automatically unless explicitly told to. Instead I, the user, will run them.

Examples include:

- `npx create-next-app`
- `npx shadcn@latest init`
- `npx shadcn@latest add ...`
- package installation commands
- database migration/init commands
- Docker initialization/build commands
- code generators

When one of these commands is needed:

1. Stop and provide the exact command for the user to run.
2. Explain briefly why the command is needed.
3. Wait for the user to run it and tell you to continue.

### Task Detail Levels

If you are modifying/updating a task:

- Current Task: include enough detail to implement and verify the work.
- Current Feature: include clear sequencing, dependencies, and done checks.
- Current Epic: include enough detail to guide near-term implementation.
- Later Epics: keep details lighter until closer to implementation.

---

## Technology Deep Dive

Link to architecture of Master Project Plan: `./master-project-plan.md` → `### 4. Preliminary Architectural Components`

- **Patina dashboard stack**: Next.js + TypeScript + Tailwind + shadcn/ui + Drizzle ORM + Neon Postgres + drizzle-kit.
- **Collector stack**: Separate TypeScript/Node project, Drizzle ORM + Neon Postgres, source adapters, polling/claiming `CollectionRun` records, Product upsert path. Collector work lives outside this Patina dashboard repo.
- **UX / UI direction**: Use Tailwind + shadcn/ui with light/dark mode. Start utilitarian, but make the UI intentionally responsive: mobile should use mobile-appropriate cards/actions and desktop should use desktop-appropriate density, spacing, and layout. Do not force one viewport's layout pattern onto the other.
- **Patina dashboard file/folder structure**:

```txt
src/
  app/
    api/
    (dashboard)/
  features/
    products/
      components/
      server/
      types/
    product-search-requests/
      components/
      server/
      types/
    collection-runs/
      components/
      server/
      types/
  lib/
    db/
    env/
    filters/
    formatting/
```

- **Do not add this to Patina**:

```txt
src/features/sources/
  <any-source>/
```

Source execution modules of any kind belong in `patina-collector`, not in the dashboard repo. The dashboard never names or special-cases specific sources.

- **Formatter / linter**: Prettier formatting on save (user will set up in VSCode).
- **Test framework**: Add Vitest for pure TypeScript modules when Product filters, dedup helpers, or run-status helpers become important enough to protect. React Testing Library can be added later for critical UI behavior. Do not add browser E2E tests in MVP 1.
- **Git commit message style**: User handles git; AI will not do git commits or pushes unless explicitly told.
- **Environment strategy**: MVP 1 runs Patina locally while connecting to Neon Postgres. Neon connection strings and secrets live in ignored local environment files. Hosted env configuration belongs later.
- **Data flow**: User creates/edits Product search requests in Patina → Patina writes them to Neon. User clicks `Run now` or `Run all` → Patina creates `CollectionRun` records in Neon with status `requested`. Collector later polls Neon, claims requested runs, executes source adapters, writes normalized Products, and updates run status. Patina reads Products, requests, and run status from Neon.
- **State management**: Use server data for persisted Products, search requests, and collection runs; local component state for forms and transient UI; URL state for dashboard filters where useful. Do not add a global client store unless the roadmap is updated.
- **External integrations**: None inside the Patina dashboard. The dashboard is source-agnostic and has no knowledge of which sources exist or how Products are collected; all source access lives in `patina-collector`.
- **Testing strategy**: Prioritize pure unit tests for Product filters, Product dedup helpers, CollectionRun status helpers, and Product search request validation. Do not depend on live external source APIs in automated tests.
- **Security / privacy rules**: Do not commit Neon connection strings, API tokens, notification topics, app passwords, or database exports containing real Product history. Keep DB credentials server-side only. Do not expose hosted dashboard access publicly without an explicit hosting/auth decision.
- **Deferred architecture**: Public multi-user auth, managed queues, managed secret stores, Docker in MVP 1, scheduler in Patina, any source adapter or source collection logic in Patina, WebSockets, PWA/native app, ML/scoring, price history, purchase automation, seller messaging, and any browser automation (all collection lives in `patina-collector`).

---

## Roadmap

General overview of the Epics and their statuses.

| Epic ID | Epic / MVP | Goal | Status |
| ------- | ---------- | ---- | ------ |
| Epic 1 | MVP 1: Patina Dashboard + Neon Control Plane | Preserve completed dashboard UI, move dashboard data to Neon, create run-now CollectionRun requests, and triage Products from the shared DB | In Progress |
| Epic 2 | MVP 1.5: Collector Integration Contract | Coordinate with the separate collector through shared DB records without putting source execution in Patina | Later |
| Epic 3 | MVP 2: Hosted/Remote Dashboard Access | Make Patina reachable from personal devices after the local Neon-backed workflow is useful | Later |
| Epic 4 | Later: Additional Source Adapter Support | Keep dashboard source-agnostic while source adapters live in `patina-collector` | Deferred |

---

## Epic 1 — MVP 1: Patina Dashboard + Neon Control Plane

**Epic Goal**: Build and preserve the local Next.js dashboard UI, move core app data to Neon Postgres, make `Run now` create database-backed collection requests for the collector, and let the user triage saved Products in a utilitarian responsive dashboard.

**Done when**:

- [x] User has run the Next.js initialization and Tailwind/shadcn setup commands.
- [x] AI has inspected the generated app structure before editing.
- [x] `Product` and `ProductSearchRequest` types exist and are source-agnostic.
- [x] Dashboard shell, Product search request editor, run modal, and Product card/list UI exist.
- [ ] Neon Postgres and Drizzle are configured.
- [ ] Product search requests are persisted in Neon.
- [ ] Product, ProductSearchRequest, and CollectionRun tables exist.
- [ ] `Run now` creates `CollectionRun` records with status `requested`.
- [ ] `Run all` creates `CollectionRun` records for the selected/all Product search requests.
- [ ] Dashboard displays saved Products from Neon.
- [ ] User can mark Products as `new`, `interested`, or `rejected`.
- [ ] Basic dashboard filters and collection history exist if needed for MVP usability.
- [ ] No source adapters, source collection logic, browser automation, Docker, scheduler, hosted deployment, notifications, or auth are added unless the roadmap is updated.

---

### Feature 1.1 — User-Run App Setup and Product Foundation

#### Overview

**Goal**: Let the user create the generated Next.js/Tailwind/shadcn base, then have AI inspect the generated structure and define the core Product types without running generator commands itself.

**Status**: DONE

**Done when**:

- [x] User has run the scaffold/setup commands.
- [x] AI has inspected generated files before editing.
- [x] Product-related feature folders/types are placed according to the generated app structure.
- [x] `Product` is defined as the app's normalized internal object.
- [x] `ProductSearchRequest` is defined as the app-level request shape used by UI and source modules.

**Dependencies**:

- None.

---

#### Task 1.1.1 — User runs Next.js initialization and Tailwind/shadcn setup commands

**Outcome**: The user creates the generated application foundation that AI will inspect and build on.

**Status**: DONE

**Done when**:

- [x] AI provides the exact Next.js initialization command for the user to run.
- [x] AI provides the exact Tailwind/shadcn setup commands needed for the chosen Next.js setup, if they are not included already.
- [x] User confirms the commands completed.
- [x] Generated project files exist before AI edits application code.
- [x] AI does not run scaffold, install, or generator commands unless explicitly told.

**Likely areas**:

- Project root
- `package.json`
- `src/app/`
- `components.json`
- Tailwind/shadcn generated files

**Notes**:

- Preserve this task wording because it carries execution instructions: the user runs the generated setup commands, not AI.
- Do not add Product logic, DB logic, Docker, scheduler, source adapters, or hosted deployment in this Task.
- After the user reports completion, AI should inspect the generated structure before making edits.

---

#### Task 1.1.2 — AI resumes, inspects generated structure, and defines Product type

**Outcome**: AI confirms the generated app shape and adds the source-agnostic Product type that all sources, dashboard UI, DB, filters, and review states will use.

**Status**: DONE

**Done when**:

- [x] AI inspects generated app files and adapts paths to the actual structure.
- [x] `Product` type exists.
- [x] `ProductSearchRequest` type exists.
- [x] `Product` includes source identity, source Product ID when available, source URL, title, price/currency, image, condition, location, timestamps, and review state where appropriate.
- [x] `ProductSearchRequest` includes initial search controls such as name, query, min price, max price, condition, and buying option.
- [x] UI-facing types do not import raw external source response types.

**Likely areas**:

- `src/features/products/types/`
- `src/features/product-search-requests/types/`
- Actual generated app folders from Task 1.1.1

**Notes**:

- Store normalized Products only; do not plan for raw source JSON storage.
- ProductSearchRequest should remain source-agnostic enough that the collector can interpret it for each supported source.
- If the generated app structure differs from this roadmap, adapt to the generated structure and update the roadmap only if the difference affects architecture or future work.

---

### Feature 1.2 — Utilitarian Product Dashboard and Product Search Request UI

#### Overview

**Goal**: Build the first local UI for managing Product search requests, requesting one or all runs, and viewing saved Products. The UI should be utilitarian, Tailwind/shadcn-based, light/dark capable, and intentionally responsive so mobile and desktop each feel appropriate.

**Status**: DONE

**Done when**:

- [x] Dashboard has a Product results area.
- [x] Dashboard has a Product search request management area.
- [x] User can create, edit, delete, run one, and run all Product search requests in the UI shell.
- [x] Product cards/list components depend on `Product`, not external source-specific types.
- [x] Mobile layout uses mobile-appropriate presentation and actions.
- [x] Desktop layout uses desktop-appropriate space, density, and structure.
- [x] Light and dark mode are supported through the Tailwind/shadcn foundation.
- [x] Empty/loading/error states exist for the local workflow.
- [x] No mock Product data is used as the primary long-term data path.

**Dependencies**:

- Feature 1.1.

---

#### Task 1.2.1a — Add temporary seed Products for dashboard preview

**Outcome**: Provide a small, clearly temporary set of normalized sample Products so the dashboard renders visible content during Feature 1.2 UI work, before DB-backed Products exist.

**Status**: DONE

**Done when**:

- [x] A small sample `Product[]` exists as an isolated, clearly labeled dev-only module.
- [x] Sample Products conform to the `Product` type, with no extra fields and no raw source JSON.
- [x] Sample data covers varied cases such as missing image, missing price, different review states, and long titles.
- [x] Seed usage is isolated so it is trivial to remove or disable.
- [ ] Seed usage is removed/replaced when the dashboard reads Products from Neon.

**Likely areas**:

- `src/features/products/seed/` or similar isolated fixtures module
- `src/features/products/types/`
- `src/app/` dashboard route

**Notes**:

- Seed data is allowed only as temporary preview content.
- Remove or replace seed usage when the dashboard reads Products from Neon in Feature 1.5.

---

#### Task 1.2.1 — Build utilitarian Product dashboard shell with Tailwind/shadcn

**Outcome**: Create the responsive dashboard structure for Product discovery and triage without depending on live external source data yet.

**Status**: DONE

**Done when**:

- [x] Dashboard route renders a utilitarian layout.
- [x] Layout includes a Product search request area and a Product results area.
- [x] Layout works and looks intentional on mobile and desktop.
- [x] Mobile layout uses mobile-appropriate patterns such as stacked cards, touch-friendly actions, and readable spacing.
- [x] Desktop layout uses desktop-appropriate space, density, and structure.
- [x] Light and dark mode are supported through the Tailwind/shadcn theme foundation.
- [x] Empty state explains that no Products have been collected yet.
- [x] UI uses Tailwind/shadcn components where useful.
- [x] UI remains replaceable by a future user-supplied Claude Design system.

**Likely areas**:

- `src/app/`
- `src/features/products/components/`
- `src/features/product-search-requests/components/`
- `src/components/ui/`

**Notes**:

- Route split: `/` is the dashboard — a Product results area plus a run-trigger entry; `/search-requests` is the full request editor/detail view and future home for scheduling-related request settings.
- This Task is the static shell only: no collector execution, no source collection, and no DB persistence.

---

#### Task 1.2.2 — Build Product search request editor for reusable requests

**Outcome**: Let the user create, edit, and delete reusable Product search requests in the UI shell.

**Status**: DONE

**Done when**:

- [x] User can create a Product search request.
- [x] User can edit an existing Product search request.
- [x] User can delete a Product search request.
- [x] Request fields include initial controls such as name, query, min price, max price, condition, and buying option.
- [x] Validation distinguishes required query/name data from optional filters.
- [x] UI names fields using app terms, not raw provider API parameter names when that would be confusing.

**Likely areas**:

- `src/features/product-search-requests/components/`
- `src/features/product-search-requests/types/`
- `src/app/`

**Notes**:

- This Task built the user-facing request shape. Persistence is added in Feature 1.3.
- Keep request fields useful but do not add per-source advanced builders yet.

---

#### Task 1.2.3 — Build run-one and run-all Product search request execution UI

**Outcome**: Add UI controls that let the user request a run for a single Product search request or all Product search requests, launched from a responsive run modal on the dashboard.

**Status**: DONE

**Done when**:

- [x] The dashboard (`/`) launches a responsive run modal that lists saved Product search requests to select.
- [x] The modal supports running selected requests and a quick `Run all` action.
- [x] Each Product search request has an individual run action.
- [x] Dashboard has a run-all action.
- [x] UI shows pending/running state for individual request execution.
- [x] UI shows pending/running state for run-all execution.
- [x] UI shows basic success/failure feedback without exposing secrets or raw provider errors.
- [x] Until the DB/collector path exists, execution controls may be disabled or show `not wired yet` states rather than fake Products.

**Likely areas**:

- `src/features/product-search-requests/components/`
- `src/features/collection-runs/types/`
- `src/app/`

**Notes**:

- Do not add scheduler behavior in Patina MVP 1.
- Do not fake successful external source results.
- Feature 1.4 rewires these controls so they create `CollectionRun` records in Neon instead of directly executing collection.

---

#### Task 1.2.4 — Build Product list and Product card components for saved Products

**Outcome**: Display saved Products from the app's `Product` shape in reusable Product UI components.

**Status**: DONE

**Done when**:

- [x] Product list component exists.
- [x] Product card or row component exists.
- [x] Product UI shows title, price/currency, image when available, source, condition, location when available, review state, and source URL.
- [x] Product results use a mobile-appropriate card/list presentation on small screens.
- [x] Product results use a desktop-appropriate table, grid, split view, or denser card layout on larger screens.
- [x] Review actions remain easy to use with touch and mouse.
- [x] Missing optional Product fields do not break the UI.
- [x] Product actions have clear placement for `new`/`interested`/`rejected` review controls.

**Likely areas**:

- `src/features/products/components/`
- `src/features/products/types/`

**Notes**:

- Components should depend on `Product`, not external source response types.
- Feature 1.5 makes these components read DB-backed Products from Neon.

---

### Feature 1.3 — Neon Postgres Schema and Dashboard Data Persistence

#### Overview

**Goal**: Move Patina dashboard data from temporary/in-memory state to Neon Postgres using Drizzle ORM. This feature creates the shared DB foundation that both Patina and the collector will use.

**Status**: TODO

**Done when**:

- [ ] Drizzle + Neon/Postgres dependencies are installed by the user.
- [ ] Patina has a server-only Neon/Postgres DB connection.
- [ ] Product, ProductSearchRequest, and CollectionRun schema exists.
- [ ] Product search requests are created/edited/deleted through server-side DB helpers.
- [ ] Dashboard and run modal read Product search requests from DB.
- [ ] Temporary in-memory/client request store from Feature 1.2 is removed.
- [ ] No source adapters or external API collection are added in Patina.

**Dependencies**:

- Feature 1.2.

---

#### Task 1.3.1 — User runs Drizzle + Neon/Postgres install command

**Outcome**: Install the selected Drizzle + Neon/Postgres persistence stack through a user-run command.

**Status**: TODO

**Done when**:

- [ ] AI provides the exact install command for Drizzle ORM, drizzle-kit, and the selected Postgres/Neon driver.
- [ ] User runs the install command and confirms it completed.
- [ ] AI inspects the generated/updated files before configuring DB code.
- [ ] AI does not run package installation commands unless explicitly told.

**Likely areas**:

- `package.json`
- lockfile

**Notes**:

- Use Neon/Postgres from MVP 1 onward.
- Do not install SQLite drivers.
- Follow the User-Run Generated Commands rule.

---

#### Task 1.3.2 — Configure server-only Neon/Postgres connection and Drizzle setup

**Outcome**: Add the DB connection module and Drizzle configuration for Neon/Postgres.

**Status**: TODO

**Done when**:

- [ ] Server-only DB client exists.
- [ ] Neon/Postgres connection string is read from ignored environment variables.
- [ ] Missing DB env fails with a clear safe error.
- [ ] Drizzle config points at the correct schema location.
- [ ] Client Components cannot import DB internals.
- [ ] No database credentials are committed.

**Likely areas**:

- `src/lib/db/`
- `src/lib/env/`
- `drizzle.config.ts`
- `.env.local` documentation or ignored example file if needed

**Notes**:

- Keep the DB module small and explicit.
- Do not introduce a managed queue or external job system.

---

#### Task 1.3.3 — Create Drizzle Postgres schema for Products, ProductSearchRequests, and CollectionRuns

**Outcome**: Add the tables needed for dashboard data, collector coordination, Product persistence, dedup, review states, and run history.

**Status**: TODO

**Done when**:

- [ ] Product table/schema exists.
- [ ] ProductSearchRequest table/schema exists.
- [ ] CollectionRun table/schema exists.
- [ ] Product schema includes source, source Product ID when available, source URL, title, price/currency, image, condition, location, discovered/last-seen timestamps, and review state.
- [ ] ProductSearchRequest schema includes name, query, min price, max price, condition, buying option, `source` (an opaque source identifier stored as-is; the dashboard does not enumerate, hardcode, or special-case valid source values), active flag, and timestamps.
- [ ] ProductSearchRequest is where future recurring-schedule fields will live (MVP 2): `scheduleEnabled`, `intervalMinutes` or `cron`, `lastRunAt`, `nextRunAt`. Do not build them now; this is a forward-compat note so the later additive migration is clean.
- [ ] CollectionRun schema includes request ID, `status`, `trigger`, started/finished timestamps, `claimedAt`, inserted/updated counts, and a safe error summary.
- [ ] `trigger` is a value column set to `manual` for runs created by the dashboard now; the later collector scheduler will insert runs with `trigger = 'scheduled'`.
- [ ] `claimedAt` exists so the collector can claim runs atomically and recover orphaned `running` rows after a crash.
- [ ] CollectionRun schema does NOT include any recurring-schedule fields (no interval/cron/nextRunAt); a CollectionRun is one execution, not a schedule.
- [ ] Schema does not include raw source response JSON.
- [ ] Product schema supports dedup by (source, source Product ID) with (source, source URL) fallback, and preserves `reviewState` and `discoveredAt` when an existing Product is re-seen.

**Likely areas**:

- `src/lib/db/schema.ts`
- `src/features/products/types/`
- `src/features/product-search-requests/types/`
- `src/features/collection-runs/types/`

**Notes**:

- Keep schema aligned with normalized `Product`, not raw provider response fields.
- CollectionRun status is the dashboard-to-collector coordination mechanism.
- Statuses should at least support `requested`, `running`, `completed`, and `failed` (`cancelled` may be added later).
- **Patina owns this schema and all `drizzle-kit` migrations. `patina-collector` consumes the same Neon database but must never create or alter tables.** The collector mirrors these shapes as copied TypeScript contracts or read/write query models only.
- This schema must implement the Database Contract in `./master-project-plan.md` → `## 5. Database Contract`. If the two disagree, reconcile the master plan first, because the collector depends on it.
- The collector's upsert preserves `reviewState` (written only by the dashboard during triage); the collector writes every Product field except `reviewState`.

---

#### Task 1.3.4 — Persist ProductSearchRequest records via server-side DB helpers

**Outcome**: Store reusable Product search requests in Neon so the dashboard run modal and `/search-requests` editor share one source of truth.

**Status**: TODO

**Done when**:

- [ ] Create / edit / delete operate against Neon through server-side query helpers/actions/routes.
- [ ] `/search-requests` reads requests as server data.
- [ ] Dashboard run modal reads requests as server data.
- [ ] Validation still distinguishes required query/name data from optional filters.
- [ ] No global client store remains for request data.

**Likely areas**:

- `src/features/product-search-requests/server/`
- `src/features/product-search-requests/components/`
- `src/app/`
- `src/lib/db/`

**Notes**:

- Replace the Feature 1.2 temporary request state with DB-backed data.
- Do not add source-specific advanced request builders in this task.

---

#### Task 1.3.5 — Read ProductSearchRequests from Neon in dashboard and run modal

**Outcome**: Make the dashboard and run modal use DB-backed Product search request data.

**Status**: TODO

**Done when**:

- [ ] Dashboard request summary loads ProductSearchRequests from Neon.
- [ ] Run modal lists ProductSearchRequests from Neon.
- [ ] Empty state appears when no requests exist.
- [ ] Loading/error states remain safe and useful.
- [ ] Temporary client request store from Feature 1.2 is removed.

**Likely areas**:

- `src/app/`
- `src/features/product-search-requests/components/`
- `src/features/product-search-requests/server/`

**Notes**:

- Server Components may fetch initial request data directly through server-side query functions.
- Client Components should not import DB helpers.

---

### Feature 1.4 — Run-Now Collection Request Flow

#### Overview

**Goal**: Wire existing run-one/run-all UI so it creates CollectionRun records in Neon. Patina requests work; the separate collector executes work later.

**Status**: TODO

**Done when**:

- [ ] Running one request creates a CollectionRun with status `requested`.
- [ ] Running all requests creates CollectionRun records for all selected/active requests.
- [ ] UI shows that requested runs are waiting for the collector if they have not started.
- [ ] UI can show requested/running/completed/failed statuses from Neon.
- [ ] Errors do not expose secrets or raw provider internals.
- [ ] Patina does not call any external source API.

**Dependencies**:

- Feature 1.3.

---

#### Task 1.4.1 — Make run-one create a CollectionRun request

**Outcome**: A user can click run for one ProductSearchRequest and create a queued/requested run record in Neon.

**Status**: TODO

**Done when**:

- [ ] Run-one action accepts a saved ProductSearchRequest ID.
- [ ] Server-side action/route validates that the ProductSearchRequest exists.
- [ ] Server-side action/route inserts a CollectionRun with status `requested`.
- [ ] UI shows safe feedback that the run was requested.
- [ ] UI does not imply the Product collection already happened.

**Likely areas**:

- `src/features/product-search-requests/components/`
- `src/features/collection-runs/server/`
- `src/features/collection-runs/types/`
- `src/app/actions.ts` or route handler

**Notes**:

- Do not execute source collection in this task.
- If the collector is off, the run remains `requested`.

---

#### Task 1.4.2 — Make run-all create CollectionRun requests for selected/active requests

**Outcome**: A user can click run all and create requested run records for multiple saved ProductSearchRequests.

**Status**: TODO

**Done when**:

- [ ] Run-all action reads selected/active ProductSearchRequests from Neon.
- [ ] One CollectionRun is created per ProductSearchRequest for MVP simplicity.
- [ ] Failures creating one run do not falsely report that all runs were requested.
- [ ] UI shows a safe summary of how many runs were requested.
- [ ] UI can surface validation errors without exposing internals.

**Likely areas**:

- `src/features/product-search-requests/components/`
- `src/features/product-search-requests/server/`
- `src/features/collection-runs/server/`

**Notes**:

- Do not add a batch/group model unless implementation proves it is needed.
- Do not add a scheduler here.

---

#### Task 1.4.3 — Show CollectionRun status in the dashboard/run modal

**Outcome**: Make requested/running/completed/failed statuses visible so the user understands whether the collector has picked up work.

**Status**: TODO

**Done when**:

- [ ] Dashboard can show recent CollectionRun records.
- [ ] Run modal or nearby status area can show requested/running/completed/failed states.
- [ ] Requested runs clearly indicate they are waiting for the collector.
- [ ] Completed runs show inserted/updated counts when available.
- [ ] Failed runs show safe error summaries.

**Likely areas**:

- `src/features/collection-runs/components/`
- `src/features/collection-runs/server/`
- `src/app/`

**Notes**:

- MVP 1 can use refresh/revalidation after actions. Near-real-time polling/streaming can wait.
- Do not add a persistent app-wide run-status widget unless the roadmap is updated.

---

### Feature 1.5 — Product Triage, Filters, and Run History UI

#### Overview

**Goal**: Make the DB-backed dashboard useful after Products are written to Neon by the collector or test data path.

**Status**: TODO

**Done when**:

- [ ] Dashboard reads Products from Neon.
- [ ] Temporary seed Product usage is removed or clearly disabled.
- [ ] User can mark Products as `new`, `interested`, or `rejected`.
- [ ] Review state persists after reload.
- [ ] Re-seeing a Product does not reset review state.
- [ ] Dashboard can filter by review state, source, and Product search request when available.
- [ ] Basic collection/search history exists if needed for MVP usability.

**Dependencies**:

- Feature 1.3.
- Feature 1.4 for run history/status.

---

#### Task 1.5.1 — Display saved Products from Neon in dashboard

**Outcome**: Make the dashboard load saved Products from Neon as its primary Product source.

**Status**: TODO

**Done when**:

- [ ] Dashboard loads Products from Neon through server-side query helpers.
- [ ] Empty state appears when DB has no Products.
- [ ] Product UI no longer depends on temporary seed Products for the main dashboard.
- [ ] Missing optional fields render safely.
- [ ] Product list/card components still depend on `Product`, not DB row internals.

**Likely areas**:

- `src/app/`
- `src/features/products/server/`
- `src/features/products/components/`
- `src/lib/db/`

**Notes**:

- Server Components may fetch initial Product data directly through server-side Product query functions.
- Client Components should not import DB helpers.
- Remove or clearly disable temporary seed Product usage once this lands.

---

#### Task 1.5.2 — Add Product review state updates: new, interested, rejected

**Outcome**: Let the user classify Products using review states that drive dashboard triage.

**Status**: TODO

**Done when**:

- [ ] New Products default to `new`.
- [ ] User can mark a Product as `interested`.
- [ ] User can mark a Product as `rejected`.
- [ ] User can return a Product to `new` if needed.
- [ ] Review state persists after reload.
- [ ] Query helpers preserve review state when an existing Product is seen again.

**Likely areas**:

- `src/features/products/components/`
- `src/features/products/server/`
- `src/lib/db/`

**Notes**:

- Use `interested` and `rejected`, not `saved` and `ignored`.
- Do not add seller messaging, bidding, offers, or checkout.

---

#### Task 1.5.3 — Add dashboard filters for review state, source, and Product search request when available

**Outcome**: Let the user focus the dashboard on subsets of saved Products.

**Status**: TODO

**Done when**:

- [ ] User can view `new` Products.
- [ ] User can view `interested` Products.
- [ ] User can view `rejected` Products.
- [ ] User can filter by source.
- [ ] User can filter by Product search request if Product/request relationship is stored.
- [ ] Selected filters are clear in the UI.

**Likely areas**:

- `src/features/products/components/`
- `src/features/products/server/`
- `src/app/`

**Notes**:

- Use URL state only if it keeps lightweight dashboard filters useful.
- Do not add scoring/ranking filters in MVP 1.

---

#### Task 1.5.4 — Add collection run history display

**Outcome**: Show when Product search requests ran, what happened, and how many Products were collected.

**Status**: TODO

**Done when**:

- [ ] Recent CollectionRun records appear in the dashboard or a run history area.
- [ ] Run records include request, started/finished time, status, inserted/updated counts, and safe error summary if relevant.
- [ ] Dashboard can show basic last-run feedback per request when useful.
- [ ] Error summaries avoid secrets and raw provider internals.

**Likely areas**:

- `src/features/collection-runs/components/`
- `src/features/collection-runs/server/`
- `src/features/product-search-requests/components/`
- `src/lib/db/`

**Notes**:

- This prepares collector health/scheduler UX without adding a scheduler now.

---

#### Task 1.5.5 — MVP 1 local acceptance pass and roadmap status update

**Outcome**: Confirm the local Patina dashboard/control plane works end to end and update roadmap status before collector integration work begins.

**Status**: TODO

**Done when**:

- [ ] User can create a Product search request.
- [ ] User can edit/delete a Product search request.
- [ ] User can request one run.
- [ ] User can request all runs.
- [ ] CollectionRun records are created in Neon.
- [ ] Dashboard displays CollectionRun status/history from Neon.
- [ ] Dashboard displays saved Products from Neon.
- [ ] User can mark Products `new`, `interested`, or `rejected`.
- [ ] MVP 1 task statuses are updated.
- [ ] Any known limitations are recorded before collector work begins.

**Likely areas**:

- Full local app
- `./project-implementation-roadmap.md`

**Notes**:

- Do not begin collector execution inside Patina. Collector implementation belongs in `patina-collector`.
- If source access constraints change the product direction, update the Master Project Plan and this roadmap before coding further.

---

## Epic 2 — MVP 1.5: Collector Integration Contract

**Epic Goal**: Keep Patina compatible with the separate collector service through shared database records without putting source execution in the Patina dashboard repo.

**Status**: Later

**Done when**:

- [ ] Patina's CollectionRun schema/statuses are sufficient for collector polling/claiming.
- [ ] Patina can display statuses written by the collector.
- [ ] Patina can display Products written by the collector.
- [ ] Patina does not import collector code or source adapters.

### Feature 2.1 — Collector Contract Review

#### Overview

**Goal**: Review the shared database contract after the first collector implementation exists and adjust only if necessary.

**Status**: Later

**Notes**:

- Define detailed tasks when `patina-collector` implementation reaches the DB polling/product write path.
- Avoid creating a separate shared package until duplication becomes painful.
- Prefer the database schema and narrow copied TypeScript contracts over cross-importing UI code into the collector.

---

## Epic 3 — MVP 2: Hosted/Remote Dashboard Access

**Epic Goal**: Make the Patina dashboard reachable from personal devices after the local Neon-backed dashboard is useful.

**Status**: Later

**Done when**:

- [ ] Hosting target is chosen.
- [ ] Dashboard can run against Neon in hosted configuration.
- [ ] Secrets are configured through host environment variables.
- [ ] Access is protected appropriately for personal use.
- [ ] Collector can remain local and connect outbound to Neon.

### Feature 3.1 — Decide dashboard hosting/access path

#### Overview

**Goal**: Choose the simplest remote access setup once MVP 1 is useful.

**Status**: Later

**Notes**:

- Candidate paths include Vercel, Oracle Cloud, or a home machine behind Tailscale.
- Neon remains the DB either way.
- Do not assume Oracle/Tailscale is required unless the deployment decision points there.

---

## Epic 4 — Later: Additional Source Adapter Support

**Epic Goal**: Keep Patina source-agnostic while source adapters live in `patina-collector`.

**Status**: Deferred

**Done when**:

- [ ] Source-specific request fields are added only when an approved source actually needs them.
- [ ] Patina can display Products from multiple sources through normalized Product records.
- [ ] Source filtering works without dashboard source-specific logic.

### Deferred Source Notes

- The dashboard stays source-agnostic. Which sources exist, whether they are validated, and how Products are collected are owned by `patina-collector` and intentionally outside the dashboard's knowledge.
- The dashboard must never enumerate or special-case a specific source. New sources require no dashboard changes beyond storing/displaying their opaque `source` value.
- No source adapter, source credential, or browser automation is ever added to the Patina dashboard repo.
