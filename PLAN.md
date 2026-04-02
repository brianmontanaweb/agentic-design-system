# Agentic Design System — Implementation Plan

## Context

Build a design system tailored for agentic AI applications — usable in any MCP app, web UI, or AI host integration. The system is dark-first, TypeScript-first, and built on Chakra UI v3. It ships as a monorepo of importable packages with a demo app and Storybook docs.

---

## Monorepo Structure

```
agentic-design-system/
├── packages/
│   ├── tokens/          # @agentic-ds/tokens  — design tokens (CSS vars + JS)
│   ├── core/            # @agentic-ds/core    — Chakra theme + base components
│   └── agents/          # @agentic-ds/agents  — agent-specific UI components
├── apps/
│   ├── storybook/       # Component docs (Storybook 10)
│   └── demo-web/        # Vite app: companion web UI demo
├── docs/
│   └── components/      # Agent-readable component specs (Markdown)
├── package.json         # Root npm workspace
├── tsconfig.base.json
└── .prettierrc
```

---

## Packages

### `@agentic-ds/tokens` ✓

Framework-agnostic design tokens exported as CSS custom properties and JS/TS constants.

**Token categories:**

| Category | Tokens |
|---|---|
| Colors (dark-first) | `bg.base`, `bg.surface`, `bg.elevated`, `border.subtle`, `text.primary`, `text.muted`, `accent.blue`, `accent.green`, `accent.amber`, `accent.red` |
| Spacing | 4pt base grid — `space.1` (4px) … `space.16` (64px) |
| Typography | `font.mono`, `font.sans`, size scale, weight scale |
| Motion | `duration.fast` (100ms), `duration.normal` (200ms), `duration.slow` (400ms) |
| Radius | `radius.sm`, `radius.md`, `radius.lg` |

**Build:** `tsup` → ESM + CJS + `.d.ts`

---

### `@agentic-ds/core` ✓ (partial)

Chakra UI v3 theme extension + base component wrappers.

**Theme:**
- Extends Chakra's `createSystem()` with token values
- Dark mode as default semantic layer
- `cssVarsRoot: '[data-agentic-ds]'` — all CSS custom properties scoped to the provider wrapper, not `:root`, so the library does not leak styles into the host application's global scope
- No `globalCss` — libraries must not set styles on `body` or any global selector
- Custom component recipes: Button ✓, Card (planned), Badge (planned)

**Exports:**
- `AgenticProvider` — wraps `ChakraProvider` with the custom theme; renders `<div data-agentic-ds="">` as the CSS vars scope boundary
- `Button` ✓ — 4 variants (solid, outline, ghost, danger), 3 sizes, loading state with width preservation, full WCAG AA accessibility
- `CodeBlock` ✓ — themed code display primitive
- `Card`, `Badge` — planned

**Build:** `tsup` → ESM + CJS + `.d.ts`

---

### `@agentic-ds/agents` ✓

Agent-specific UI primitives. Depends on `@agentic-ds/core`.

| Component | Status | Description |
|---|---|---|
| `AgentStatus` | ✓ | Lifecycle badge: `idle` / `running` / `done` / `error` with color-coded dot |
| `ThinkingIndicator` | ✓ | Animated 3-dot pulse for "model is thinking" state |
| `ProgressSteps` | ✓ | Numbered step list with `pending` / `active` / `complete` states |
| `ToolCallCard` | ✓ | Collapsible card: tool name, input params (JSON), output section |
| `StreamingText` | ✓ | Renders tokens incrementally; blinking cursor |
| `MessageThread` | ✓ | Scrollable message history container with auto-scroll |
| `MessageBubble` | ✓ | Single message: `user` / `assistant` / `tool` role variants |

**Build:** `tsup` → ESM + CJS + `.d.ts`

---

## Apps

### `apps/demo-web` ✓

Vite + React companion web UI:
- Full `MessageThread` + `ToolCallCard` dashboard layout
- Uses `AgenticProvider` directly

### `apps/storybook` ✓

