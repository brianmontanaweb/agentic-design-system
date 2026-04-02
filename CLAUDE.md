# Agentic Design System — Agent Instructions

This is a monorepo for a React design system purpose-built for agentic/MCP applications. Read this file before making any changes.

## Packages

| Package | Purpose |
|---|---|
| `packages/tokens` | Design tokens — source of truth for all values |
| `packages/core` | Base components (Button, CodeBlock, AgenticProvider, theme) |
| `packages/agents` | Agent-specific components (streaming, tool calls, status) |
| `packages/mcp-builder` | MCP Apps bundle target — currently unimplemented |
| `apps/storybook` | Visual regression tests and component stories |
| `apps/demo-web` | Integration demo |

Build order is enforced: `tokens → core → agents`. Always run `npm run build` from the root.

## Best Practices

**Before implementing or modifying any component, read [`docs/best-practices.md`](docs/best-practices.md).** It is the authoritative standard for this codebase. Key rules summarized below.

### Accessibility — Non-Negotiable

All components must meet WCAG 2.2 AA. Agent-specific components have specific ARIA requirements:

- `StreamingText` → `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
- `ThinkingIndicator` → `role="status"` + `aria-live="polite"`
- `AgentStatus` → `role="status"` + `aria-live="polite"` + visually-hidden text
- `MessageThread` → `role="log"` + `aria-label`
- `ToolCallCard` expand/collapse trigger → must be `<button>` with `aria-expanded` + `aria-controls`
- `ProgressSteps` → `role="list"` + `aria-current="step"` on active item
- All animated components must respect `prefers-reduced-motion`

### Tokens

- No hardcoded hex values, px values (outside layout), or timing values in components — use tokens
- Token names communicate intent, not raw values: `color.agent.status.running` not `accentBlue`
- The `statusColors` record in `ToolCallCard.tsx` is a known violation — fix it when touching that file
- New tokens belong in `packages/tokens/src/index.ts` before they are used in components

### MCP Lifecycle States

`AgentStatus` and `ProgressSteps` must support all 6 MCP task states: `idle`, `running`, `waiting` (input_required), `done`, `error`, `cancelled`. `waiting` and `cancelled` are currently missing.

### CSS Scoping

All styles must be scoped to `[data-agentic-ds]` — never `:root`. This applies to all build targets including any future IIFE bundle.

### Component Docs

Every implemented component needs a spec file at `docs/components/[ComponentName].md`. See `docs/components/Button.md` for the format. Currently missing: `AgentStatus`, `ThinkingIndicator`, `ProgressSteps`, `ToolCallCard`, `StreamingText`, `MessageBubble`, `MessageThread`.

## Known Gaps (Prioritized)

1. ARIA live regions missing on `StreamingText`, `ThinkingIndicator`, `AgentStatus`, `MessageThread`
2. `ToolCallCard` expand trigger is a `div` — must be `<button>`
3. No `prefers-reduced-motion` override in `AgenticProvider` theme
4. `waiting` + `cancelled` states missing from `AgentStatus` and `ProgressSteps`
5. `statusColors` in `ToolCallCard.tsx` uses hardcoded hex — replace with semantic tokens
6. Tokens are pre-DTCG format — migration to W3C DTCG 2025.10 needed
7. `mcp-builder` package has no implementation

## Linting

Run `npm run lint` from the root. It runs ESLint (flat config in `eslint.config.mjs`) then each package's `tsc --noEmit`.

**Rules enforced:**
- `typescript-eslint` strict + stylistic — no `any`, consistent type imports, unused vars
- `eslint-plugin-jsx-a11y` strict — WCAG 2.x coverage; catches missing keyboard handlers, invalid ARIA, non-interactive elements with click handlers
- `eslint-plugin-react` + `react-hooks` — hooks rules, exhaustive-deps as error
- `eslint-plugin-storybook` — story conventions
- `no-restricted-syntax` (packages/core, packages/agents only) — bans hardcoded hex color literals; use tokens
- `no-restricted-imports` — bans importing `system` from `@agentic-ds/core` or `ChakraProvider` from `@chakra-ui/react` directly; use `<AgenticProvider>`

**Current known violations (28 errors — pre-existing, to be fixed):**
- `packages/agents/src/AgentStatus.tsx`, `MessageBubble.tsx`, `ProgressSteps.tsx`, `ToolCallCard.tsx` — hardcoded hex colors; replace with semantic tokens
- `apps/demo-web/src/App.tsx`, `apps/storybook/src/stories/MessageThread.stories.tsx` — invalid ARIA role values
- `apps/demo-web/src/main.tsx` — non-null assertion

Do not add `eslint-disable` comments to work around these — fix the underlying issue.

## Testing

- Run visual regression tests: `npm run test:visual`
- Update snapshots after intentional visual changes: `npm run test:visual:update`
- Storybook freezes animations during tests — if adding a new animation, update `apps/storybook/.storybook/test-runner.ts`
- Every new component variant needs a story before it is considered done
