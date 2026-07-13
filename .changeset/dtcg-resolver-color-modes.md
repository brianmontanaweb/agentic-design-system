---
'@agentic-ds/tokens': minor
'@agentic-ds/core': patch
'@agentic-ds/agents': patch
'@agentic-ds/mcp-builder': patch
---

Migrate tokens to DTCG 2025.10 with resolver-based light/dark modes.

Token sources move from `tokens.dtcg.json` to `tokens.resolver.json` + `tokens/` (a mode-independent `base.json` plus `color.dark.json`/`color.light.json` selected by a `color-scheme` modifier). Color tokens are intent-named (`color.surface.base`, `color.accent.interactive`), defined once per mode under identical key paths, and expressed in the 2025.10 value formats (color objects, `{ value, unit }` dimensions/durations, fontFamily arrays). Generation fails if the dark and light key sets differ.

Breaking (tokens): the `colors`, `lightColors`, `stepTints`, and `semanticColors` exports are replaced by a single flat `colorModes` map (`'color.accent.interactive' → { dark, light }`). The CSS custom properties, core's Chakra `semanticTokens` block, and mcp-builder's `get_token` index are all derived from it. Resolved CSS variable values are unchanged; `--ds-font-heading`/`--ds-font-body` are newly emitted.

New: the static stylesheet supports pinning a color scheme via `data-color-mode="light" | "dark"` on the `[data-agentic-ds]` element (OS `prefers-color-scheme` remains the default).
