---
component: Button
package: '@agentic-ds/core'
category: action
status: implemented
chakra-base: Button
tokens:
  colors: [accent.blue, accent.red, text.primary, text.muted, bg.elevated, border.subtle]
  radius: [radius.md]
  duration: [duration.fast, duration.normal]
  fonts: [font.sans]
wcag: AA
aria-pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
---

# Button

A clickable element that triggers an action or submits a form. The Button is the primary interactive primitive in the design system.

---

## Variants

The `variant` prop controls visual weight. Use the lowest-weight variant that still makes the action clear.

| Variant   | Use case                                         | Background    | Border          | Text           |
| --------- | ------------------------------------------------ | ------------- | --------------- | -------------- |
| `solid`   | Primary action per context (one per view max)    | `accent.blue` | none            | white          |
| `outline` | Secondary action alongside a `solid` button      | transparent   | `border.subtle` | `text.primary` |
| `ghost`   | Tertiary or toolbar actions; low visual priority | transparent   | none            | `text.muted`   |
| `danger`  | Destructive actions (delete, revoke, reset)      | `accent.red`  | none            | white          |

Rules:

- A single view MUST NOT contain more than one `solid` button per action group.
- `danger` MUST only be used for irreversible or destructive actions.
- `ghost` MUST NOT be used as the sole button in a form — it lacks sufficient affordance.

---

## Sizes

| Size | Height | Padding (x) | Font size | Icon size |
| ---- | ------ | ----------- | --------- | --------- |
| `sm` | 28px   | 12px        | `xs`      | 14px      |
| `md` | 36px   | 16px        | `sm`      | 16px      |
| `lg` | 44px   | 20px        | `md`      | 18px      |

Default size: `md`. Touch targets MUST meet WCAG 2.2 SC 2.5.8 minimum of 24×24px (all sizes satisfy this).

---

## States

Implement all states. Do not omit hover or focus-visible.

| State         | Visual treatment                                                                    |
| ------------- | ----------------------------------------------------------------------------------- |
| Default       | Base variant styles                                                                 |
| Hover         | Lighten/darken background by 10% using opacity                                      |
| Focus-visible | 2px solid `accent.blue` outline, 2px offset — keyboard only                         |
| Active        | Scale `0.97`, darken background by 15%                                              |
| Disabled      | `opacity: 0.4`, `cursor: not-allowed`, no pointer events                            |
| Loading       | Replace content with `ThinkingIndicator`; preserve button width; `aria-busy="true"` |

Focus ring MUST use `:focus-visible`, not `:focus`, to avoid showing the ring on mouse click.

Disabled state MUST use `aria-disabled="true"` + `tabIndex={-1}` rather than the HTML `disabled` attribute when the button must remain in the tab order for accessibility tools.

---

## Props

| Prop          | Type                                          | Default    | Description                                         |
| ------------- | --------------------------------------------- | ---------- | --------------------------------------------------- |
| `variant`     | `"solid" \| "outline" \| "ghost" \| "danger"` | `"solid"`  | Visual style                                        |
| `size`        | `"sm" \| "md" \| "lg"`                        | `"md"`     | Height and padding scale                            |
| `disabled`    | `boolean`                                     | `false`    | Prevents interaction; applies disabled state styles |
| `loading`     | `boolean`                                     | `false`    | Shows loading indicator; prevents interaction       |
| `loadingText` | `string`                                      | —          | SR-only text announced while loading                |
| `leftIcon`    | `React.ReactElement`                          | —          | Icon rendered before label; 8px gap                 |
| `rightIcon`   | `React.ReactElement`                          | —          | Icon rendered after label; 8px gap                  |
| `fullWidth`   | `boolean`                                     | `false`    | Stretches to fill container width                   |
| `type`        | `"button" \| "submit" \| "reset"`             | `"button"` | HTML button type                                    |
| `onClick`     | `React.MouseEventHandler`                     | —          | Click handler                                       |
| `children`    | `React.ReactNode`                             | —          | Button label — MUST be present or `aria-label` set  |

