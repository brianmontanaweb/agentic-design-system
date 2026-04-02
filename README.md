# Agentic Design System

A React component library and design token system built for agentic AI applications — MCP tools, AI chat interfaces, and agent dashboards. Dark-first, TypeScript-first, targeting WCAG 2.2 AA (see [Known Issues](#known-issues--open-discussion)).

## Packages

| Package | Description |
|---|---|
| [`@agentic-ds/tokens`](packages/tokens/) | Framework-agnostic design tokens (JS constants + CSS custom properties) |
| [`@agentic-ds/core`](packages/core/) | Chakra UI v3 theme extension, `AgenticProvider`, and base components |
| [`@agentic-ds/agents`](packages/agents/) | Agent-specific UI primitives (streaming, tool calls, status, threads) |

## Components

### `@agentic-ds/agents`

| Component | Description |
|---|---|
| `AgentStatus` | Lifecycle badge — `idle`, `running`, `done`, `error` with animated dot |
| `ThinkingIndicator` | 3-dot pulse animation for model inference state |
| `ProgressSteps` | Numbered step list with `pending`, `active`, `complete` states |
| `ToolCallCard` | Collapsible card showing tool name, JSON input, and output |
| `StreamingText` | Incrementally renders text with a blinking cursor |
| `MessageThread` | Scrollable message history container with auto-scroll |
| `MessageBubble` | Single message bubble — `user`, `assistant`, `tool` variants |

### `@agentic-ds/core`

| Component | Description |
|---|---|
| `AgenticProvider` | Required root wrapper — scopes theme and CSS tokens |
| `Button` | 4 variants, 3 sizes, loading state, full WCAG AA |
| `CodeBlock` | Themed code display primitive |

## Quickstart

```tsx
import { AgenticProvider, Button } from '@agentic-ds/core'
import {
  AgentStatus,
  MessageThread,
  MessageBubble,
  StreamingText,
  ThinkingIndicator,
} from '@agentic-ds/agents'

export default function App() {
  return (
    <AgenticProvider>
      <AgentStatus status="running" />
      <MessageThread>
        <MessageBubble sender="user" content="Summarize this document." />
        <MessageBubble
          sender="assistant"
          content={<StreamingText text="Here is a summary..." isStreaming />}
        />
      </MessageThread>
      <ThinkingIndicator label="Generating response" />
    </AgenticProvider>
  )
}
```

All components must be rendered inside `<AgenticProvider>`. It scopes the Chakra theme and all CSS custom properties to `[data-agentic-ds]` — styles do not leak into the host application.

## Tokens

Tokens are available as typed JS constants and as CSS custom properties via `getCSSVariables()`.

```ts
import { colors, space, duration, radius } from '@agentic-ds/tokens'

colors.accentBlue   // '#4d9fff'
duration.normal     // '200ms'
radius.md           // '8px'
```

```ts
import { getCSSVariables } from '@agentic-ds/tokens'

// Inject into a style tag for use outside the Chakra context
document.head.insertAdjacentHTML('beforeend', `<style>${getCSSVariables()}</style>`)
```

All token objects are frozen — runtime mutation throws in strict mode.

## Monorepo Structure

```
agentic-design-system/
├── packages/
│   ├── tokens/          # @agentic-ds/tokens
│   ├── core/            # @agentic-ds/core
│   ├── agents/          # @agentic-ds/agents
│   └── mcp-builder/     # MCP Apps bundle target (planned)
├── apps/
│   ├── storybook/       # Component docs and visual regression tests
│   └── demo-web/        # Vite integration demo
├── docs/
│   ├── components/      # Agent-readable component specs
│   └── best-practices.md
├── CLAUDE.md            # Agent instructions for this repo
└── eslint.config.mjs
```

## Development

```sh
npm install

# Build all packages (tokens → core → agents)
npm run build

# Start the demo app
npm run dev -w apps/demo-web

# Start Storybook
npm run storybook

# Lint
npm run lint

# Format
npm run format
```

## Visual Regression Testing

Storybook must be running before running tests.

```sh
# Run in one terminal
npm run storybook

# Run in another terminal
npm run test:visual          # check against baselines
npm run test:visual:update   # regenerate baselines after intentional changes
```

Snapshots are stored in [`apps/storybook/__snapshots__/`](apps/storybook/__snapshots__/). Animations are frozen during capture for deterministic diffs.

## Linting

ESLint 10 flat config enforces:

- `typescript-eslint` strict — no `any`, consistent type imports
- `eslint-plugin-jsx-a11y` strict — WCAG 2.x coverage
- `eslint-plugin-react-hooks` — exhaustive-deps as error
- No hardcoded hex color literals in component packages — use tokens
- No direct `ChakraProvider` or `system` imports — use `<AgenticProvider>`

## Design Decisions

**CSS scoping** — All CSS custom properties are scoped to `[data-agentic-ds]`, not `:root`. Safe to embed in any host app or MCP App iframe.

**Token-driven components** — Components reference semantic tokens, never raw values. Color decisions live in `theme.ts`, not component files.

**No global styles** — The library sets no styles on `body` or any global selector.

**MCP lifecycle** — Components are designed around MCP task states. `AgentStatus` and `ProgressSteps` currently cover `idle`, `running`, `done`, and `error`. The `waiting` (`input_required`) and `cancelled` states from the [MCP 2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25) are not yet implemented.

## Standards

- WCAG 2.2 Level AA
- WAI-ARIA 1.2 patterns for interactive components
- [W3C Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) (migration in progress)
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)

## Known Issues / Open Discussion

These gaps are documented and tracked. Contributions and discussion welcome.

### Accessibility (WCAG 2.2 AA)

The README currently claims AA compliance but the following are not yet implemented:

- **Missing ARIA live regions** — `StreamingText`, `ThinkingIndicator`, `AgentStatus`, and `MessageThread` have no `role="log"` or `role="status"` + `aria-live` attributes. Status changes and streaming content are invisible to screen readers. ([SC 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html))
- **`ToolCallCard` is not keyboard accessible** — The expand/collapse trigger is a `div` with `onClick`, not a `<button>`. Requires `aria-expanded` + `aria-controls` per the [WAI-ARIA Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
- **`ProgressSteps` missing list semantics** — No `role="list"` on the container or `aria-current="step"` on the active item.
- **No `prefers-reduced-motion` support** — Animated components (`ThinkingIndicator`, `AgentStatus` running dot, `ToolCallCard` pulse, `StreamingText` cursor) animate unconditionally with no reduced-motion override in `AgenticProvider` or `theme.ts`.

### MCP Lifecycle Coverage

`AgentStatus` and `ProgressSteps` are missing two MCP task states defined in the [2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25):

- `waiting` — maps to MCP `input_required` (agent paused, needs user input)
- `cancelled` — maps to MCP `cancelled` (explicitly stopped)

The `AgentStatus` component table above should currently read `idle | running | done | error` only.

### Token Format

Tokens are not yet in [W3C DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/) format (`$value`/`$type`/`$description`). This blocks compatibility with Style Dictionary v4 and Tokens Studio pipelines. Migration is in progress.

### Component Spec Docs

Agent-readable spec files (`docs/components/`) only exist for `Button`. The following are missing: `AgentStatus`, `ThinkingIndicator`, `ProgressSteps`, `ToolCallCard`, `StreamingText`, `MessageBubble`, `MessageThread`.

### MCP Apps Bundle

`packages/mcp-builder` is scaffolded but unimplemented. An `iife` bundle is needed for embedding components in MCP App iframes via the `ui://` resource URI scheme.

### `MessageThread` Auto-Scroll Bug

The `useEffect` in `MessageThread` has no dependency array, causing it to fire on every render — not just when children change. Any state update in a parent component forces a scroll to the bottom, making it impossible for users to scroll up to read earlier messages.

### No CI/CD Pipeline

There is no GitHub Actions workflow. Lint, build, and visual regression tests are not run automatically on pull requests. For independently publishable packages this is a significant gap.

### No Storybook Accessibility Addon

`apps/storybook/.storybook/main.ts` has no addons configured. The `@storybook/addon-a11y` addon would catch ARIA violations at the story level automatically, directly supporting the WCAG AA target.

### `getCSSVariables()` Contradicts CSS Isolation Principle

`packages/tokens/src/index.ts` exports a `getCSSVariables()` function that scopes output to `:root {}` — directly contradicting the library's core rule that all styles must be scoped to `[data-agentic-ds]`. Calling it injects globally-scoped CSS variables that leak into host applications.

### `AgenticProvider` Has No `defaultColorScheme` Prop

`defaultTheme="dark"` is hardcoded in `AgenticProvider` with no way for consumers to override it. This makes the provider unsuitable for embedding in light-mode host applications without forking the component.

### `Button` Uses Native `disabled` Instead of `aria-disabled`

The native `disabled` attribute removes the button from the tab order entirely. For agentic UIs where buttons are frequently disabled while waiting for agent output, the preferred pattern is `aria-disabled="true"` with `tabIndex={0}` so the button remains keyboard-discoverable and screen readers can announce its unavailable state.

### No Versioning Strategy

Three independently publishable packages with peer dependency version constraints exist, but there is no documented process for version bumps, no Changesets or semantic-release tooling, and no `CHANGELOG.md`. Coordinated and independent releases are undefined.

### No Error Boundary Component

Agentic UIs have a high failure rate — tool calls fail, APIs time out, streamed output can be malformed. No `ErrorBoundary` or error state primitive exists in the design system to handle these gracefully.

### No Skeleton / Loading Placeholder Components

Agentic UIs are inherently async. There are no `Skeleton` or content placeholder primitives for initial load states before agent output arrives.

### TypeScript Version Mismatch

The root and all packages declare `"typescript": "^6.0.2"` in devDependencies, but `packages/mcp-builder` declares `"typescript": "^5.7.2"`. This creates an inconsistent compiler version across the monorepo.

### No Light Mode Storybook Coverage

`apps/storybook/.storybook/preview.tsx` only registers dark backgrounds (`#0a0a0f`, `#13131a`). The theme fully supports light mode but has zero stories or visual regression baselines testing it.

---

## For AI Agents

See [`CLAUDE.md`](CLAUDE.md) for agent instructions and [`docs/best-practices.md`](docs/best-practices.md) for the full standards reference including ARIA patterns, token naming conventions, and MCP integration requirements.
