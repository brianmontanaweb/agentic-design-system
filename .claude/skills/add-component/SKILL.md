---
name: add-component
description: Scaffolds a new component in @agentic-ds/core or @agentic-ds/agents, producing the source file, Storybook story, unit tests, spec doc, and index export — with correct ARIA live regions, semantic tokens, and CSS scoping applied from the start. Use when adding, creating, or scaffolding a new component.
---

# Add Component

Scaffold a new component given `$ARGUMENTS` in the format `<ComponentName> [core|agents]`.

If the package is not specified, infer it:
- Agent-lifecycle, streaming, messaging, tool-call, or status components → `agents`
- General-purpose UI primitives → `core`

---

## Gotchas

These defuse the most common mistakes before you encounter them:

- **Figma is optional** — if the user skips the link, mark "Figma: skipped" in output and proceed immediately; never block on it.
- **Never use `import React from 'react'` in story files** — jsx-runtime handles JSX and Storybook's own types cover everything else.
- **Never use `import React from 'react'` in source files either.** When the props interface needs React types, use named type imports: `import type { ReactElement, ReactNode, MouseEventHandler } from 'react'`. This lets you write `leftIcon?: ReactElement` without the default import. Do not write `React.ReactElement` — that requires the default import and will trigger a lint violation.
- **Test files DO import React** — existing tests use `import React from 'react'`; follow that pattern for consistency.
- **Use `renderWithProviders`, never `render` directly** — `renderWithProviders` wraps in `AgenticProvider` so Chakra tokens resolve correctly. Located at `packages/<package>/src/__tests__/test-utils.tsx`.
- **Test ARIA first** — `role`, `aria-describedby`, `aria-live`, `aria-expanded` are the most important things to assert; they prove accessibility correctness, not just render correctness.
- **Use `userEvent`, not `fireEvent`** — `userEvent.setup()` simulates real browser events (pointer, keyboard, focus). Use `{ advanceTimers: vi.advanceTimersByTime }` when the component has debounce/delay timers.
- **Use fake timers for components with setTimeout** — call `vi.useFakeTimers()` in `beforeEach` and `vi.useRealTimers()` in `afterEach` when the component hides/shows with a delay.
- **Agent-specific ARIA is mandatory from the start** — do not scaffold first and audit later; apply the correct live region from step 3 based on component type.
- **Package inference default** — when ambiguous, lean `agents` for status/streaming/tool-related names; lean `core` for anything that reads like a generic UI primitive.
- **`color.on.accent` and similar token names are not hex violations** — only flag `#`-prefixed literal values.
- **Components live in subdirectories** — all files for a component go in `packages/<package>/src/<ComponentName>/`. The root `index.ts` re-exports from `'./<ComponentName>'`, which resolves to the barrel `index.ts` inside the directory.
- **Run `npm run build` before `npm run lint`** — `tsc --noEmit` in lint requires the tokens package to be built first.

---

## Step 0 — Check for existing component

Before doing anything else, check whether the component already exists in either package:

```sh
ls packages/core/src/<ComponentName>/<ComponentName>.tsx packages/agents/src/<ComponentName>/<ComponentName>.tsx 2>/dev/null
```

If any output is produced, the component already exists. **Stop immediately** and respond:

```
## Already exists: <ComponentName>

`<path shown in ls output>` already exists.
Use `/update-component <ComponentName>` to audit and update it instead.
```

Do not read, write, or modify any files. Do not proceed to Step 1.

---

## Step 1 — Read existing conventions

Before writing any code:
- Read `docs/best-practices.md` sections 1–7 (MCP lifecycle, accessibility, tokens, naming, docs, build targets, CSS scoping). Read section 8 (Figma MCP Usage) only if the user provided a Figma link.
- Read `packages/<package>/src/index.ts` to understand the current export pattern
- Read one existing component source file in the target package to understand the code style
- Read one existing component test file (e.g. `packages/<package>/src/Button/Button.test.tsx`) to understand the test conventions
- Read `docs/components/Button.md` to understand the spec doc format

## Step 2 — Fetch the Figma component node

If the user provided a Figma component node link in their request, extract `fileKey` and `nodeId` and call `get_file_nodes(fileKey, [nodeId])`. Follow the extraction and conflict resolution process in `docs/best-practices.md` section 8.

If no Figma link was provided, note **Figma: skipped** and proceed immediately. Do not ask.

## Step 3 — Create the component source file

File: `packages/<package>/src/<ComponentName>/<ComponentName>.tsx`

