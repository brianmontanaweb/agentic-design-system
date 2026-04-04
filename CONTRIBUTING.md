# Contributing to Agentic Design System

Thanks for your interest in contributing. This library is purpose-built for agentic AI UIs, and contributions that improve accessibility, MCP lifecycle coverage, and component quality are especially welcome.

## Before You Start

- Read [CLAUDE.md](CLAUDE.md) for the monorepo structure and rules.
- Read [docs/best-practices.md](docs/best-practices.md) — the authoritative standard for all component work.
- Check the [Known Issues](README.md#known-issues--open-discussion) section in the README for tracked gaps that are good first contributions.

## Contributor License Agreement

All contributors must agree to the [CLA](CLA.md) before a pull request can be merged. You agree by checking the CLA checkbox in the PR template when opening a pull request — no separate signature needed.

## Development Setup

```sh
# Node 22+ required (.nvmrc is present)
node --version

npm install

# Build all packages (tokens → core → agents)
npm run build

# Start Storybook for component development
npm run storybook

# Lint (ESLint + tsc --noEmit across all packages)
npm run lint

# Format
npm run format
```

## Making Changes

### Adding a component

Use the `/add-component` skill if you have Claude Code installed:

```
/add-component MyComponent agents
```

Otherwise, follow the pattern in `packages/agents/src/` — source file, Storybook story, spec doc in `docs/components/`, and index export.

### Modifying an existing component

Use the `/update-component` skill if available, or follow these rules:

- All styles must use tokens — no hardcoded hex values or `px` values outside of layout.
- New tokens belong in `packages/tokens/src/index.ts` before use.
- ARIA requirements per component are defined in [CLAUDE.md](CLAUDE.md) and [docs/best-practices.md](docs/best-practices.md) — these are non-negotiable.
- All animated components must include a `prefers-reduced-motion` override.

### Adding a token

Tokens live in `packages/tokens/src/index.ts`. Follow the existing naming convention — names communicate intent, not raw values (e.g., `color.agent.status.running`, not `accentBlue`).

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for versioning. Every PR that changes published package behaviour (any file under `packages/`) must include a changeset.

```sh
# Create a changeset describing your change
npm run changeset
```

Choose the affected packages and bump type (`patch`, `minor`, `major`) when prompted. Commit the generated `.changeset/*.md` file with your PR.

PRs that only change `apps/`, `docs/`, or tooling do not need a changeset.

## Pull Request Guidelines

- Keep PRs focused — one concern per PR.
- PRs must pass all CI checks: lint, build, and visual regression tests.
- Every new component variant needs a Storybook story before the PR is considered done.
- Fix pre-existing lint violations in files you touch — do not add `eslint-disable` comments.
- Do not amend or force-push commits on a PR after review has started — add new commits instead.

## Commit Style

Use the conventional commits format:

```
feat(agents): add waiting state to AgentStatus
fix(core): replace native disabled with aria-disabled on Button
docs: add ToolCallCard spec
chore: bump @changesets/cli
```

Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`.

## Reporting Issues

Please use [GitHub Issues](https://github.com/brianmontanaweb/agentic-design-system/issues) and include:

- Component name and version
- Steps to reproduce
- Expected vs. actual behavior
- Browser/screen reader if it's an accessibility issue
