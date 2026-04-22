---
component: ToolCallCard
package: '@agentic-ds/agents'
status: implemented
tokens: []
wcag: AA
---

# ToolCallCard

A collapsible card that displays a single MCP tool call — its name, input, output, and execution status.

---

## Variants / States

| Status  | Dot color | Description            |
| ------- | --------- | ---------------------- |
| running | blue      | Tool call in progress  |
| done    | green     | Completed successfully |
| error   | red       | Failed                 |

<!-- SPEC DRIFT: missing 'pending' state -->

---

## Props

<!-- SPEC DRIFT: missing 'defaultOpen' prop -->

| Prop       | Type                                          | Default  | Description                   |
| ---------- | --------------------------------------------- | -------- | ----------------------------- |
| `toolName` | `string`                                      | required | Name of the tool being called |
| `input`    | `object`                                      | —        | Tool input arguments          |
| `output`   | `string`                                      | —        | Tool output or result         |
| `status`   | `"pending" \| "running" \| "done" \| "error"` | `"done"` | Current execution status      |

---

## Accessibility

Uses a clickable row to expand/collapse the input/output details.
