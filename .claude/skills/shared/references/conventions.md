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

## Theming (light/dark)

Every component must render correctly in both color schemes. Theme support comes entirely from the semantic token layer — components are theme-agnostic by construction:

- Semantic tokens in `packages/core/src/theme.ts` carry both `_dark` and `_light` values; `AgenticProvider` (via `next-themes`) switches them by setting a class on the `[data-agentic-ds]` root. A component that styles only through semantic tokens supports both schemes with zero theme code.
- **Never branch on color mode in component code** — no `useTheme`/`useColorMode` reads, no `scheme === 'dark' ? … : …` conditionals for styling.
- **Never use raw palette exports** (`colors.*`, `lightColors.*` from `@agentic-ds/tokens`) for color styling in a component — they are single-scheme values. They are only consumed by `theme.ts` when defining semantic tokens.

When a component needs a color that has no semantic token yet, add the token in three steps before using it:

1. Add the raw value to **both** `colors` (dark) and `lightColors` (light) in `packages/tokens/src/index.ts`.
2. Add a semantic token in `theme.ts` `semanticTokens.colors` with both `_dark` and `_light` values, named by intent (e.g. `color.agent.status.running`).
3. Reference the semantic token name in the component.

Both scheme values must independently meet WCAG AA contrast against the surfaces they appear on — dark-mode accents are light pastels, light-mode accents are dark; a foreground that passes in one scheme can fail in the other (see the `color.text.on.accent` comment in `theme.ts`).

Storybook: the global `colorScheme` toolbar (`.storybook/preview.tsx`) wraps every story in `AgenticProvider` with the selected scheme — stories never wrap themselves in a provider or hardcode scheme-specific background hexes.

## CSS scoping

All styles must be scoped to `[data-agentic-ds]` — never `:root`.

## Build order

Run `npm run build` before `npm run lint` or any scoped `eslint`/`tsc` — `tsc --noEmit` requires the tokens package to be built first.

## Figma

Figma review is optional. If no Figma link was provided, mark "Figma: skipped" in output and proceed immediately — never block on it, never ask.