Storybook 10 with `@storybook/react-vite`:
- Stories for all components in `@agentic-ds/agents` and `@agentic-ds/core`
- Dark background by default
- Interactive controls for all props
- Visual regression testing via `@storybook/test-runner` + `jest-image-snapshot`
  - Animations frozen during capture for deterministic diffs
  - Snapshots stored in `apps/storybook/__snapshots__/`
  - `npm run test:visual` to run, `npm run test:visual:update` to regenerate baselines

---

## Docs

### `docs/components/` ✓ (partial)

Agent-readable component specs — Markdown files structured so an LLM can implement a component correctly without follow-up questions. Each file includes:
- YAML frontmatter (component name, package, tokens used, ARIA pattern URL, WCAG level)
- Variants, sizes, and states as tables with explicit requirements (MUST / SHOULD)
- Full prop table with types and defaults
- Accessibility requirements referencing WCAG 2.2 AA and WAI-ARIA APG
- Do / Don't code examples
- Implementation notes scoped to this codebase

| Spec | Status |
|---|---|
| `Button.md` | ✓ |

---

## Toolchain

| Tool | Version | Role |
|---|---|---|
| npm workspaces | — | Package manager + monorepo linking |
| Vite | 8.x | App builds |
| tsup | 8.x | Library builds (ESM + CJS + declarations) |
| TypeScript | 6.x | All packages and apps |
| Storybook | 10.x | Component documentation |
| jest-image-snapshot | 6.x | Visual regression baselines |
| Prettier + ESLint | 3.x / 10.x | Formatting and linting |

---

## Setup Order

1. ✓ Init workspace — root `package.json`, `tsconfig.base.json`, `.prettierrc`
2. ✓ Scaffold packages — `package.json`, `tsconfig.json`, `tsup.config.ts` per package
3. ✓ Scaffold apps — Vite for `demo-web`, Storybook for `apps/storybook`
4. ✓ Implement tokens — `packages/tokens/src/index.ts`
5. ✓ Implement core theme — `createSystem()` extension, `AgenticProvider`, CSS scoping
6. ✓ Implement agent components — all 7 V1 components in `packages/agents`
7. ✓ Implement `Button` in `@agentic-ds/core` with spec doc
8. ✓ Wire `demo-web` — compose full dashboard
9. ✓ Write Storybook stories — one file per component
10. ✓ Add visual regression testing
11. ✓ Make packages independently publishable — peer deps, externals, publishConfig, LICENSE
12. ✓ Strict ESLint — typescript-eslint strict, jsx-a11y strict, no-hardcoded-hex, no-restricted-imports
13. Implement `Card` and `Badge` in `@agentic-ds/core`
14. Write spec docs for all remaining components (AgentStatus, ThinkingIndicator, ProgressSteps, ToolCallCard, StreamingText, MessageBubble, MessageThread)

---

## Known Gaps / Roadmap

### Accessibility (WCAG 2.2 AA)

| Item | Component(s) | Priority |
|---|---|---|
| Replace native `disabled` with `aria-disabled` + `tabIndex={0}` | `Button` | Medium |

### MCP Lifecycle

| Item | Component(s) | Priority |
|---|---|---|
| Implement `packages/mcp-builder` — IIFE bundle for MCP App iframe embedding | `mcp-builder` | Medium |

### Tokens

| Item | Priority |
|---|---|
| Migrate to W3C DTCG 2025.10 format (`$value`, `$type`, `$description`) | Medium |
| Add semantic alias tier — `color.agent.status.*`, `color.tool.status.*`, `color.message.*` | Medium |

### Components

| Item | Priority |
|---|---|
| Implement `Card` and `Badge` in `@agentic-ds/core` | Medium |
| Add `ErrorBoundary` component for agentic error states | Medium |
| Add `Skeleton` / loading placeholder primitives | Medium |
| Add `defaultColorScheme` prop to `AgenticProvider` (currently hardcoded dark) | Medium |

### Infrastructure

| Item | Priority |
|---|---|
| Add light mode backgrounds and stories to Storybook | Medium |
| Add versioning strategy — see discussion below | Medium |

---

## Discussion: Versioning Strategy