---

## Accessibility

Requirements (WCAG 2.2 AA):

- Button MUST have an accessible name from either `children` text content or `aria-label`. An icon-only button with no text MUST have `aria-label`. _(WCAG SC 4.1.2)_
- Contrast ratio of label text against background MUST be ≥ 4.5:1 for normal text. _(WCAG SC 1.4.3)_
- Focus indicator MUST have a contrast ratio ≥ 3:1 against adjacent colors. _(WCAG SC 1.4.11, 2.4.11)_
- `Space` and `Enter` MUST both activate the button. _(WAI-ARIA APG Button Pattern)_
- Loading state MUST set `aria-busy="true"` and announce `loadingText` to screen readers via `aria-label` swap or visually-hidden span.
- Do NOT use `role="button"` on a `<div>`. Use `<button>` exclusively.

---

## Label text rules

- Use sentence case: "Save changes", not "Save Changes" or "SAVE".
- Be specific: "Delete project" not "Delete" when context is ambiguous.
- Action verbs: lead with a verb ("Save", "Send", "Add item").
- Keep under 4 words where possible; never wrap to two lines.
- Do NOT use an ellipsis ("Save…") to imply a confirmation dialog — this is an outdated convention.

---

## Icon usage

- Icons MUST visually reinforce the label — they MUST NOT contradict or replace it unless `aria-label` is set.
- Use `leftIcon` for directional actions (e.g., upload arrow pointing up).
- Use `rightIcon` for navigation actions (e.g., chevron pointing right for "Next").
- Do NOT use both `leftIcon` and `rightIcon` on the same button.
- Icon-only buttons MUST have `aria-label` and a tooltip.

---

## Do / Don't

**Do:**

```tsx
// Primary action
<Button variant="solid" onClick={handleSave}>Save changes</Button>

// Destructive with confirmation
<Button variant="danger" onClick={handleDelete}>Delete project</Button>

// Icon-only with label
<Button variant="ghost" aria-label="Close panel" leftIcon={<CloseIcon />} />

// Loading state
<Button loading loadingText="Saving…" variant="solid">Save changes</Button>
```

**Don't:**

```tsx
// ❌ Multiple solid buttons in one group
<Button variant="solid">Save</Button>
<Button variant="solid">Cancel</Button>

// ❌ Non-specific label
<Button variant="danger">OK</Button>

// ❌ div with role="button"
<div role="button" onClick={handleClick}>Click me</div>

// ❌ Icon that contradicts label
<Button leftIcon={<DownloadIcon />}>Upload file</Button>

// ❌ Disabled without explanation — prefer tooltip or inline hint
<Button disabled>Submit</Button>
```

---

## Implementation notes

- Extend Chakra UI's `Button` recipe via `defineRecipe` in `packages/core/src/theme.ts`. Do not create a new element — wrap Chakra's `Button`.
- Animation timing for hover/active transitions: `duration.fast` (100ms).
- The `loading` prop SHOULD preserve the button's current width to prevent layout shift. Achieve this by keeping the label in the DOM with `visibility: hidden` and overlaying the `ThinkingIndicator`.
- `type="button"` default prevents accidental form submission when the button is inside a `<form>`.

---

## Sources

- [WAI-ARIA Authoring Practices Guide — Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — keyboard behavior and ARIA requirements
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/) — contrast, touch target, and focus indicator criteria
- [Shopify Polaris — Button](https://polaris.shopify.com/components/actions/button) — variant and usage pattern reference
- [Google Material Design 3 — Buttons](https://m3.material.io/components/buttons/guidelines) — hierarchy and weight conventions
- [Radix UI Themes — Button](https://www.radix-ui.com/themes/docs/components/button) — loading and icon patterns
- [llms.txt specification — Answer.AI / Jeremy Howard, 2024](https://llmstxt.org/) — markdown-first, token-efficient documentation structure
- [Builder.io — AGENTS.md](https://www.builder.io/blog/agents-md) — agent-readable constraint documentation
- [Anthropic — Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — structured, explicit specs for LLM consumption
