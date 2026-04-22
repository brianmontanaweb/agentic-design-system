---
component: Tooltip
package: '@agentic-ds/core'
category: overlay
status: implemented
tokens:
  colors: [bg.elevated, text.primary, border.subtle]
  radius: [radius.md]
  duration: [duration.fast]
wcag: AA
aria-pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
mcp-states: n/a
---

# Tooltip

A non-interactive overlay that surfaces a short text label when the user hovers or focuses its trigger element. Tooltip is a general-purpose disclosure primitive; it MUST NOT contain interactive content (links, buttons) or replace a labelling pattern where `aria-label` alone suffices.

---

## Variants

Tooltip has no visual variants. Placement controls where the overlay appears relative to the trigger.

| Placement | Position             | Use when                                            |
| --------- | -------------------- | --------------------------------------------------- |
| `top`     | Above the trigger    | Default; use unless space is constrained above      |
| `bottom`  | Below the trigger    | When content above the trigger would be obscured    |
| `left`    | Left of the trigger  | Right-aligned triggers near the viewport right edge |
| `right`   | Right of the trigger | Left-aligned triggers near the viewport left edge   |

---

## Props

| Prop         | Type                                     | Default | Description                                          |
| ------------ | ---------------------------------------- | ------- | ---------------------------------------------------- |
| `label`      | `string`                                 | —       | Text content of the tooltip. MUST be a plain string. |
| `placement`  | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Position of the tooltip relative to the trigger.     |
| `children`   | `ReactElement`                           | —       | The single interactive trigger element.              |
| `isDisabled` | `boolean`                                | `false` | When true, suppresses tooltip entirely.              |

---

## Accessibility

Requirements (WCAG 2.2 AA):

- The tooltip element MUST carry `role="tooltip"`. _(WAI-ARIA 1.2 Tooltip Pattern)_
- The trigger MUST have `aria-describedby` referencing the tooltip's `id` when the tooltip is enabled. _(WCAG SC 1.3.1)_
- The tooltip MUST be dismissible via the `Escape` key without moving pointer or keyboard focus. _(WCAG 2.2 SC 1.4.13)_
- The tooltip MUST remain visible when the pointer moves from the trigger into the tooltip area (hoverable). _(WCAG 2.2 SC 1.4.13)_
- The tooltip MUST NOT disappear until pointer leaves the trigger+tooltip area or focus leaves. _(WCAG 2.2 SC 1.4.13)_
- Color MUST NOT be the only means of conveying information within the tooltip. _(WCAG SC 1.4.1)_
- Text contrast in the tooltip MUST be ≥ 4.5:1 (`text.primary` on `bg.elevated`). _(WCAG SC 1.4.3)_
- The tooltip MUST NOT contain interactive elements (links, buttons, form controls). Use a Popover for interactive overlays.
- Transition duration is suppressed to 0.01ms under `prefers-reduced-motion: reduce` via the global rule in `AgenticProvider`. _(WCAG SC 2.3.3)_

---

## Do / Don't

**Do:**

```tsx
// Supplement icon-only buttons
<Tooltip label="Close panel">
  <Button variant="ghost" aria-label="Close panel">✕</Button>
</Tooltip>

// Provide extra context on truncated labels
<Tooltip label="Full file path: /usr/local/lib/agent/config.json" placement="bottom">
  <Text noOfLines={1}>config.json</Text>
</Tooltip>

// Disable when context makes label redundant
<Tooltip label="Save" isDisabled={labelAlreadyVisible}>
  <Button>Save</Button>
</Tooltip>
```

**Don't:**

```tsx
// ❌ Interactive content inside tooltip — use Popover instead
<Tooltip label={<a href="/docs">Learn more</a>}>
  <Button>Help</Button>
</Tooltip>

// ❌ Tooltip as the only accessible name — use aria-label on the trigger
<Tooltip label="Close">
  <button>✕</button>  {/* missing aria-label */}
</Tooltip>

// ❌ Wrapping multiple children — children must be a single ReactElement
<Tooltip label="Actions">
  <Button>Save</Button>
  <Button>Cancel</Button>
</Tooltip>
```

---

## Implementation notes

- The tooltip container is always rendered in the DOM when enabled so that `aria-describedby` references a valid element at all times. Visibility is toggled via CSS `opacity` + `visibility` (not `display: none`) to preserve the reference.
- Show/hide uses a 100ms delay on hide (`duration.fast`) to satisfy the WCAG 2.2 SC 1.4.13 "hoverable" requirement — the delay gives users time to move the pointer from trigger to tooltip without it disappearing.
- `pointerEvents: none` on the tooltip box prevents it from interfering with the hide delay when the pointer moves through the tooltip.
- `cloneElement` injects `aria-describedby` onto the trigger so screen readers announce the tooltip description when focus lands on the trigger.

---

## Sources

- [WAI-ARIA Authoring Practices Guide — Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WCAG 2.2 SC 1.4.13 — Content on Hover or Focus](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus)
- [WCAG 2.2 SC 4.1.2 — Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
