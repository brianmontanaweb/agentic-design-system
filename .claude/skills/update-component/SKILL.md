---
name: update-component
description: Audit and update an existing component — source, story, and spec doc — fixing pre-existing violations, story gaps, and spec drift. Plans changes first and waits for approval before writing. Use when a component has been modified or needs to be brought up to standard.
argument-hint: "<ComponentName>"
---

# Update Component

Audit and update an existing component given `$ARGUMENTS` in the format `<ComponentName>`.

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

## Step 2 — Fetch the Figma component node

Ask the user for the Figma component node link if not already provided:

> Please provide the Figma link for the **\<ComponentName\>** component node so I can compare the current implementation against the design.

Use the `get_file_nodes` tool to fetch the node, then extract all design values per `docs/best-practices.md` section 8. Record any conflicts between Figma and the current implementation — these will be surfaced in the plan (Step 7) before any files are written.

## Step 3 — Read everything

Read all three files in full, plus:

- `docs/best-practices.md` — authoritative standard for this codebase, including section 8 (Figma MCP Usage)
- `packages/<package>/src/index.ts` — to check the export is current
- `packages/tokens/src/index.ts` — to verify any token references used in the source

---

## Step 4 — Analyse: source violations

Check the source file for every item below. Record each violation found.

**Tokens**
- [ ] Hardcoded hex color literals (any `#rrggbb`, `#rgb`, `#rrggbbaa`) — replace with semantic tokens from `@agentic-ds/tokens`
- [ ] Hardcoded `px` timing values — replace with `duration.*` tokens
- [ ] Any raw CSS color keyword (`red`, `blue`, etc.) not routed through a token

**ARIA / accessibility**
- [ ] `StreamingText` — must have `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
- [ ] `ThinkingIndicator` — must have `role="status"` + `aria-live="polite"`
- [ ] `AgentStatus` — must have `role="status"` + `aria-live="polite"` + visually-hidden status text
- [ ] `MessageThread` — must have `role="log"` + `aria-label`
- [ ] Any expand/collapse trigger — must be `<button>` with `aria-expanded` + `aria-controls` (not `<div>` or `<span>`)
- [ ] `ProgressSteps` — must have `role="list"` + `aria-current="step"` on the active item
- [ ] Animated decorative elements — must be `aria-hidden="true"`

**MCP lifecycle states** (for `AgentStatus` and `ProgressSteps` only)
- [ ] All 6 states supported: `idle`, `running`, `waiting`, `done`, `error`, `cancelled`

**CSS scoping**
- [ ] All styles scoped to `[data-agentic-ds]` — not `:root`

**Code quality**
- [ ] No `any` types
- [ ] No unused vars or imports
- [ ] Props interface is exported alongside the component

---

## Step 5 — Analyse: story gaps

Compare the story file against the source. Record every gap found.

- Missing story for a `variant` or `size` value
- Missing story for a named state (`loading`, `disabled`, `error`, `cancelled`, `waiting`, etc.)
- Stories that reference props that no longer exist in the source
- Story title format incorrect (`'Core/<ComponentName>'` or `'Agents/<ComponentName>'`)
- Explicit `React` import present (jsx-runtime transform — remove it)

---

## Step 6 — Analyse: spec doc drift

Compare `docs/components/<ComponentName>.md` against the source. Record every drift found.

- Props table missing entries that exist in the source
- Props table contains entries that no longer exist in the source
- Prop types, defaults, or descriptions that don't match the implementation
- Variants or states table out of sync with the source
- YAML frontmatter `tokens` list incomplete or stale
- `mcp-states` frontmatter missing or incomplete (for `AgentStatus` / `ProgressSteps`)
- Implementation notes that contradict current code

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

Fix any errors that arise — do not use `eslint-disable` comments. If a fix is non-trivial, describe what you changed and why.

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
```
