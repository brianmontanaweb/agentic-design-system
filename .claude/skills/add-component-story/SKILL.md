---
name: add-component-story
description: Creates or extends the Storybook story for an existing component in @agentic-ds/core or @agentic-ds/agents, covering every prop variant and state. Use when a component needs a story, when backfilling story coverage, or as step 2 of the /add-component flow.
---

# Add Component Story

Create the Storybook story given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

- **Never `import React from 'react'` in story files** — jsx-runtime handles JSX and Storybook's own types cover everything else.
- **Import the component from the package** (`@agentic-ds/core` or `@agentic-ds/agents`), not by relative path — this is the existing story convention.
- **Every variant needs a story before the component is considered done** — enumerate the props interface; do not stop at `Default`.
- **No approval gate** — creating/extending one story file is the whole task; proceed without asking.

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

- `.claude/skills/shared/references/conventions.md` — import rules, file layout
- The component source file — enumerate every prop, variant, enum value, and state
- One existing story in `apps/storybook/src/stories/` (e.g. `ThinkingIndicator.stories.tsx`) — story style
- If `apps/storybook/src/stories/<ComponentName>.stories.tsx` already exists, read it — extend it, don't recreate it

## Step 3 — Create or extend the story

File: `apps/storybook/src/stories/<ComponentName>.stories.tsx`

Requirements:

- Use `import type { Meta, StoryObj } from '@storybook/react'`
- Title format: `'Core/<ComponentName>'` or `'Agents/<ComponentName>'`
- Include a story for every meaningful prop variant and state
- Include a story for every status/state value if the component is stateful
- Do NOT import `React` (jsx-runtime transform is configured)

## Step 4 — Lint the story file

Skip this step when running inside `/add-component` — `verify-component` runs at the end of that flow.

```sh
npm run build
eslint apps/storybook/src/stories/<ComponentName>.stories.tsx
```

(`npm run build` is required first — module resolution needs the package built.) Fix any errors ESLint reports on this file — no `eslint-disable` comments. Pre-existing violations in other files are not your responsibility.

## Step 5 — Report

```
## Story created: <ComponentName>

**File:** apps/storybook/src/stories/<ComponentName>.stories.tsx
**Stories:** <list of exported story names>
**Coverage:** <which props/variants/states are exercised>
**Lint:** passing | skipped (running inside /add-component)
```

To score this run against known test cases, see `evals/evals.json`.
