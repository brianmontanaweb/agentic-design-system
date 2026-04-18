---
name: audit-a11y
description: >
  Use this skill when asked to audit, check, review, or report on accessibility compliance of
  components in this codebase — including prompts like "a11y audit", "WCAG check", "screen reader
  review", "are these components accessible", or "find accessibility violations". Reads every .tsx
  file in packages/core/src/ and packages/agents/src/, checks against WCAG 2.2 AA and the
  project's ARIA requirements, and produces a structured violation report with file and line
  references. Does not auto-fix — report only.
compatibility: Designed for the agentic-design-system monorepo. Requires packages/core/src/, packages/agents/src/, and docs/best-practices.md to be present.
---

# Accessibility Audit

Audit every component in `packages/core/src/` and `packages/agents/src/` against the requirements in `docs/best-practices.md`. Report all violations. Do not auto-fix — this skill produces a report only.

---

## Gotchas

These defuse the most common mistakes before you encounter them:

- **Report only — do not modify any files**, even when a fix is obvious.
- **`color.on.accent`, `color.agent.status.*`, and similar names are not hex violations** — only flag `#`-prefixed literal values.
- **`import React` in source files may be valid** — if `React.*` type annotations appear (e.g. `React.ReactElement`, `React.MouseEvent`); only flag the default import in story files where no `React.*` types are used.
- **Per-component animation is not itself a violation** — `prefers-reduced-motion` is suppressed globally in `AgenticProvider`; flag it only if that theme-level override is absent.
- **Always include line numbers** — a violation report without a line reference is not actionable.

---

## Step 1 — Read the standards

Read `docs/best-practices.md` section 2 (Accessibility) in full before auditing any component. This is required — it is the authoritative source for project-specific ARIA rules that go beyond generic WCAG guidance.

## Step 2 — Audit each component

For each `.tsx` file in `packages/core/src/` and `packages/agents/src/`, work through every check below. Mark each item as you go.

**Live regions (SC 4.1.3)**
- [ ] Does the component display status that updates without a page reload?
  - `StreamingText`, `MessageThread` → require `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
  - `ThinkingIndicator`, `AgentStatus` → require `role="status"` + `aria-live="polite"`

**Interactive elements (SC 4.1.2)**
- [ ] Does the component have a clickable non-button element (div, span, HStack with onClick)?
  - MUST be a `<button>` or have `role="button"` + `tabIndex={0}` + keyboard handler
  - `ToolCallCard` expand/collapse trigger is a known violation

**List semantics**
- [ ] Does the component render a list of items?
  - Container MUST have `role="list"` or use `<ul>`/`<ol>`
  - `ProgressSteps` requires `role="list"` on the container

**Current step indicator**
- [ ] Does the component track an active/current item in a sequence?
  - Active item MUST have `aria-current="step"` or `aria-current="true"`

**Color as the only indicator (SC 1.4.1)**
- [ ] Does the component use color alone to convey state (e.g., colored dot)?
  - Must also have a text label or visually-hidden text
  - `AgentStatus` dot uses color — label text must always be present

**Decorative animations**
- [ ] Does the component have CSS animations?
  - Animated decorative elements MUST be `aria-hidden="true"`
  - Check: is there a `prefers-reduced-motion` override at the theme level in `AgenticProvider`?

**Focus management (SC 2.4.3)**
- [ ] If the component expands/collapses or shows/hides content, does focus move appropriately?

## Step 3 — Output a report

Format the report as markdown:

```
## A11y Audit Report — <date>

### Violations

| Component | File | Line | Rule | WCAG SC | Severity |
|---|---|---|---|---|---|
| ToolCallCard | packages/agents/src/ToolCallCard.tsx | 38 | Expand trigger is HStack onClick, not <button> | SC 4.1.2 | High |
| ...

### Passing

| Component | Notes |
|---|---|
| Button | aria-busy, aria-label swap, focusVisible ring all present |
| ...

### Summary

X violations across Y components. Z are High severity.
```

Severity levels:
- **High** — blocks keyboard or screen reader users entirely
- **Medium** — degrades experience for screen reader users
- **Low** — best practice not followed but not a blocker

If `evals/evals.json` exists in the skill directory, read it after producing the report to score your output against known test cases. Each entry specifies an expected violation; check that your report captured it.
