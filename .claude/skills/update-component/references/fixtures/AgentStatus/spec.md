---
component: AgentStatus
package: "@agentic-ds/agents"
status: implemented
tokens: []
wcag: AA
mcp-states: [idle, running, done, error]
---

# AgentStatus

Displays the current lifecycle state of an agent — an indicator dot paired with a text badge.

---

## States

<!-- SPEC DRIFT: missing 'waiting' and 'cancelled' MCP states -->

| State     | Color  | Description                   |
|-----------|--------|-------------------------------|
| `idle`    | muted  | Not yet started               |
| `running` | blue   | Actively processing           |
| `done`    | green  | Completed successfully        |
| `error`   | red    | Terminated with failure       |

---

## Props

| Prop     | Type                                          | Default  | Description                        |
|----------|-----------------------------------------------|----------|------------------------------------|
| `status` | `"idle" \| "running" \| "done" \| "error"`    | required | Current agent lifecycle state      |
| `label`  | `string`                                      | —        | Override the default state label   |

---

## Accessibility

<!-- SPEC DRIFT: no documentation of role="status", aria-live, or visually-hidden text requirement -->

The indicator dot uses color to convey state.
