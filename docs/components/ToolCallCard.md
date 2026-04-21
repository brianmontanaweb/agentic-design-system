---
component: ToolCallCard
package: "@agentic-ds/agents"
category: display
status: implemented
tokens:
  colors: [color.tool.status.pending, color.tool.status.running, color.tool.status.done, color.tool.status.error, accent.green, accent.red, text.primary, text.muted, bg.surface, bg.elevated, border.subtle]
wcag: AA
aria-pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
---

# ToolCallCard

Collapsible card that shows a single MCP tool invocation — its name, input payload, and output. The header is a button that toggles the detail panel open or closed.

---

## Statuses

| Status    | Dot color token              | Output text color  |
|-----------|-----------------------------|--------------------|
| `pending` | `color.tool.status.pending` | `accent.green`     |
| `running` | `color.tool.status.running` | `accent.green`     |
| `done`    | `color.tool.status.done`    | `accent.green`     |
| `error`   | `color.tool.status.error`   | `accent.red`       |

The `running` status dot animates with `ds-pulse`. `useReducedMotion()` disables the animation.

---

## Props

| Prop          | Type             | Default  | Description                                      |
|---------------|------------------|----------|--------------------------------------------------|
| `toolName`    | `string`         | —        | Name of the tool as invoked (required)           |
| `input`       | `Record<string, unknown>` | — | Input payload; rendered as formatted JSON     |
| `output`      | `string`         | —        | Tool response string                             |
| `status`      | `ToolCallStatus` | `"done"` | Current invocation state                         |
| `defaultOpen` | `boolean`        | `false`  | Initial open state                               |

---

## Accessibility

- The expand/collapse trigger MUST be a `<button>` element. *(WAI-ARIA Disclosure Pattern)*
- The button MUST have `aria-expanded` reflecting the current open state.
- The button MUST have `aria-controls` pointing to the detail panel's `id`.
- The button MUST have an `aria-label` of `"${toolName} details"` — the visible tool name alone is sufficient but the label scopes the action for screen readers.
- The chevron character (`▾` / `▸`) MUST have `aria-hidden="true"` — it is a decorative direction indicator.
- Code blocks (input/output) do not need additional ARIA; `<code>` is semantically sufficient.

---

## Do / Don't

**Do:**
```tsx
<ToolCallCard toolName="get_weather" status="done" input={{ city: 'NYC' }} output="72°F, Sunny" />
<ToolCallCard toolName="run_query" status="error" output="Connection timed out" />
<ToolCallCard toolName="fetch_docs" status="running" />
```

**Don't:**
```tsx
// ❌ Using a div for the trigger — must be a button
<div onClick={toggle}>Tool name</div>

// ❌ Hardcoding hex for output color — use status-driven token
<Code color="#3dd68c">{output}</Code>
```

---

## Implementation notes

- Content panel ID is generated with React's `useId()` — do not use a hand-written string, as it won't be collision-safe in multi-card views.
- Input is serialized with `JSON.stringify(input, null, 2)` — the component does not validate or sanitize input structure.
- Output color is driven by `status`: `error` → `accent.red`, all others → `accent.green`.

---

## Sources

- [WAI-ARIA APG — Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [WCAG 2.2 SC 4.1.2 — Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [MDN — `<details>` / `<summary>` vs. button disclosure](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
