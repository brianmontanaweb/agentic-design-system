---
'@agentic-ds/core': minor
---

Unify color-mode switching on the `data-color-mode` attribute; drop next-themes.

`AgenticProvider` now owns color mode: it stamps `data-color-mode="dark" | "light"` on its `[data-agentic-ds]` wrapper — the same signal the static `tokens.css` honors — and the Chakra `_dark`/`_light` conditions match only that attribute. It also sets the CSS `color-scheme` property on the wrapper so UA rendering (scrollbars, form controls) matches the mode within the subtree. The provider no longer mutates the `<html>` class/style or writes localStorage, so mode is fully scoped to the provider's subtree and multiple providers with different schemes can coexist on one page. Hosts that want the page canvas itself to follow the mode set `color-scheme` on their own root (next-themes previously did this globally).

Breaking: the `defaultColorScheme?: 'dark' | 'light'` prop is replaced by the controlled `colorScheme?: 'dark' | 'light' | 'system'` (default `'dark'`). `'system'` follows the OS `prefers-color-scheme` and live-updates; hosts with their own toggle re-render with the new value. Hosts that relied on setting a `.dark`/`.light` class themselves (undocumented) must switch to the `data-color-mode` attribute. `next-themes` is no longer a dependency.
