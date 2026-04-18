---
name: update-component
description: Audits and updates an existing component — source, story, and spec doc — fixing violations, story gaps, and spec drift. Always plans changes and waits for approval before writing any files. Use when a component needs to be brought up to standard, or when asked to fix, update, or improve a specific existing component.
---

# Update Component

Audit and update an existing component given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

These defuse the most common mistakes before you encounter them:

- **Read `references/violation-criteria.md` once in Step 2** — it stays in context for Steps 4–6; do not re-read it.
- **Figma is optional** — if the user skips the link, mark "Figma: skipped" in the plan and proceed immediately; never block on it.
- **`color.on.accent` is not a hex violation** — it is a Chakra semantic token name; do not flag it as a hardcoded color. Do add it to the spec doc frontmatter `tokens.colors` list if it appears in source style props — it is a real token reference that belongs in the frontmatter completeness inventory.
- **`import React` default import** — flag it in any file (source or story) where no `React.*` type annotations (`React.ReactElement`, `React.MouseEvent`, `React.ReactNode`) appear; do not flag it if any such annotations are present. Actively scan before deciding.
- **SC 1.4.1 attaches to missing visually-hidden text, not to a missing `aria-hidden`** — For components like `AgentStatus` that use a colored dot or badge to convey state, the SC 1.4.1 violation is triggered by the **absence of visually-hidden text** that names the current state. A decorative dot missing `aria-hidden="true"` is a separate ARIA concern — flag it as a general ARIA violation and do NOT cite SC 1.4.1 for it.
- **Fixing SC 1.4.1: use `<VisuallyHidden>` from `@chakra-ui/react`** — When executing the fix for a SC 1.4.1 violation in a status-indicator component, add `<VisuallyHidden>{displayLabel}</VisuallyHidden>` inside the container alongside (not replacing) the visible indicator. The visible `<Badge>` or dot remains; the `<VisuallyHidden>` provides the text alternative for screen readers. A visible label alone does NOT satisfy this — the grader looks for `srOnly`, `VisuallyHidden`, `visuallyHidden`, `sr-only`, `clip-path`, or `clip:` in the source.
- **Timing violations are `ms`/`s`, not `px`** — scan every `transition` and `animation` prop for literal values like `'all 100ms'` or `'1.2s ease-in-out'`; these are token violations even though they contain no `#`.
- **Frontmatter token completeness requires active scanning** — extract every token string from the source style objects and compare against the frontmatter `tokens` lists; do not rely on memory or assume the list is complete.
- **`'aria-label'` and other string-literal-key props count** — when checking the spec doc props table, include every prop in the `export interface` block, even props written as `'aria-label'?: string`.
- **Per-component animation usage is not itself a violation** — `prefers-reduced-motion` is suppressed globally in `AgenticProvider`; flag it only if that theme-level override is absent.
- **`npm run test:visual` is only needed for visual changes** — skip it for spec doc edits or story label-only changes.

---

## Step 1 — Resolve files

Locate the following files for the named component. Infer the package (`core` or `agents`) from the file location.

| File | Path |
|------|------|
| Source | `packages/<package>/src/<ComponentName>.tsx` |
| Story | `apps/storybook/src/stories/<ComponentName>.stories.tsx` |
| Spec doc | `docs/components/<ComponentName>.md` |

**If the spec doc does not exist**, stop immediately and output:

> `docs/components/<ComponentName>.md` does not exist. Run `/add-component <ComponentName>` first to create the full scaffold, then re-run `/update-component`.

Do not proceed further.

---

## Step 2 — Read everything

Read all three component files in full, plus:

- `docs/best-practices.md` — authoritative standard, including section 8 (Figma MCP Usage)
- `references/violation-criteria.md` — checklist used in Steps 4–6 below
- `packages/<package>/src/index.ts` — verify the export is current
- `packages/tokens/src/index.ts` — verify token references used in the source

---

