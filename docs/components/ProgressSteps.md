---
component: ProgressSteps
package: '@agentic-ds/agents'
category: navigation
status: implemented
tokens:
  colors:
    [
      color.accent.interactive,
      color.accent.success,
      color.accent.warning,
      color.text.muted,
      color.text.primary,
      color.border.subtle,
      color.surface.step.active,
      color.surface.step.complete,
      color.surface.step.waiting,
      color.surface.elevated,
    ]
wcag: AA
aria-pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
---

# ProgressSteps

A vertical ordered list of steps showing the progress of a multi-stage agent task. Each step reflects one of five statuses that map to MCP lifecycle states.

---

## Step statuses

| Status      | Dot border token | Step background token | Indicator   | Label weight |
| ----------- | ---------------- | --------------------- | ----------- | ------------ |
| `pending`   | `color.border.subtle`       | `color.surface.elevated`      | Step number | normal       |
| `active`    | `color.accent.interactive`  | `color.surface.step.active`   | Step number | medium       |
| `complete`  | `color.accent.success`      | `color.surface.step.complete` | ✓ checkmark | normal       |
| `waiting`   | `color.accent.warning`      | `color.surface.step.waiting`  | Step number | medium       |
| `cancelled` | `color.text.muted`          | `color.surface.elevated`      | — em-dash   | normal       |

---

## Props

### `ProgressStepsProps`

| Prop    | Type     | Default | Description           |
| ------- | -------- | ------- | --------------------- |
| `steps` | `Step[]` | —       | Ordered list of steps |

### `Step`

| Field         | Type         | Default | Description                           |
| ------------- | ------------ | ------- | ------------------------------------- |
| `id`          | `string`     | —       | Unique identifier (used as React key) |
| `label`       | `string`     | —       | Step title                            |
| `status`      | `StepStatus` | —       | Current state of this step            |
| `description` | `string`     | —       | Optional sub-text shown below label   |

---

## Accessibility

- The outer `VStack` MUST have `role="list"` and each step `role="listitem"`. _(WAI-ARIA list pattern)_
- The active step MUST have `aria-current="step"`. _(WCAG SC 1.3.1)_
- Color MUST NOT be the only differentiator between states. _(WCAG SC 1.4.1)_ — the step indicator (number, ✓, —) provides a secondary visual signal.
- Step numbers and symbols are rendered inside the dot container; they MUST have sufficient contrast against `bg.step.*` tint backgrounds.

---

## Do / Don't

**Do:**

```tsx
<ProgressSteps
  steps={[
    { id: '1', label: 'Parse request', status: 'complete' },
    {
      id: '2',
      label: 'Generate response',
      status: 'active',
      description: 'Using claude-sonnet-4-6...',
    },
    { id: '3', label: 'Post-process', status: 'pending' },
  ]}
/>
```

**Don't:**

```tsx
// ❌ Non-unique ids — breaks React reconciliation
{ id: 'step', label: 'A', status: 'active' }
{ id: 'step', label: 'B', status: 'pending' }

// ❌ Multiple active steps — only one step should be active at a time
{ status: 'active' } and { status: 'active' }
```

---

## Implementation notes

- `color.surface.step.*` tokens use 8-digit hex (`RRGGBBAA`) for a 13% opacity tint — do not replace with `rgba()` shorthand, which would break the semantic token contract.
- Do not show a connector line between steps in the current implementation — layout relies on `VStack` gap only.
- The `waiting` status signals `input_required` in the MCP protocol; it is visually distinct from `active` via `color.accent.warning`.

---

## Sources

- [WAI-ARIA — list / listitem roles](https://www.w3.org/TR/wai-aria-1.2/#list)
- [WCAG 2.2 SC 1.3.1 — Info and Relationships](https://www.w3.org/TR/WCAG22/#info-and-relationships)
- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [MCP Protocol — Task Lifecycle States](https://modelcontextprotocol.io/docs/concepts/architecture)
