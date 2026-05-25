# Coding Principles, Rules, and Workflow

## How to Use This File

This section governs how every other section should be interpreted.

### Rule Priority

When instructions conflict, follow this priority:

1. Correctness
2. User request
3. Operating mode and intended scale
4. Simplicity within that scope
5. Existing project style
6. Cleanliness/refactoring

More specific guidance refines general guidance when they do not conflict. If they conflict, use the priority list above.

### Operating Mode

Apply these rules based on the type of work being done.

When editing existing code:

- Prioritize surgical changes.
- Match the existing style.
- Avoid unrelated refactors.
- Clean up only what the current change creates.

When adding features to existing code:

- Preserve existing patterns unless they conflict with the requested change.
- Add new files, components, hooks, or modules when they create a clear responsibility boundary.
- Avoid forcing a new architecture onto an existing project.
- Keep the feature easy to extend without refactoring unrelated code.

When building new code or new features:

- Create clear boundaries for the next obvious feature.
- Avoid designing for imaginary future features.
- Prefer simple, understandable structure over heavy architecture.

When refactoring:

- Preserve behavior before improving structure.
- Verify behavior before and after when practical.
- Keep the refactor tied to a clear goal.

When fixing bugs:

- Reproduce or identify the incorrect behavior first.
- Make the smallest change that fixes the issue.
- Verify that the bug no longer happens.

### Instruction Types

Core principles are judgment lenses for making coding decisions when there is no single obvious answer.

Rules are concrete constraints that should be followed unless they conflict with a higher-priority instruction.

Architecture guidelines help structure code so the project can grow without becoming over-engineered.

Framework rules apply to specific technologies, such as React and Next.js.

Implementation workflow defines how the work should be planned, executed, verified, and summarized.

## Core Principles

### Think before coding

**Don't assume silently. Surface uncertainty, tradeoffs, and scope decisions.**

Before making changes:

- Restate the goal briefly when the task is non-trivial.
- Identify ambiguity that could change the implementation.
- Ask only when the missing information blocks the work or could cause the wrong architecture.
- If the ambiguity is minor, make the smallest reasonable assumption and state it.
- Push back when the requested approach is risky, overcomplicated, or inconsistent with the project.

Avoid long planning unless the task is large or multi-step.

### Design for Growth Without Speculation

**Create clear seams for future growth, but do not build features before they exist.**

When building new code from the ground up, prefer structure that can grow naturally:

- Separate concerns early when they are genuinely different concerns.
- Keep UI, state, data fetching, business rules, and formatting logic from collapsing into one large file.
- Create reusable pieces when there is a clear repeated pattern or a strong reason to expect reuse.
- Do not create generic abstractions just because something might be reused later.
- Prefer small focused modules over large “god” components, services, or utility files.
- Design APIs and component props around the caller’s goal, not around internal implementation details.

Good growth-oriented code should be easy to extend without being over-engineered on day one.

### Simplicity by Default

**Use the simplest solution that fits the operating mode and intended scale. Nothing speculative.**

- Do not expand scope just to make code “better.” If a better approach requires changing scope, mention it instead of doing it silently.
- Do not add features beyond what was asked.
- Do not add abstractions for single-use code.
- Do not add configurability unless the value clearly needs to vary.
- Do not add broad error handling for impossible or irrelevant scenarios.
- Prefer obvious code over clever code.
- If a solution can be 50 lines instead of 200 without losing clarity, use 50.

Good code should be easy to delete, easy to understand, and directly tied to the task.

### Composition Before Abstraction

Prefer composing small, clear pieces over creating broad configurable components.

Good composition:

- passing children into layout components
- creating named sections for meaningful UI regions
- using small hooks for reusable behavior
- using utility functions for pure transformations
- combining simple components instead of creating one component with many modes

Avoid components with many boolean props, mode flags, or configuration objects unless the variation is real and repeated.

If a reusable component needs too many options to work, it may be the wrong abstraction.

## Editing Existing Code

### Surgical Changes

**Touch only what is needed. Clean up only the mess created by the current change.**

When editing existing code:

- Do not refactor unrelated code.
- Do not reformat unrelated files or sections.
- Do not rename things unless the rename is part of the task.
- Match the existing style even if another style would be preferable.
- If unrelated dead code or design issues are noticed, mention them instead of changing them.

When your changes create unused code:

- Remove imports, variables, functions, and files made unused by your change.
- Do not remove pre-existing dead code unless asked.

**Test:** Every changed line should trace back to the user’s request.

## General Coding Rules

### Avoid Hardcoded Values

Do not hardcode values that represent business rules, environment details, repeated constants, secrets, URLs, IDs, limits, labels, or values likely to change.

Prefer:

- Existing constants
- Config/env variables
- Shared types/enums
- Named local constants
- Values already specified in the task or implementation plan

Allowed literals:

- Simple UI text when the text itself is the feature
- Small one-off values that are intrinsic to the code
- Test fixtures and mock data
- Standard values where abstraction would reduce clarity

Do not create a config system for a value used once unless it clearly needs to vary.

### Explicit Default Behavior