The three packages (`@agentic-ds/tokens`, `@agentic-ds/core`, `@agentic-ds/agents`) are independently publishable but have a strict dependency chain. A versioning strategy must handle both coordinated releases (token change that cascades through all three) and isolated releases (a single component fix in `agents`).

**Decision needed:** Changesets vs semantic-release.

### Option A — Changesets

[Changesets](https://github.com/changesets/changesets) is a monorepo-first tool. Contributors add a `.changeset/*.md` file describing what changed and at what semver level. On release, Changesets consumes them to bump versions and generate `CHANGELOG.md`.

| | |
|---|---|
| **Pro** | Built for monorepos — understands inter-package dependencies |
| **Pro** | Humans explicitly declare the impact of each PR (patch/minor/major) |
| **Pro** | Generates per-package `CHANGELOG.md` automatically |
| **Pro** | Supports linked packages (bumping `tokens` can auto-bump `core` and `agents`) |
| **Pro** | GitHub Action available (`changesets/action`) for automated publish on merge |
| **Con** | Requires contributors to add a changeset file in every PR — easy to forget |
| **Con** | One more file to review in PRs |
| **Con** | Setup has more moving parts than semantic-release |

### Option B — semantic-release

[semantic-release](https://semantic-release.gitbook.io) infers version bumps automatically from [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:` prefixes). No manual changeset files — the commit message is the release note.

| | |
|---|---|
| **Pro** | Zero manual steps — fully automated on push to `main` |
| **Pro** | Enforces Conventional Commits discipline (readable git log) |
| **Pro** | No extra PR artifacts |
| **Con** | Monorepo support requires `semantic-release-monorepo` plugin — less mature |
| **Con** | All contributors must follow Conventional Commits strictly; one bad commit message breaks automation |
| **Con** | Inter-package dependency bumps (e.g. bumping `tokens` version in `core`'s peer deps) require extra config |
| **Con** | Less explicit — a commit message typo can result in a wrong semver bump |

### Recommendation

**Changesets** is the better fit for this repo because:

1. The three packages have hard version coupling — `@agentic-ds/agents` peer-depends on `^0.1.0` of `core` and `tokens`. Changesets' linked-packages feature handles this automatically; semantic-release requires manual config.
2. This is a design system with intentional, reviewed releases — the human-in-the-loop of writing a changeset is a feature, not a burden.
3. The [changesets/action](https://github.com/changesets/action) GitHub Action creates a "Version Packages" PR automatically, making releases a one-click merge.

**Conventional Commits** should still be adopted alongside Changesets for log readability, without wiring it to automation.

### Implementation steps (when ready)

1. `npm install -D @changesets/cli`
2. `npx changeset init` — creates `.changeset/config.json`
3. Set `linked` in config to `[["@agentic-ds/tokens", "@agentic-ds/core", "@agentic-ds/agents"]]` for coordinated bumps
4. Add `.github/workflows/release.yml` using `changesets/action`
5. Add `CHANGELOG.md` per package (auto-generated on first release)
6. Document the PR workflow in `CLAUDE.md`: "Run `npx changeset` before opening a PR if your change affects a published package"

---

## Root npm Scripts

```json
{
  "build":              "npm run build -w packages/tokens && npm run build -w packages/core && npm run build -w packages/agents",
  "dev":                "npm run dev --workspaces --if-present",
  "lint":               "npm run lint --workspaces --if-present",
  "storybook":          "npm run dev -w apps/storybook",
  "build-storybook":    "npm run build -w apps/storybook",
  "test:visual":        "npm run test:visual -w apps/storybook",
  "test:visual:update": "npm run test:visual:update -w apps/storybook"
}
```

Build order is explicit (tokens → core → agents) to respect inter-package dependencies.

---

## Verification

| Check | Command |
|---|---|
| Zero TS errors across all packages | `npm run build` |
| Companion web UI hot-reload | `npm run dev -w apps/demo-web` |
| Storybook in dark theme | `npm run storybook` |
| Visual regression baseline | `npm run test:visual:update` (Storybook must be running) |
| Visual regression check | `npm run test:visual` (Storybook must be running) |
