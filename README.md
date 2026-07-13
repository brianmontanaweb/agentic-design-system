# Agentic Design System

[![CI](https://github.com/brianmontanaweb/agentic-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/brianmontanaweb/agentic-design-system/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook&logoColor=white)](https://brianmontanaweb.github.io/agentic-design-system/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA_target-0057b8)](https://www.w3.org/WAI/WCAG22/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A React component library and design token system built for agentic AI applications — MCP tools, AI chat interfaces, and agent dashboards. Dark-first, TypeScript-first, targeting WCAG 2.2 AA (see [Known Issues](#known-issues--open-discussion)).

## Why Agentic DS?

Generic design systems (Radix, Shadcn, MUI) are built for forms, dashboards, and navigation. Agentic UIs have a different set of primitives — streaming text, tool call visualization, multi-step progress, and lifecycle state that changes asynchronously. This library is built around those patterns.

| Problem                                                  | How this library solves it                                                             |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Streaming text needs live region ARIA to be accessible   | `StreamingText` uses `role="log"` + `aria-live` by design                              |
| Agent status changes must be announced to screen readers | `AgentStatus` uses `role="status"` + `aria-live="polite"`                              |
| MCP lifecycle has 6 states generic libs don't model      | Components are built around `idle`, `running`, `waiting`, `done`, `error`, `cancelled` |
| Component styles leak when embedded in MCP App iframes   | All CSS is scoped to `[data-agentic-ds]`, never `:root`                                |
| Dark-first is an afterthought in most systems            | Dark is the default; light mode is a first-class override                              |

## Packages

| Package                                            | Description                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`@agentic-ds/tokens`](packages/tokens/)           | Framework-agnostic design tokens (JS constants + CSS custom properties)                    |
| [`@agentic-ds/core`](packages/core/)               | Chakra UI v3 theme extension, `AgenticProvider`, and base components                       |
| [`@agentic-ds/agents`](packages/agents/)           | Agent-specific UI primitives (streaming, tool calls, status, threads)                      |
| [`@agentic-ds/mcp-builder`](packages/mcp-builder/) | MCP server exposing tokens and component metadata, plus an IIFE bundle for MCP App iframes |

## Components

### `@agentic-ds/agents`

| Component           | Description                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `AgentStatus`       | Lifecycle badge — all 6 MCP states (`idle`, `running`, `waiting`, `done`, `error`, `cancelled`) with animated dot |
| `ThinkingIndicator` | 3-dot pulse animation for model inference state                                                                   |
| `ProgressSteps`     | Numbered step list with `pending`, `active`, `complete`, `waiting`, `cancelled` states                            |
| `ToolCallCard`      | Collapsible card showing tool name, JSON input, and output                                                        |
| `StreamingText`     | Incrementally renders text with a blinking cursor                                                                 |
| `MessageThread`     | Scrollable message history container with auto-scroll                                                             |
| `MessageBubble`     | Single message bubble — `user`, `assistant`, `tool` variants                                                      |

### `@agentic-ds/core`

| Component         | Description                                         |
| ----------------- | --------------------------------------------------- |
| `AgenticProvider` | Required root wrapper — scopes theme and CSS tokens |
| `Button`          | 4 variants, 3 sizes, loading state, full WCAG AA    |
| `CodeBlock`       | Themed code display primitive                       |

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

Tokens are authored in the [W3C DTCG 2025.10 format](https://www.designtokens.org/tr/2025.10/format/) with light/dark modes resolved via the [DTCG Resolver Module](https://www.designtokens.org/tr/drafts/resolver/) (`tokens.resolver.json` + `tokens/`). They are available as typed JS constants and as CSS custom properties via `getCSSVariables()`.

```ts
import { colorModes, spacing, durations, radii } from '@agentic-ds/tokens'

colorModes['color.accent.interactive'] // { dark: '#4d9fff', light: '#2563eb', $type: 'color' }
durations.normal.$value // '200ms'
radii.md.$value // '8px'
```

```ts
import { getCSSVariables } from '@agentic-ds/tokens'

// Inject into a style tag for use outside the Chakra context.
// Output is scoped to [data-agentic-ds] — wrap your app in an element with
// that attribute so the CSS custom properties apply. Colors follow the OS
// prefers-color-scheme; pin a scheme with data-color-mode="light" | "dark".
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
│   └── mcp-builder/     # @agentic-ds/mcp-builder — MCP server for AI tools
├── apps/
│   ├── storybook/       # Component docs and visual regression tests
│   └── demo-web/        # Vite integration demo
├── docs/
│   ├── components/      # Agent-readable component specs
│   └── best-practices.md
├── CLAUDE.md            # Agent instructions for this repo
└── eslint.config.mjs
```

## MCP Server (Claude Code Integration)

`packages/mcp-builder` is a stdio MCP server that gives AI tools (Claude Code, Cursor, etc.) direct access to design tokens and component metadata from this library.

**Tools exposed:**

| Tool            | Description                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `get_token`     | Look up token values by name or partial path — e.g. `"accentBlue"`, `"agent.status"`, `"duration"`                      |
| `get_component` | Get props, types, and ARIA notes for any component. Pass `"*"` to list all.                                             |
| `search`        | Natural-language search across component and token descriptions — e.g. `"show agent progress"`. Returns ranked matches. |

All three tools accept `dense: true` for compact, context-window-friendly output (names, signatures, and values only — no descriptions or prose).

### Setup

**1. Build the server** (included in the root build, or standalone):

```sh
npm run build -w packages/mcp-builder
```

**2. Create `.mcp.json`** at the repo root with your local absolute path (this file is gitignored — each developer creates their own copy):

```json
{
  "mcpServers": {
    "agentic-ds": {
      "command": "node",
      "args": ["/absolute/path/to/agentic-design-system/packages/mcp-builder/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/agentic-design-system` with the actual path on your machine. The project `.claude/settings.json` already sets `"enableAllProjectMcpServers": true` so Claude Code will pick it up without a separate approval step.

**3. Start a new Claude Code session.** MCP servers are initialized at session start — existing sessions will not pick up the change.

Once connected, Claude Code will have `mcp__agentic_ds__get_token`, `mcp__agentic_ds__get_component`, and `mcp__agentic_ds__search` available as tools.

> **Note:** The server resolves `@agentic-ds/tokens` from the monorepo's `node_modules`. Run `npm install` from the repo root before using it, and rebuild after any token changes (`npm run build -w packages/tokens && npm run build -w packages/mcp-builder`).

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

**MCP lifecycle** — Components are designed around the 6 MCP task states from the [MCP 2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25): `idle`, `running`, `waiting` (`input_required`), `done`, `error`, and `cancelled`. `AgentStatus` covers all 6; `ProgressSteps` covers `pending`, `active`, `complete`, `waiting`, and `cancelled`.

## Standards

- WCAG 2.2 Level AA
- WAI-ARIA 1.2 patterns for interactive components
- [W3C Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) (migration in progress)
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)

## Known Issues / Open Discussion

These gaps are documented and tracked. Contributions and discussion welcome.

### `Button` Uses Native `disabled` Instead of `aria-disabled`

The native `disabled` attribute removes the button from the tab order entirely. For agentic UIs where buttons are frequently disabled while waiting for agent output, the preferred pattern is `aria-disabled="true"` with `tabIndex={0}` so the button remains keyboard-discoverable and screen readers can announce its unavailable state.

### No Error Boundary Component

Agentic UIs have a high failure rate — tool calls fail, APIs time out, streamed output can be malformed. No `ErrorBoundary` or error state primitive exists in the design system to handle these gracefully.

### No Skeleton / Loading Placeholder Components

Agentic UIs are inherently async. There are no `Skeleton` or content placeholder primitives for initial load states before agent output arrives.

### No Light Mode Visual Regression Coverage

Storybook has a light/dark color scheme toggle and a light background registered in `preview.tsx`, but all 99 visual regression baselines are dark-mode captures. The theme fully supports light mode with zero baselines testing it.

---

## Agent Skills & Evals

This repo ships Claude Code skills for component authoring, alongside an eval harness that measures skill quality.

### Skills

Available via `/skill-name` in Claude Code:

| Skill                                         | What it does                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| `/add-component <Name> [core\|agents]`        | Full scaffold — plans once, then orchestrates the five sub-skills below         |
| `/add-component-source <Name> [core\|agents]` | Source file, barrel index, and package export only                              |
| `/add-component-story <Name>`                 | Storybook story for an existing component                                       |
| `/add-component-tests <Name>`                 | Unit tests for an existing component, run to green                              |
| `/add-component-spec <Name>`                  | Spec doc at `docs/components/<Name>.md` for an existing component               |
| `/verify-component <Name>`                    | Build + scoped lint + scoped tests for one component; fixes errors in its files |
| `/update-component <Name>`                    | Audits source, story, and spec doc; plans fixes and waits for approval          |

### Workflows

| Workflow      | What it does                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/audit-a11y` | Dynamic workflow (`.claude/workflows/audit-a11y.js`): one audit agent per component, findings adversarially verified, one merged WCAG 2.2 AA violation report |

### Evals

Each skill has an `evals/evals.json` with test cases graded by an LLM judge. The runner at [`scripts/eval-skills.ts`](scripts/eval-skills.ts) uses the [Claude Agent SDK](https://docs.anthropic.com/en/docs/claude-code/sdk) to invoke the skill, then grades each assertion independently.

```sh
npx tsx scripts/eval-skills.ts                          # all skills
npx tsx scripts/eval-skills.ts update-component         # one skill
npx tsx scripts/eval-skills.ts update-component --id 1  # one case
```

Eval design follows Anthropic's guidance on [evaluating agent outputs](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — each case has a specific prompt, graded assertions, and setup/teardown scripts. Setup copies fixture files into the real component paths (`packages/agents/src/`, `apps/storybook/src/stories/`, `docs/components/`) so the skill runs against its normal file resolution logic, including cross-referencing live token and theme files. Teardown uses `git restore` to guarantee a clean state regardless of what the skill did.

Assertions mix recall checks (did the plan catch all violations?) and precision checks (did it avoid false positives?). See [`.claude/skills/update-component/references/eval-rubric.md`](.claude/skills/update-component/references/eval-rubric.md) for scoring dimensions.

---

## For AI Agents

See [`CLAUDE.md`](CLAUDE.md) for agent instructions and [`docs/best-practices.md`](docs/best-practices.md) for the full standards reference including ARIA patterns, token naming conventions, and MCP integration requirements.
