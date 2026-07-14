---
'@agentic-ds/agents': minor
---

Add `data-status="<status>"` to `ToolCallCard`, `AgentStatus`, and `ProgressSteps` (per-listitem). Host CSS and Tailwind variants (`data-[status=error]:`) can now target component states without new props, and visual-regression/E2E tests get stable, state-scoped selectors. Purely additive — not an ARIA attribute; the existing visually-hidden text and `aria-current` remain the accessible source of truth for state.
