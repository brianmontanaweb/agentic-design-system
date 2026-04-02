---
name: audit-a11y
description: Audit all agent and core components against WCAG 2.2 AA and the ARIA requirements in docs/best-practices.md. Reports violations with file and line references, does not auto-fix.
---

# Accessibility Audit

Audit every component in `packages/core/src/` and `packages/agents/src/` against the requirements in `docs/best-practices.md`. Report all violations. Do not auto-fix — this skill produces a report only.

## Steps

### 1. Read the standards

Read `docs/best-practices.md` section 2 (Accessibility) in full before auditing anything.

### 2. Audit each component

For each `.tsx` file in `packages/core/src/` and `packages/agents/src/`, check all of the following:

#### Live regions (SC 4.1.3)
- Does the component display status that updates without a page reload?
  - If yes: does it have `role="log"` or `role="status"` and `aria-live`?
  - `StreamingText`, `MessageThread` → require `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
  - `ThinkingIndicator`, `AgentStatus` → require `role="status"` + `aria-live="polite"`

#### Interactive elements (SC 4.1.2)
- Does the component have a clickable non-button element (div, span, HStack with onClick)?
  - If yes: it MUST be a `<button>` or have `role="button"` + `tabIndex={0}` + keyboard handler
  - `ToolCallCard` expand/collapse trigger is a known violation

#### List semantics
- Does the component render a list of items?
  - If yes: does the container have `role="list"` or use `<ul>`/`<ol>`?
  - `ProgressSteps` requires `role="list"` on the container

#### Current step indicator
- Does the component track an active/current item in a sequence?
  - If yes: does the active item have `aria-current="step"` or `aria-current="true"`?
  - `ProgressSteps` active step requires `aria-current="step"`

#### Color as the only indicator (SC 1.4.1)
- Does the component use color alone to convey state (e.g., colored dot)?
  - If yes: is there also a text label or visually-hidden text?
  - `AgentStatus` dot uses color — label text must always be present

#### Decorative animations (SC 1.4.13 + prefers-reduced-motion)
- Does the component have CSS animations?
  - If yes: are animated decorative elements `aria-hidden="true"`?
  - Check: is there a `prefers-reduced-motion` override? (Should be theme-level in AgenticProvider)

#### Focus management (SC 2.4.3)
- If the component expands/collapses or shows/hides content, does focus move appropriately?

### 3. Output a report

Format the report as a markdown table:

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
