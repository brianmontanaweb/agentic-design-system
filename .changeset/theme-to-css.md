---
'@agentic-ds/core': minor
'@agentic-ds/tokens': patch
---

Add `themeToCss()` to `@agentic-ds/core` — turns `defineAgenticTheme()` options into a static `--ds-*` color stylesheet, scoped to the same selector the runtime theme uses. Branded CSP-strict embeds (`style-src` without `unsafe-inline`) can now generate a per-theme stylesheet at their own build time and link it alongside the base `@agentic-ds/mcp-builder/iife/css` artifact, instead of being limited to the stock theme.

`@agentic-ds/tokens`: generalized the CSS custom-property helpers in `css.ts` (`colorModeVariables`, `colorSchemeCss`) to accept any path → `{ dark, light }` map and selector, not just the stock `colorModes` under `[data-agentic-ds]`, so `themeToCss()` reuses the same naming and cascade logic instead of re-deriving it.
