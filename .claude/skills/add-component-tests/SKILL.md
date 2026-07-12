---
name: add-component-tests
context: fork
description: Creates the unit test file for an existing component in @agentic-ds/core or @agentic-ds/agents — ARIA-first test groups using renderWithProviders and userEvent — and runs it to green. Use when a component needs tests, when backfilling test coverage, or as step 3 of the /add-component flow.
---

# Add Component Tests

Create and run unit tests given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

- **Test files DO import React** — `import React from 'react'`; this is the opposite of the source/story rule.
- **Use `renderWithProviders`, never `render` directly** — it wraps in `AgenticProvider` so Chakra tokens resolve. Import it from `'../__tests__/test-utils'` (relative to the component directory).
- **Use `userEvent`, not `fireEvent`** — `userEvent.setup()` simulates real browser events. Pass `{ advanceTimers: vi.advanceTimersByTime }` when the component has debounce/delay timers.
- **Use fake timers for components with `setTimeout`** — `vi.useFakeTimers()` in `beforeEach`, `vi.useRealTimers()` in `afterEach`.
- **Test ARIA first** — `role`, `aria-live`, `aria-expanded`, etc. prove accessibility correctness, not just render correctness.
- **No approval gate** — creating one test file and running it is the whole task; proceed without asking.

---

## Step 1 — Locate the component source

```sh
ls packages/core/src/<ComponentName>/<ComponentName>.tsx packages/agents/src/<ComponentName>/<ComponentName>.tsx 2>/dev/null
```

If no output, **stop immediately** and respond:

```
## No source: <ComponentName>

Neither package contains `<ComponentName>`. Create it first with
`/add-component-source <ComponentName>` (source only) or `/add-component <ComponentName>` (full scaffold).
```

Infer the package (`core` or `agents`) from which path exists.

## Step 2 — Read context

Skip anything already in context from earlier in this conversation:

- `.claude/skills/shared/references/testing.md` — required imports, test groups, timer/userEvent rules
- The component source file — enumerate props, states, ARIA attributes, and interactive behavior to cover
- One existing test file in the target package (e.g. `packages/agents/src/ThinkingIndicator/ThinkingIndicator.test.tsx`) — test style
- If `packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx` already exists, read it — extend it, don't recreate it

## Step 3 — Create or extend the test file

File: `packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx`

Follow `shared/references/testing.md` exactly: the file setup imports, the required test groups (`structure`, `ARIA`, `props`, `disabled` if applicable, `interaction`), and the "what not to test" exclusions. Every ARIA attribute the component sets gets its own assertion; every enum prop value gets at least a smoke test via `it.each`.

## Step 4 — Run the tests

```sh
npm run build
npx vitest run packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx
```

(Skip `npm run build` if the packages were already built in this session.) Fix any failing tests before finishing. If a failure reveals a bug in the component source rather than the test, report it — fix the source only if invoked from `/add-component`; when standalone, surface it and let the user decide.

Include the actual command output (exit code and last few lines of stdout/stderr) in your response so results are verifiable from the transcript.

## Step 5 — Report

```
## Tests created: <ComponentName>

**File:** packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx
**Groups:** structure, ARIA, props[, disabled][, interaction]
**Result:** passing (N tests)
```

To score this run against known test cases, see `evals/evals.json`.