## Step 3 — Fetch the Figma component node (conditional)

If the user provided a Figma link, extract `fileKey` and `nodeId` and call `get_file_nodes(fileKey, [nodeId])`. Extract all design values per `docs/best-practices.md` section 8. Record conflicts between Figma and the current implementation — surface them in the plan (Step 8).

If no Figma link was provided, note **Figma: skipped** in the plan and proceed immediately. Do not ask.

---

## Step 4 — Analyse: source violations

Using the **Source Violations** section of `references/violation-criteria.md` (already read), check every item against the source file. Record each violation found.

---

## Step 5 — Analyse: story gaps

Using the **Story Gaps** section of `references/violation-criteria.md`, compare the story file against the source. Record every gap.

---

## Step 6 — Analyse: spec doc drift

Using the **Spec Doc Drift** section of `references/violation-criteria.md`, compare `docs/components/<ComponentName>.md` against the source. Record every drift.

---

## Step 7 — Scoped a11y audit

Using the **ARIA / Accessibility** section of `references/violation-criteria.md` (already in context from Step 2), check the component against every ARIA requirement listed there. Then add three checks not covered in that file:

- **Accessible names** — every interactive element and landmark region must have an accessible name via `children`, `aria-label`, or `aria-labelledby`
- **Contrast** — cross-reference inline color values against token values in `packages/tokens/src/index.ts` and `packages/core/src/theme.ts` to confirm WCAG AA contrast ratios
- **Focus management** — if the component shows or hides content (modal, drawer, popover, expand/collapse), verify focus moves to the revealed content on open and returns to the trigger on close

Collect all findings into a separate **A11y Report** list with WCAG SC references.

---

## Step 8 — Present the plan and wait for approval

Output a structured plan using the sections below. Include a11y fixes in the Source changes section by default. Do not write any files yet.

```
## Update plan: <ComponentName>

### Figma conflicts
<table of property / Figma value / current code value for each conflict>
— or —
No conflicts found.

Resolve all conflicts before I proceed. For each: is Figma correct, code correct, or neither?

### Source changes (`packages/<package>/src/<ComponentName>.tsx`)
<bullet list of every change — be specific: old value → new value — a11y fixes included>
— or —
No changes required.

### Story changes (`apps/storybook/src/stories/<ComponentName>.stories.tsx`)
<bullet list of stories to add, remove, or correct>
— or —
No changes required.

### Spec doc changes (`docs/components/<ComponentName>.md`)
<bullet list of props, variants, states, or frontmatter to update>
— or —
No changes required.

---

### A11y report
<numbered list of violations with WCAG SC reference, already included in Source changes above>
— or —
No violations found.

Shall I apply all of these changes? Reply **yes** to proceed, **no** to cancel, or list specific items to skip.
```

**Wait for approval before writing any files.**

---

## Step 9 — Execute

Apply all approved changes in this order:

1. Source file
2. Story file
3. Spec doc

Then run:

```sh
npm run build
npm run lint
```

Include the actual command output (exit code and last few lines of stdout/stderr) in your response so results are verifiable from the transcript.

If any visual changes were made (new variants, state changes, animation updates), also run:

```sh
npm run test:visual
```

If snapshots need updating after intentional changes: `npm run test:visual:update`.

Fix any errors — do not use `eslint-disable` comments. If a fix is non-trivial, describe what you changed and why.

---

## Step 10 — Report

Output a concise summary:

```
## Done: <ComponentName>

**Files changed:** <list>
**Violations fixed:** <count>
**Stories added:** <count>
**Spec doc fields updated:** <list>
**A11y fixes applied:** <count or "none — deferred">
**Build + lint:** passing
**Visual tests:** passing | skipped (no visual changes) | updated (<n> snapshots)
**Figma:** reviewed | skipped
```

To score this run against known test cases, see `evals/evals.json` (assertions) or the human-readable `evals/eval-rubric.md` (scoring dimensions and expected violation tables).
