## Source Violations

### Tokens
- Hardcoded hex color literals (any `#rrggbb`, `#rgb`, `#rrggbbaa`) — replace with semantic tokens from `@agentic-ds/tokens`
- Hardcoded `px` timing values — replace with `duration.*` tokens
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

- Props table missing entries that exist in the source
- Props table contains entries that no longer exist in the source
- Prop types, defaults, or descriptions that don't match the implementation
- Variants or states table out of sync with the source
- YAML frontmatter `tokens` list incomplete or stale
- `mcp-states` frontmatter missing or incomplete (for `AgentStatus` / `ProgressSteps`)
- Implementation notes that contradict current code
