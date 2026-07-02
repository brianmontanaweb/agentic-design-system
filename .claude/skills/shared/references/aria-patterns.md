# ARIA Patterns — Shared Reference

Required ARIA per component type. Apply from the first line of code — never scaffold first and audit later. If this file is already in context from an earlier step in the conversation, do not re-read it.

## Live regions by content type

| Content type                                        | Required pattern                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| Sequential content (streaming text, message thread) | `role="log"` + `aria-live="polite"` + `aria-atomic="false"`            |
| Status indicator                                    | `role="status"` + `aria-live="polite"`                                 |
| Error surface                                       | `role="alert"`                                                         |
| Progress with a measurable value                    | `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax` |
| Step list                                           | `role="list"` + `aria-current="step"` on the active item               |

When color or shape is the only visual state indicator (status dot, badge), also include visually-hidden text naming the current state — omitting it is a WCAG SC 1.4.1 (Use of Color) violation. Use `<VisuallyHidden>` from `@chakra-ui/react` alongside (not replacing) the visible indicator.

## Interactive elements

- Expand/collapse triggers MUST be `<button>` with `aria-expanded` + `aria-controls` — never `<div>` or `<span>`.
- Icon-only interactive components MUST take `aria-label` as a required prop (WCAG SC 4.1.2).
- Animated decorative elements MUST be `aria-hidden="true"`.

## Motion

- `prefers-reduced-motion` suppression is global via `AgenticProvider`/`theme.ts` — do not add per-component media-query overrides; use the `useReducedMotion` hook from `@agentic-ds/core` to gate animations.
- Any new animation must be added to the freeze list in `apps/storybook/.storybook/test-runner.ts` to prevent flaky visual regression snapshots.

## MCP lifecycle states

Status/progress components (`AgentStatus`, `ProgressSteps`, and anything similar) must support all 6 MCP task states: `idle`, `running`, `waiting`, `done`, `error`, `cancelled`.