When using a multi-branch decision structure, include an intentional fallback.

Use a default/fallback for:

- `if / else if / else` chains
- `switch` statements
- type or status branching
- parsing external data
- handling user input
- API response branching

The fallback should do something meaningful, such as:

- return a safe default
- show an empty/error state
- throw a clear error
- call an exhaustive-check helper like `assertNever`

Do not add pointless `else` blocks after guard clauses or early returns.

Good:

```ts
if (!user) {
  return null;
}

if (user.role === "admin") {
  return <AdminView />;
}

if (user.role === "member") {
  return <MemberView />;
}

return <GuestView />;
```

and

```typescript
switch (status) {
  case "loading":
    return <LoadingState />;
  case "success":
    return <SuccessState />;
  case "error":
    return <ErrorState />;
  default:
    return <EmptyState />;
}
```

### Strategic Comments Only

Comments should explain intent, assumptions, tradeoffs, or non-obvious behavior.

Use comments for:

- why something is done
- assumptions that are not obvious
- temporary decisions
- constraints from APIs, libraries, or business rules
- behavior that might look wrong but is intentional

Avoid comments that merely describe what the code already says.

Bad:

```typescript
// Loop through users
users.forEach((user) => {});
```

Good:

```typescript
// Keep inactive users visible so historical reports do not lose attribution.
const visibleUsers = users.filter((user) => user.isActive || user.hasReports);
```

Keep comments short. Prefer no more than two lines unless the context genuinely requires more.

### Descriptive Names

Use names that describe purpose, not just type.

Prefer:

```typescript
activeDealerCount;
selectedPokemonType;
monthlyRevenueTotal;
```

Avoid vague names:

```typescript
data;
item;
thing;
val;
obj;
```

Short names are allowed for common, localized patterns:

- `i`, `j` for simple indexes
- `id` for identifiers
- `res` for responses/results when the scope is tiny
- `err` for caught errors
- `ret` only when intentionally useful for debugging

If a variable lives longer than a few lines, give it a descriptive name.

## Application Architecture and Organization

### Feature-First Organization

When building a growing app, organize code around features before organizing around technical type.

Prefer keeping feature-specific components, hooks, utilities, and types near the feature that uses them.

Example:

```txt
features/
  dealer-dashboard/
    components/
    hooks/
    api/
    types.ts
    utils.ts
```

Use shared folders only for code that is truly shared across multiple features.

Good shared candidates:

- generic UI components
- reusable hooks
- app-wide types
- API clients
- formatting utilities
- constants used in multiple features

Avoid moving code into shared folders just because it might be useful later.

Keep feature-specific code close to the feature until it proves it belongs in a shared layer.

### Reuse and Extensibility

**Reuse should come from real patterns, not guesses.**

Create shared abstractions when:

- the same logic appears in multiple places
- two features clearly follow the same pattern
- a piece has a stable responsibility and a good name
- keeping it duplicated would make future changes error-prone

Do not create shared abstractions when:

- there is only one use case
- the future use case is vague
- the abstraction makes the current code harder to read
- the abstraction requires many options, flags, or configuration values to work

Prefer duplication over the wrong abstraction.

When in doubt:

1. Build it directly.
2. Notice the repeated shape.
3. Extract the shared piece.
4. Keep the abstraction narrow.

### Domain Modeling and Object-Oriented Design

Use domain modeling when the app has concepts with rules, behavior, or invariants.

Prefer plain TypeScript types, functions, and modules by default.

Use classes or object-oriented patterns when:

- a domain concept owns internal state
- construction rules matter
- methods make the API clearer than loose functions
- multiple implementations need to follow the same interface
- the object protects invariants that should not be scattered across the app

Avoid classes when they only group unrelated helper functions.

Prefer composition over inheritance.

## React and Next.js Rules

### React Component Design

Build React code around ownership and responsibility, not arbitrary file splitting.

Component roles:

- Route/page components coordinate route-level data, layout, and feature composition.
- Feature components own a meaningful section of product behavior.
- UI components are reusable visual building blocks with minimal business logic.
- Hooks hold reusable stateful behavior.
- API/client functions isolate calls to external services when reuse, complexity, or change risk justifies it.
- Utility functions hold pure formatting, mapping, filtering, and calculation logic.

Do not extract components just because JSX is long.

Extract a component when:

- the section has a clear name and responsibility
- the same structure appears more than once
- the parent component is mixing unrelated concerns
- the child section has its own state, events, or loading/error behavior
- the split makes the data flow easier to understand

Keep code inline when:

- the JSX is simple and only used once
- extraction would require awkward props
- the new component name would be vague
- the split hides logic instead of clarifying it

A good component boundary should make the code easier to understand, not just shorter.

#### Data and Component Boundaries

Fetching data inside a component or hook is allowed when it matches the framework pattern and keeps the code clear.

For Next.js:

- Server Components may fetch the data they need directly.
- Page/layout components may fetch data when they are coordinating a route.
- Child Server Components may fetch their own data when it keeps ownership local and avoids unnecessary prop drilling.
- Client Components should fetch data only when the data depends on client-side state, browser behavior, user interaction, polling, revalidation, or after-load behavior.

