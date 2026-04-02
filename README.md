# Agentic Design System

A React component library and design token system built for agentic AI applications — MCP tools, AI chat interfaces, and agent dashboards. Dark-first, TypeScript-first, WCAG 2.2 AA compliant.

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

**MCP lifecycle** — Components are designed around MCP task states. `AgentStatus` and `ProgressSteps` map directly to the `working`, `input_required`, `completed`, `failed`, and `cancelled` states from the [MCP 2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25).

## Standards

- WCAG 2.2 Level AA
- WAI-ARIA 1.2 patterns for interactive components
- [W3C Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) (migration in progress)
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)

## For AI Agents

See [`CLAUDE.md`](CLAUDE.md) for agent instructions and [`docs/best-practices.md`](docs/best-practices.md) for the full standards reference including ARIA patterns, token naming conventions, and MCP integration requirements.
