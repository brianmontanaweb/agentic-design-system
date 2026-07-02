# Component Conventions — Shared Reference

Single source of truth for the conventions below. Loaded on demand by `add-component`, `add-component-source`, `add-component-story`, `add-component-tests`, `add-component-spec`, `verify-component`, and `update-component`. If this file is already in context from an earlier step in the conversation, do not re-read it.

## File layout

All files for a component live in `packages/<package>/src/<ComponentName>/`:

| File                       | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `<ComponentName>.tsx`      | Source                                      |
| `<ComponentName>.test.tsx` | Unit tests                                  |
| `index.ts`                 | Barrel: `export * from './<ComponentName>'` |

The package root `packages/<package>/src/index.ts` re-exports from `'./<ComponentName>'`, which resolves to the barrel. Stories live in `apps/storybook/src/stories/<ComponentName>.stories.tsx`; spec docs in `docs/components/<ComponentName>.md`.

## Package inference

When the target package is not specified:

- Agent-lifecycle, streaming, messaging, tool-call, or status components → `agents`
- General-purpose UI primitives → `core`
- When ambiguous, lean `agents` for status/streaming/tool-related names; lean `core` for anything that reads like a generic UI primitive.

## Imports

- **Source and story files: never `import React from 'react'`** — the jsx-runtime transform handles JSX. When the props interface needs React types, use named type imports: `import type { ReactElement, ReactNode, MouseEventHandler } from 'react'`. Write `leftIcon?: ReactElement`, never `React.ReactElement` — the qualified form requires the default import and triggers a lint violation.
- **Test files DO import React** (`import React from 'react'`) — existing test convention; follow it for consistency.

## Exports

- Functional component, named export — no default export.
- Export the props interface: `export interface <ComponentName>Props { ... }`.

## Tokens

- All color values reference Chakra semantic tokens — no hardcoded hex.
- All timing values reference `duration.*` tokens from `@agentic-ds/tokens` — no literal `ms`/`s` values in `transition`/`animation` props.
- `color.on.accent` and similar dotted token names are **not** hex violations — only `#`-prefixed literal values are.
- New tokens belong in `packages/tokens/src/index.ts` before they are used in components.

## CSS scoping

All styles must be scoped to `[data-agentic-ds]` — never `:root`.

## Build order

Run `npm run build` before `npm run lint` or any scoped `eslint`/`tsc` — `tsc --noEmit` requires the tokens package to be built first.

## Figma

Figma review is optional. If no Figma link was provided, mark "Figma: skipped" in output and proceed immediately — never block on it, never ask.