For React hooks:

- Hooks may call API functions directly.
- Prefer keeping raw API details in a small API/client function when the call is reused, complex, or likely to change.
- A hook should usually coordinate stateful behavior: loading, error, success data, refetching, derived state, or user-triggered actions.
- A hook should not become a dumping ground for unrelated business logic.

Prefer this shape when it helps clarity:

```ts
Component -> hook -> API/client function
```

But do not force that shape for simple one-off cases.

Good:

```typescript
// Server Component owns the data needed for this route section.
export default async function DealerLeaderboardPage() {
  const dealers = await getDealerLeaderboard();

  return <DealerLeaderboard dealers={dealers} />;
}
```

Also good:

```typescript
function useDealerLeaderboard(month: string) {
  return useQuery({
    queryKey: ["dealer-leaderboard", month],
    queryFn: () => getDealerLeaderboard(month),
  });
}
```

Avoid:

```typescript
function DealerDashboard() {
  // Fetches data, transforms API shape, owns filters, renders charts,
  // renders table, handles exports, formats currency, and manages modals.
}
```

That component should probably be split by responsibility.

#### Avoid God Components, Not Multiple Responsibilities

A component may fetch data, render UI, and compose child components.

The problem is not that a component does more than one thing. The problem is when it owns too many unrelated responsibilities.

Watch for these signs:

- one component owns multiple unrelated pieces of state
- data fetching, transformation, formatting, layout, and interaction logic are all tangled together
- child sections are hard to name because responsibilities are unclear
- adding a small feature requires editing many unrelated parts of the same file
- the component cannot be tested, reused, or reasoned about without loading the whole page

When this happens, split by responsibility:

- move pure calculations to utilities
- move reusable stateful behavior to hooks
- move API details to API/client functions
- move visual sections to named child components
- keep feature-specific pieces near the feature until they prove they are shared

## Implementation Workflow

### Goal-driven execution

**Define what success means, then verify it.**

For non-trivial work, use a short loop:

1. Identify the intended behavior.
2. Make the smallest necessary change.
3. Verify with the most relevant check.

Examples:

| Task             | Better execution                                                 |
| ---------------- | ---------------------------------------------------------------- |
| “Add validation” | Define invalid inputs, then verify they fail correctly           |
| “Fix the bug”    | Reproduce the bug, fix it, then verify the repro no longer fails |
| “Refactor this”  | Confirm behavior before and after stays the same                 |
| “Add UI state”   | Verify loading, empty, success, and relevant error states        |

Use tests when practical. If formal tests are not available or not worth adding, use a targeted manual check and state what was verified.

Do not create excessive status updates, checklist noise, or documentation churn for small changes.

### User-Run Generated Commands

For commands that scaffold, initialize, install, migrate, or generate files, do not run them automatically unless explicitly told to.

Examples include:

- `npx create-next-app`
- `npx shadcn@latest init`
- `npx shadcn@latest add ...`
- package installation commands
- database migration/init commands
- Docker initialization/build commands
- code generators

When one of these commands is needed:

1. Stop and tell me the exact command to run.
2. Explain briefly why it is needed.
3. Wait for me to run it and report back.
4. Resume from the generated files I provide or confirm exist.

After I run the command, inspect the generated structure before editing it.

### Execution-Critical Instructions and Lossy Summaries

When following a roadmap, issue, or implementation plan, preserve execution-critical details instead of summarizing them away.

Execution-critical details include decisions about technology, runtime, sequencing, ownership, boundaries, data shape, external dependencies, exclusions, and verification targets.

Avoid lossy summaries. A summary is lossy when it removes decisions that affect how the work should be implemented. Concise is good; lossy is not.

Examples:

- `Add Next.js server boundary for Product search collection` should not be reduced to `Add API`.
- `Add eBay Browse API module that maps ProductSearchRequest to Product[]` should not be reduced to `Add eBay integration`.
- `Save normalized Product records into PostgreSQL database` should not be reduced to `Save product data`.

Prefer explicit terms from the project source documents over generic words like "setup," "API," "dashboard," "integration," "data," "logic," or "handler" when those words could be ambiguous.

### AI Coding Behavior

When writing code:

1. Match the implementation approach to the operating mode and intended scale.
2. Make the smallest useful change that fully solves the task.
3. Create new files, components, hooks, modules, or services when they provide a clear responsibility boundary.
4. Avoid creating new structure only to appear organized.
5. Do not change public APIs unless required.
6. Do not silently introduce new dependencies.
7. Do not rewrite working code for style reasons.
8. Verify the result with the narrowest useful test or check.
9. When building new features, choose a structure that supports the next obvious feature without designing for imaginary future features.
10. If following a roadmap or plan, rely on the source documents in the repo instead of unstated conversation context.
11. If a file or component is becoming too large, split it by responsibility, not by arbitrary line count.
12. Before creating a shared abstraction, be able to identify the repeated pattern it captures. Mention it briefly when it affects architecture or file structure.
13. Summarize what changed and how it was verified.

If the requested change conflicts with these rules, explain the conflict and choose the simplest safe path.
