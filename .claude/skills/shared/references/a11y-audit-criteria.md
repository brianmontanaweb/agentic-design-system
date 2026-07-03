# A11y Audit Criteria — Shared Reference

Per-component accessibility audit criteria for WCAG 2.2 AA plus this project's ARIA requirements. Consumed by the `/audit-a11y` workflow (each audit agent applies the full checklist to one component file) and usable by any skill that needs the same checks. If this file is already in context, do not re-read it.

Audits are **report-only**: never modify, create, or delete any file while auditing.

## Checks — apply every category to the component

**Live regions (SC 4.1.3)**

- Does the component display status that updates without a page reload?
  - Sequential content (`StreamingText`, `MessageThread`) → requires `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
  - Status indicators (`ThinkingIndicator`, `AgentStatus`) → require `role="status"` + `aria-live="polite"`

**Interactive elements (SC 4.1.2)**

- Does the component have a clickable non-button element (`div`, `span`, `HStack` with `onClick`)?
  - MUST be a `<button>` or have `role="button"` + `tabIndex={0}` + keyboard handler
  - Expand/collapse triggers MUST additionally have `aria-expanded` + `aria-controls`

**List semantics**

- Does the component render a list of items?
  - Container MUST have `role="list"` or use `<ul>`/`<ol>` (`ProgressSteps` requires `role="list"`)

**Current step indicator**

- Does the component track an active/current item in a sequence?
  - Active item MUST have `aria-current="step"` or `aria-current="true"`

**Color as the only indicator (SC 1.4.1)**

- Does the component use color alone to convey state (e.g., colored dot)?
  - Must also have a text label or visually-hidden text naming the state

**Decorative animations**

- Does the component have CSS animations?
  - Animated decorative elements MUST be `aria-hidden="true"`
  - `prefers-reduced-motion` must be handled at the theme level (`AgenticProvider`/`theme.ts`)

**Focus management (SC 2.4.3)**

- If the component expands/collapses or shows/hides content, does focus move appropriately?

## False-positive traps — do NOT flag these

- **Semantic token names are not hex violations** — `color.on.accent`, `color.agent.status.*`, and similar dotted names are Chakra semantic tokens; only `#`-prefixed literal values are hardcoded-color violations.
- **`import React` in source files may be valid** — if `React.*` type annotations appear (e.g. `React.ReactElement`, `React.MouseEvent`), the default import is required; only flag it where no `React.*` types are used.
- **Per-component animation is not itself a violation** — `prefers-reduced-motion` is suppressed globally in `AgenticProvider`/`theme.ts`; flag animation handling only if that theme-level override is absent from the codebase.
- **`VisuallyHidden` usage is not a violation** — it is the prescribed mechanism for SC 1.4.1 text alternatives.

## Severity levels

- **High** — blocks keyboard or screen reader users entirely
- **Medium** — degrades experience for screen reader users
- **Low** — best practice not followed but not a blocker

## Finding requirements

Every violation must carry: component name, repo-relative file path, 1-indexed line number, a one-sentence rule statement, the WCAG SC reference (e.g. `SC 4.1.2`), a severity, and a short evidence quote from the source. A finding without a line number is not actionable and must not be reported.
