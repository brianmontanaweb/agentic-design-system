# Component Conventions — Shared Reference

Single source of truth for the conventions below. Loaded on demand by `add-component`, `add-component-source`, `add-component-story`, `add-component-tests`, `add-component-spec`, `verify-component`, and `update-component`. If this file is already in context from an earlier step in the conversation, do not re-read it.

## File layout

All files for a component live in `packages/<package>/src/<ComponentName>/`:

| File                       | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `<ComponentName>.tsx`      | Source                                      |
| `<ComponentName>.test.tsx` | Unit tests                                  |
| `<ComponentName>.doc.ts`   | Spec doc — typed `ComponentDoc` object      |
| `index.ts`                 | Barrel: `export * from './<ComponentName>'` |

The package root `packages/<package>/src/index.ts` re-exports from `'./<ComponentName>'`, which resolves to the barrel. Stories live in `apps/storybook/src/stories/<ComponentName>.stories.tsx`. Spec docs are colocated (`<ComponentName>.doc.ts`, not a separate markdown file) and import their schema from `@agentic-ds/component-doc`.

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
- New tokens belong in `packages/tokens/tokens/` (then `npm run tokens:generate`) before they are used in components — never edit `src/generated.ts` directly.

## Theming (light/dark)

Every component must render correctly in both color schemes. Theme support comes entirely from the semantic token layer — components are theme-agnostic by construction:

- Semantic tokens in `packages/core/src/theme.ts` carry both `_dark` and `_light` values; `AgenticProvider` switches them by stamping `data-color-mode` on the `[data-agentic-ds]` root (controlled `colorScheme` prop: `'dark' | 'light' | 'system'`). A component that styles only through semantic tokens supports both schemes with zero theme code.
- **Never branch on color mode in component code** — no `useTheme`/`useColorMode` reads, no `scheme === 'dark' ? … : …` conditionals for styling.
- **Never use the raw `colorModes` export** (from `@agentic-ds/tokens`) to pick one mode's value for color styling in a component — single-scheme reads bypass theme switching. `colorModes` is only consumed by `theme.ts` (to derive semantic tokens) and as static CSS-var fallbacks.

When a component needs a color that has no semantic token yet, add the token in two steps before using it:

1. Add the color under the same key path to **both** `packages/tokens/tokens/color.dark.json` and `color.light.json`, named by intent (e.g. `color.agent.status.running`) — or, for a semantic alias of an existing primitive, to the `color` group in `tokens/base.json`. Run `npm run tokens:generate` (generation fails if the dark and light key sets differ).
2. Reference the token name in the component — the Chakra semantic token and CSS variable are derived automatically.

Both scheme values must independently meet WCAG AA contrast against the surfaces they appear on — dark-mode accents are light pastels, light-mode accents are dark; a foreground that passes in one scheme can fail in the other (see the `color.text.on.accent` `$description` in the token files).

Storybook: the global `colorScheme` toolbar (`.storybook/preview.tsx`) wraps every story in `AgenticProvider` with the selected scheme — stories never wrap themselves in a provider or hardcode scheme-specific background hexes.

## CSS scoping

All styles must be scoped to `[data-agentic-ds]` — never `:root`.

## Build order

Run `npm run build` before `npm run lint` or any scoped `eslint`/`tsc` — `tsc --noEmit` requires the `tokens` and `component-doc` packages to be built first (`<ComponentName>.doc.ts` files import types from `@agentic-ds/component-doc`).

## Figma

Figma review is optional. If no Figma link was provided, mark "Figma: skipped" in output and proceed immediately — never block on it, never ask.
