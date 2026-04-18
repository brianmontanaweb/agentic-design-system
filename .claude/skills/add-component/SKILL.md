---
name: add-component
description: Scaffolds a new component in @agentic-ds/core or @agentic-ds/agents, producing the source file, Storybook story, spec doc, and index export — with correct ARIA live regions, semantic tokens, and CSS scoping applied from the start. Use when adding, creating, or scaffolding a new component.
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
- **Agent-specific ARIA is mandatory from the start** — do not scaffold first and audit later; apply the correct live region from step 3 based on component type.
- **Package inference default** — when ambiguous, lean `agents` for status/streaming/tool-related names; lean `core` for anything that reads like a generic UI primitive.
- **`color.on.accent` and similar token names are not hex violations** — only flag `#`-prefixed literal values.
- **Run `npm run build` before `npm run lint`** — `tsc --noEmit` in lint requires the tokens package to be built first.

---

## Step 0 — Check for existing component

Before doing anything else, check whether the component already exists in either package:

```sh
ls packages/core/src/<ComponentName>.tsx packages/agents/src/<ComponentName>.tsx 2>/dev/null
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
- Read one existing component in the target package to understand the code style
- Read `docs/components/Button.md` to understand the spec doc format

## Step 2 — Fetch the Figma component node

If the user provided a Figma component node link in their request, extract `fileKey` and `nodeId` and call `get_file_nodes(fileKey, [nodeId])`. Follow the extraction and conflict resolution process in `docs/best-practices.md` section 8.

If no Figma link was provided, note **Figma: skipped** and proceed immediately. Do not ask.

## Step 3 — Create the component source file

File: `packages/<package>/src/<ComponentName>.tsx`

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

File: `packages/<package>/src/index.ts`

Add:
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

## Step 6 — Create component spec doc

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

## Step 7 — Build and lint

Run in order:
```sh
npm run build
eslint packages/<package>/src/<ComponentName>.tsx apps/storybook/src/stories/<ComponentName>.stories.tsx
```

Only lint the files this skill creates — pre-existing violations in other files are not your responsibility. Fix any errors ESLint reports on your files before finishing. Do not use `eslint-disable` comments.

Include the actual command output (exit code and last few lines of stdout/stderr) in your response so results are verifiable from the transcript.

## Step 8 — Report

Output a concise summary:

```
## Done: <ComponentName>

**Package:** core | agents
**Files created:** <list>
**ARIA pattern:** <pattern applied or "none">
**MCP states:** <list or "n/a">
**Build + lint:** passing
**Figma:** reviewed | skipped
```

To score this run against known test cases, see `evals/evals.json`.