Requirements (all MUST):
- Functional component, named export (no default export)
- Do NOT add `import React from 'react'`. For React type annotations in the props interface, use named type imports: `import type { ReactElement, ReactNode, MouseEventHandler } from 'react'`. Write `leftIcon?: ReactElement`, not `leftIcon?: React.ReactElement`.
- Export the props interface: `export interface <ComponentName>Props { ... }`
- All color values MUST reference Chakra semantic tokens — no hardcoded hex
- All timing values MUST reference `duration.*` tokens from `@agentic-ds/tokens`
- If the component displays status or live-updating content, it MUST include the correct ARIA live region:
  - Sequential content (streaming text, message thread) → `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
  - Status indicators → `role="status"` + `aria-live="polite"`
  - Errors → `role="alert"`
- If the component has interactive expand/collapse, the trigger MUST be a `<button>` with `aria-expanded` + `aria-controls`
- Animated decorative elements MUST be `aria-hidden="true"`

## Step 4 — Add export to package index

Files:
1. Create `packages/<package>/src/<ComponentName>/index.ts`:
```ts
export * from './<ComponentName>'
```
2. Update `packages/<package>/src/index.ts`:
```ts
export { <ComponentName> } from './<ComponentName>'
export type { <ComponentName>Props } from './<ComponentName>'
```

## Step 5 — Create Storybook story

File: `apps/storybook/src/stories/<ComponentName>.stories.tsx`

Requirements:
- Use `type { Meta, StoryObj }` from `@storybook/react`
- Title format: `'Core/<ComponentName>'` or `'Agents/<ComponentName>'`
- Include a story for every meaningful prop variant and state
- Include a story for every status/state value if the component is stateful
- Do NOT import `React` (jsx-runtime transform is configured)

## Step 6 — Create unit tests

File: `packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx`

Requirements:
- Import `React from 'react'` (existing test convention)
- Import `{ describe, expect, it, vi, beforeEach, afterEach }` from `'vitest'`
- Import `{ screen, act }` from `'@testing-library/react'`
- Import `userEvent` from `'@testing-library/user-event'`
- Import `renderWithProviders` from `packages/<package>/src/__tests__/test-utils`
- Import the component and its prop types from `'./<ComponentName>'`

### Required test groups

Every component test file MUST include these groups:

**`structure`** — basic render and DOM shape:
- Renders without crashing
- Key child elements exist in the DOM
- Any significant DOM roles are present

**`ARIA`** — one test per ARIA attribute the component sets:
- `role`, `aria-live`, `aria-atomic`, `aria-describedby`, `aria-expanded`, `aria-controls`, `aria-label`, `aria-current`, `aria-hidden` — test whichever apply
- Each test asserts the attribute is set AND that its value is correct (id reference, string value, boolean)

**`props`** — one test per meaningful prop:
- Use `it.each` for enum props (`variant`, `size`, `placement`, `status`)
- Each variant/size/status MUST have at least a smoke-test asserting it renders without crashing

**`disabled / isDisabled`** — if applicable:
- Confirms blocked behavior (events not fired, element not rendered, attribute absent)

**`interaction`** — for every user-facing behavior:
- Use `userEvent.setup()` for all events — never `fireEvent`
- Hover: `user.hover()` / `user.unhover()`
- Keyboard: `user.tab()`, `user.keyboard('{Escape}')`, `user.keyboard('{Enter}')`, `user.keyboard(' ')`
- Click: `user.click()`
- When the component uses `setTimeout` for show/hide delays, use `vi.useFakeTimers()` in `beforeEach`, `vi.useRealTimers()` in `afterEach`, and pass `{ advanceTimers: vi.advanceTimersByTime }` to `userEvent.setup()`; wrap timer advancement in `act(() => { vi.runAllTimers() })`

### What not to test

- Visual styles (colors, font sizes, spacing) — these are token values, not logic
- Animation keyframes
- Implementation details (internal state variable names, specific CSS class names)

## Step 7 — Create component spec doc

File: `docs/components/<ComponentName>.md`

Use the YAML frontmatter format from `docs/components/Button.md`:
```yaml
---
component: <ComponentName>
package: "@agentic-ds/<package>"
category: <category>
status: implemented
tokens:
  colors: [list semantic tokens used]
  radius: [list if component uses radius tokens]
  duration: [list if animated]
  fonts: [list if component uses font tokens]
wcag: AA
aria-pattern: <URL to WAI-ARIA APG pattern if applicable>
mcp-states: [list MCP states surfaced, if applicable]
---
```

Body MUST include: description, variants table (if applicable), props table, accessibility requirements with WCAG SC references, do/don't examples. Use MUST/SHOULD/MAY (RFC 2119).

## Step 8 — Build, lint, and test

Run in order:
```sh
npm run build
eslint packages/<package>/src/<ComponentName>/<ComponentName>.tsx apps/storybook/src/stories/<ComponentName>.stories.tsx
npx vitest run packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx
```

Only lint and test the files this skill creates — pre-existing violations in other files are not your responsibility. Fix any errors ESLint reports on your files before finishing. Do not use `eslint-disable` comments. Fix any failing tests before finishing.

Include the actual command output (exit code and last few lines of stdout/stderr) in your response so results are verifiable from the transcript.

## Step 9 — Report

Output a concise summary:

```
## Done: <ComponentName>

**Package:** core | agents
**Files created:** <list>
**ARIA pattern:** <pattern applied or "none">
**MCP states:** <list or "n/a">
**Build + lint:** passing
**Tests:** passing (N tests)
**Figma:** reviewed | skipped
```

To score this run against known test cases, see `evals/evals.json`.
