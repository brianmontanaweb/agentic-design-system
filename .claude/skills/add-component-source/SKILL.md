---
name: add-component-source
context: fork
description: Creates the source file, barrel index, and package export for a new component in @agentic-ds/core or @agentic-ds/agents — with the correct ARIA live region, semantic tokens, and CSS scoping applied from the start. Use when creating just a component's implementation file (no story, tests, or docs), or as step 1 of the /add-component flow.
---

# Add Component Source

Create the component source and exports given `$ARGUMENTS` in the format `<ComponentName> [core|agents]`. Extra context (ARIA pattern, MCP states) may follow — use it instead of re-deriving.

If the package is not specified, infer it using the package inference rules in the shared conventions reference (Step 2).

---

## Gotchas

- **Never `import React from 'react'`** — use named type imports (`import type { ReactElement, ReactNode } from 'react'`); write `leftIcon?: ReactElement`, never `React.ReactElement`.
- **ARIA is mandatory from the first line** — apply the correct live region while writing the component, not in a later audit pass.
- **`color.on.accent` and similar token names are not hex violations** — only flag `#`-prefixed literal values.
- **Light/dark support is free if you stay on semantic tokens** — never read color mode in the component and never use raw `colors.*`/`lightColors.*` exports for styling. If a needed color has no semantic token, follow the three-step token addition in the Theming section of the shared conventions reference (raw dark + light values → semantic token with `_dark`/`_light` → use the token name).
- **No approval gate** — this skill creates exactly the files listed below; proceed without asking. The `/add-component` orchestrator owns plan approval for full scaffolds.

---

## Step 1 — Check for existing component

```sh
ls packages/core/src/<ComponentName>/<ComponentName>.tsx packages/agents/src/<ComponentName>/<ComponentName>.tsx 2>/dev/null
```

If any output is produced, **stop immediately** and respond:

```
## Already exists: <ComponentName>

`<path shown in ls output>` already exists.
Use `/update-component <ComponentName>` to audit and update it instead.
```

Do not read, write, or modify any files.

## Step 2 — Read context

Skip anything already in context from earlier in this conversation:

- `.claude/skills/shared/references/conventions.md` — file layout, package inference, import/export/token rules
- `.claude/skills/shared/references/aria-patterns.md` — ARIA pattern per component type, MCP states
- `packages/<package>/src/index.ts` — current export pattern
- One existing component source in the target package (e.g. `packages/agents/src/ThinkingIndicator/ThinkingIndicator.tsx`) — code style

## Step 3 — Create the source file

File: `packages/<package>/src/<ComponentName>/<ComponentName>.tsx`

Requirements (all MUST):

- Functional component, named export (no default export)
- Export the props interface: `export interface <ComponentName>Props { ... }`
- All color values reference Chakra semantic tokens — no hardcoded hex
- The component must render correctly in both light and dark schemes: semantic tokens only, no color-mode reads, no raw palette exports; any new token gets both `_dark` and `_light` values per the shared conventions Theming section
- All timing values reference `duration.*` tokens from `@agentic-ds/tokens`
- If the component displays status or live-updating content, include the correct ARIA live region per `shared/references/aria-patterns.md`
- If the component has interactive expand/collapse, the trigger MUST be a `<button>` with `aria-expanded` + `aria-controls`
- Animated decorative elements MUST be `aria-hidden="true"`; gate animations with `useReducedMotion` from `@agentic-ds/core`
- If the component is a status/progress surface, support all 6 MCP states: `idle`, `running`, `waiting`, `done`, `error`, `cancelled`

## Step 4 — Add exports

1. Create `packages/<package>/src/<ComponentName>/index.ts`:

```ts
export * from './<ComponentName>'
```

2. Update `packages/<package>/src/index.ts`:

```ts
export { <ComponentName> } from './<ComponentName>'
export type { <ComponentName>Props } from './<ComponentName>'
```

## Step 5 — Report

```
## Source created: <ComponentName>

**Package:** core | agents
**Files:**
- packages/<package>/src/<ComponentName>/<ComponentName>.tsx
- packages/<package>/src/<ComponentName>/index.ts
- packages/<package>/src/index.ts (updated)
- packages/tokens/src/index.ts + packages/core/src/theme.ts (updated — only if new tokens were added)
**ARIA pattern:** <pattern or "none">
**MCP states:** <list or "n/a">
**Theming:** existing semantic tokens | new tokens added: <list, noting dark + light values>
```

If invoked standalone (not from `/add-component`), remind the user of the follow-ups: `/add-component-story`, `/add-component-tests`, `/add-component-spec`, then `/verify-component`.

To score this run against known test cases, see `evals/evals.json`.
