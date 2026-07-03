---
name: verify-component
description: Builds, lints, and unit-tests a single component's files (source, story, tests) in @agentic-ds/core or @agentic-ds/agents, fixing any errors in those files, and reports verifiable command output. Use to check one component after changes, or as the final step of the /add-component flow.
---

# Verify Component

Build, lint, and test one component given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

- **Run `npm run build` before any lint** — `tsc --noEmit` requires the tokens package to be built first.
- **Scope is this component's files only** — pre-existing violations elsewhere in the repo are not your responsibility and must not block a passing report.
- **Fix, don't suppress** — no `eslint-disable` comments; fix the underlying issue in the component's files.
- **Only verify files that exist** — skip the story or test command (and say so) if that file hasn't been created yet; do not create missing files. Point to `/add-component-story` / `/add-component-tests` for gaps.

---

## Step 1 — Resolve files

```sh
ls packages/core/src/<ComponentName>/<ComponentName>.tsx packages/agents/src/<ComponentName>/<ComponentName>.tsx 2>/dev/null
```

If no output, **stop immediately** and respond:

```
## No source: <ComponentName>

Neither package contains `<ComponentName>`. Create it first with
`/add-component-source <ComponentName>` (source only) or `/add-component <ComponentName>` (full scaffold).
```

Infer the package from which path exists, then check which of these also exist:

- `packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx`
- `apps/storybook/src/stories/<ComponentName>.stories.tsx`

## Step 2 — Build, lint, test

Run in order, skipping commands whose target file doesn't exist:

```sh
npm run build
eslint packages/<package>/src/<ComponentName>/<ComponentName>.tsx apps/storybook/src/stories/<ComponentName>.stories.tsx
npx vitest run packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx
```

Fix any errors ESLint or vitest reports on this component's files, then re-run the failed command until it passes. If the build itself fails because of this component's files, fix and re-run; if it fails elsewhere in the repo, report it and stop — that is outside this skill's scope.

Also run the theme-safety check — components must support light/dark via semantic tokens only (see the Theming section of the shared conventions reference):

```sh
grep -nE "lightColors|useColorMode|useTheme" packages/<package>/src/<ComponentName>/<ComponentName>.tsx
```

Any match is a violation (raw single-scheme palette usage or color-mode branching); fix it by routing through semantic tokens. No output = passing.

Include the actual command output (exit code and last few lines of stdout/stderr) in your response so results are verifiable from the transcript.

## Step 3 — Report

```
## Verified: <ComponentName>

**Build:** passing
**Lint:** passing (N files) | skipped: <missing file>
**Theme safety:** passing | fixed: <what was routed through semantic tokens>
**Tests:** passing (N tests) | skipped: no test file — run /add-component-tests <ComponentName>
**Fixes applied:** <list or "none">
```

To score this run against known test cases, see `evals/evals.json`.
