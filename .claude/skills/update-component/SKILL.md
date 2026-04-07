---
name: update-component
description: Audit and update an existing component — source, story, and spec doc — fixing pre-existing violations, story gaps, and spec drift. Always plans changes and waits for approval before writing any files. Use when: (1) user invokes /update-component, (2) a component has been modified and needs to be brought up to standard, (3) user asks to fix, update, or improve a specific existing component.
compatibility: Designed for Claude Code. Figma MCP is used for the optional design review step (step 3).
metadata:
  argument-hint: "<ComponentName>"
---

# Update Component

Audit and update an existing component given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

These defuse the most common mistakes before you encounter them:

- **Read `references/violation-criteria.md` once in Step 2** — it stays in context for Steps 4–6; do not re-read it.
- **Figma is optional** — if the user skips the link, mark "Figma: skipped" in the plan and proceed immediately; never block on it.
- **`color.on.accent` is not a hex violation** — it is a Chakra semantic token name; do not flag it as a hardcoded color.
- **`import React` in source files is valid** when `React.*` type annotations appear (e.g. `React.ReactElement`, `React.MouseEvent`); only flag the default import in story files where no `React.*` types are used.
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

If no Figma link was provided, ask:

> Please provide the Figma link for the **\<ComponentName\>** component node (skip if unavailable).

If the user skips, note **Figma: skipped** in the plan and proceed.

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

Run a focused accessibility check against the source and story using the WCAG 2.2 AA criteria in `docs/best-practices.md`. This is separate from the structural checks in Step 3 — look specifically for:

- Missing accessible names (no `children`, no `aria-label`, no `aria-labelledby`)
- Contrast violations (reference token values from `packages/tokens/src/index.ts` and `packages/core/src/theme.ts`)
- Interactive elements unreachable by keyboard
- Focus management issues (modals, drawers, popovers trapping or releasing focus incorrectly)
- Missing or incorrect `role` values
- `aria-*` attributes set to incorrect values or applied to wrong elements

Collect all findings into a separate **A11y Report** list with WCAG SC references.

---

## Step 8 — Present the plan and wait for approval

Output a structured plan using the sections below. Do not write any files yet.

```
## Update plan: <ComponentName>

### Figma conflicts
<table of property / Figma value / current code value for each conflict>
— or —
No conflicts found.

Resolve all conflicts before I proceed. For each: is Figma correct, code correct, or neither?

### Source changes (`packages/<package>/src/<ComponentName>.tsx`)
<bullet list of every change — be specific: old value → new value>
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
<numbered list of violations with WCAG SC reference>
— or —
No violations found.

Do you want me to fix the a11y violations as part of this update? (yes / no / some — list which ones)
```

**Wait for the user's response before proceeding.**

If the user says **yes** — add the a11y fixes to the source changes plan.
If the user says **no** — proceed without them.
If the user says **some** — incorporate only the listed fixes.

Then confirm: "Ready to apply these changes — shall I proceed?"

**Wait for final approval before writing any files.**

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

To score this run against known test cases, see `evals/evals.json` (agentskills.io format) or the human-readable `references/eval-rubric.md`.
