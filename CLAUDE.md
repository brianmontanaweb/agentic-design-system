# Agentic Design System — Agent Instructions

This is a monorepo for a React design system purpose-built for agentic/MCP applications. Read this file before making any changes.

## Packages

| Package                | Purpose                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| `packages/tokens`      | Design tokens — source of truth for all values                                |
| `packages/core`        | Base components (Button, CodeBlock, AgenticProvider, theme)                   |
| `packages/agents`      | Agent-specific components (streaming, tool calls, status)                     |
| `packages/mcp-builder` | MCP stdio server (get_token, get_component) + IIFE bundle for MCP App iframes |
| `apps/storybook`       | Visual regression tests and component stories                                 |
| `apps/demo-web`        | Integration demo                                                              |

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
- New tokens belong in `packages/tokens/tokens/` (regenerated via `npm run tokens:generate`) before they are used in components: mode-independent tokens and semantic color aliases in `base.json`; color primitives in **both** `color.dark.json` and `color.light.json` under the same key path (generation fails if the key sets differ). `tokens.resolver.json` (DTCG 2025.10 resolver) wires the sets together
- CSS variables, the Chakra `semanticTokens` block in core's `theme.ts`, and the MCP `get_token` index are all derived from the generated `colorModes` map — never hand-edit those mappings

### MCP Lifecycle States

`AgentStatus` and `ProgressSteps` must support all 6 MCP task states: `idle`, `running`, `waiting` (input_required), `done`, `error`, `cancelled`.

### CSS Scoping

All styles must be scoped to `[data-agentic-ds]` — never `:root`. This applies to all build targets including any future IIFE bundle.

### Component Docs

Every implemented component needs a spec file at `docs/components/[ComponentName].md`. See `docs/components/Button.md` for the format. All current components have spec docs.

Spec docs are the single source of truth for the MCP server's component metadata: `packages/mcp-builder/src/metadata/components.ts` is generated from them by `npm run metadata:generate -w packages/mcp-builder` (also runs during that package's build) — never hand-edit it; CI fails if it is stale. The doc format is a parse contract (frontmatter keys, Props table shape, `(required)` markers, union-type value tables) — see the `add-component-spec` skill for the rules; generation fails loudly on violations.

## Known Gaps (Prioritized)

1. `Button` uses native `disabled` instead of `aria-disabled` + `tabIndex={0}`
2. No `ErrorBoundary` or `Skeleton` primitives
3. Zero light-mode visual regression baselines (all 99 are dark-mode captures) — the static stylesheet's `data-color-mode="light"` pin makes capturing them straightforward now

See `PLAN.md` → Known Gaps / Roadmap for the full list, including the Astryx-inspired architecture items.

## Figma

Figma is the authoritative design reference for all component work. Use the Figma MCP when implementing or updating components — see `docs/best-practices.md` section 8 for usage conventions.

## Skills

Invoke with `/skill-name` or `/<skill-name>`:

- `/add-component <ComponentName> [core|agents]` — full component scaffold; plans once, then orchestrates the five sub-skills below
- `/add-component-source <ComponentName> [core|agents]` — source file, barrel index, and package export only
- `/add-component-story <ComponentName>` — Storybook story for an existing component
- `/add-component-tests <ComponentName>` — unit tests for an existing component, run to green
- `/add-component-spec <ComponentName>` — spec doc at `docs/components/<Name>.md` for an existing component
- `/verify-component <ComponentName>` — build + scoped lint + scoped tests for one component; fixes errors in its files
- `/update-component <ComponentName>` — audit and update an existing component; fixes violations, story gaps, and spec doc drift; plans first, waits for approval

## Workflows

- `/audit-a11y` — dynamic workflow (`.claude/workflows/audit-a11y.js`): audits every component against WCAG 2.2 AA with one agent per component, adversarially verifies findings, and returns a single violation report. Report-only. Scope it by passing paths: `Run /audit-a11y on ["packages/agents/src/AgentStatus/AgentStatus.tsx"]`. **When asked to audit accessibility, run a WCAG check, or find a11y violations, launch this workflow — do not audit ad hoc.** Audit criteria: `.claude/skills/shared/references/a11y-audit-criteria.md`. Evals: `.claude/workflows/evals/audit-a11y/`.

## Scaling This CLAUDE.md

The current single-file `CLAUDE.md` works well up to ~5–6 packages. Beyond that, or when packages have meaningfully different conventions, split into path-scoped rules under `.claude/rules/`:

```
.claude/rules/tokens.md       # paths: packages/tokens/src/**
.claude/rules/core.md         # paths: packages/core/src/**
.claude/rules/agents.md       # paths: packages/agents/src/**
.claude/rules/stories.md      # paths: apps/storybook/src/**
```

Path-scoped rules only load when editing matching files, keeping context tight. This `CLAUDE.md` stays as the monorepo-wide entry point. Migrate when a package grows its own distinct conventions that don't apply to the others.

## Linting

Run `npm run lint` from the root. It runs ESLint (flat config in `eslint.config.mjs`) then each package's `tsc --noEmit`.

**Lint is type-aware: run `npm run build` first.** ESLint and `tsc` resolve cross-package imports against sibling `dist/*.d.ts`, so a fresh clone must build before linting (the pre-commit hook assumes this too; pre-push builds automatically).

**Rules enforced:**

- `typescript-eslint` strictTypeChecked + stylisticTypeChecked (projectService) — no `any`, no floating promises, no unsafe `any` flow, consistent type imports, no deprecated APIs
- `@typescript-eslint/explicit-module-boundary-types` (packages only) — exported functions and components declare return types
- `@eslint-react` recommended-type-checked + `react-hooks` — React 19-aware; no leaked conditional renders, no nested component definitions, exhaustive-deps as error
- `eslint-plugin-jsx-a11y` strict — WCAG 2.x coverage; catches missing keyboard handlers, invalid ARIA, non-interactive elements with click handlers
- `eslint-plugin-import-x` — no cycles, no cross-package relative imports, no undeclared dependencies (respects agents' peerDependencies; core's tokens devDep is whitelisted because tsup inlines it)
- `eslint-plugin-storybook` — story conventions
- `no-restricted-syntax` (packages/core, packages/agents only) — bans hardcoded hex colors, rgb()/hsl()/oklch(), and raw timing values in strings **and template literals**; use tokens (`durations.*` for timing)
- `no-restricted-imports` — bans importing `system` from `@agentic-ds/core` or `ChakraProvider` from `@chakra-ui/react` directly (use `<AgenticProvider>`), and deep imports into `@agentic-ds/*/dist` or `/src`
- Unused `eslint-disable` directives and inline config comments are errors

The lint baseline is **zero errors and zero warnings**. Do not add `eslint-disable` comments to silence new findings — fix the underlying issue. The only sanctioned exemptions live in `eslint.config.mjs` with a comment explaining why (e.g. `theme.ts` defines raw color values; mcp-builder's deprecated `Server` usage pending its implementation).

## Testing

- Run visual regression tests: `npm run test:visual`
- Update snapshots after intentional visual changes: `npm run test:visual:update`
- Storybook freezes animations during tests — if adding a new animation, update `apps/storybook/.storybook/test-runner.ts`
- Every new component variant needs a story before it is considered done
