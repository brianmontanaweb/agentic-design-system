## Source Violations

### Tokens
- Hardcoded hex color literals (any `#rrggbb`, `#rgb`, `#rrggbbaa`) — replace with semantic tokens from `@agentic-ds/tokens`
- Hardcoded timing values — any literal `ms` or `s` value in a `transition`, `animation`, or `animationDuration` prop (e.g., `transition: 'all 100ms'`, `animation: \`ds-pulse 1.2s ease\``) — replace with `duration.*` tokens. Scan every `transition` and `animation` prop in the source to find these; they will not contain `#`.
- Raw CSS color keywords (`red`, `blue`, etc.) not routed through a token

### ARIA / Accessibility
- `StreamingText` — must have `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
- `ThinkingIndicator` — must have `role="status"` + `aria-live="polite"`
- `AgentStatus` — must have `role="status"` + `aria-live="polite"` + visually-hidden status text
- `MessageThread` — must have `role="log"` + `aria-label`
- Any expand/collapse trigger — must be `<button>` with `aria-expanded` + `aria-controls` (not `<div>` or `<span>`)
- `ProgressSteps` — must have `role="list"` + `aria-current="step"` on the active item
- Animated decorative elements — must be `aria-hidden="true"`

### Motion
- Components with CSS animations (`ThinkingIndicator` pulse, `ToolCallCard` running pulse, `StreamingText` cursor blink, `AgentStatus` running dot) — animations MUST be suppressed via the `prefers-reduced-motion: reduce` override in `AgenticProvider`/`theme.ts`, NOT inline per-component
- If adding a new animation, verify the animation is included in the freeze list in `apps/storybook/.storybook/test-runner.ts` (prevents flaky visual regression snapshots)

### MCP Lifecycle States (`AgentStatus` and `ProgressSteps` only)
All 6 states must be supported: `idle`, `running`, `waiting`, `done`, `error`, `cancelled`

### CSS Scoping
All styles scoped to `[data-agentic-ds]` — not `:root`

### Code Quality
- No `any` types
- No unused vars or imports
  - **Story files:** flag `import React from 'react'` if no `React.*` type annotations appear anywhere in the file — jsx-runtime makes the default import unnecessary
  - **Source files:** `import React from 'react'` is VALID when `React.ReactElement`, `React.MouseEvent`, `React.ReactNode`, or similar `React.*` type annotations are present — do NOT flag this
- Props interface exported alongside the component

---

## Story Gaps

- Missing story for a `variant` or `size` value
- Missing story for a named state (`loading`, `disabled`, `error`, `cancelled`, `waiting`, etc.)
- Stories referencing props that no longer exist in the source
- Story title format incorrect (`'Core/<ComponentName>'` or `'Agents/<ComponentName>'`)
- Explicit `React` import present (jsx-runtime transform handles this — remove it)

---

## Spec Doc Drift

- Props table missing entries — read the full `export interface <ComponentName>Props` block in the source; every prop, including those with string-literal keys (e.g., `'aria-label'?: string`), must appear in the spec doc props table
- Props table contains entries that no longer exist in the source
- Prop types, defaults, or descriptions that don't match the implementation
- Variants or states table out of sync with the source
- YAML frontmatter `tokens` list incomplete — extract every semantic token reference from the source (any quoted string in a Chakra style prop that is not `#`-hex), then verify each one appears in the appropriate `tokens.*` list in the frontmatter. Any token used in source but absent from the list is a drift violation.
- `mcp-states` frontmatter missing or incomplete (for `AgentStatus` / `ProgressSteps`)
- Implementation notes or accessibility notes that contradict current code — verify stated prop values (e.g., `tabIndex` values, `aria-disabled` usage) against the actual source implementation
