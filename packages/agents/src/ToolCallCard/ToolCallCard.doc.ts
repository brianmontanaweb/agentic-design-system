import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'ToolCallCard',
  package: '@agentic-ds/agents',
  category: 'display',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  tokens: {
    colors: [
      'color.tool.status.pending',
      'color.tool.status.running',
      'color.tool.status.done',
      'color.tool.status.error',
      'color.accent.success',
      'color.accent.danger',
      'color.text.primary',
      'color.text.muted',
      'color.surface.default',
      'color.surface.elevated',
      'color.border.subtle',
    ],
    duration: ['duration.fast', 'duration.pulse'],
  },
  description:
    'Collapsible card that shows a single MCP tool invocation — its name, input payload, and output. The header is a button that toggles the detail panel open or closed.',
  props: {
    toolName: {
      type: 'string',
      required: true,
      description: 'Name of the tool as invoked',
    },
    input: {
      type: 'Record<string, unknown>',
      required: false,
      description: 'Input payload; rendered as formatted JSON',
    },
    output: {
      type: 'string',
      required: false,
      description: 'Tool response string',
    },
    status: {
      type: 'ToolCallStatus',
      required: false,
      default: '"done"',
      description: 'Current invocation state',
    },
    defaultOpen: {
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Initial open state',
    },
  },
  types: {
    ToolCallStatus: {
      values: ['pending', 'running', 'done', 'error'],
    },
  },
  ariaNotes: [
    'The expand/collapse trigger MUST be a `<button>` element. _(WAI-ARIA Disclosure Pattern)_',
    'The button MUST have `aria-expanded` reflecting the current open state.',
    "The button MUST have `aria-controls` pointing to the detail panel's `id`.",
    'The button MUST have an `aria-label` of `"${toolName} details"` — the visible tool name alone is sufficient but the label scopes the action for screen readers.',
    'The chevron character (`▾` / `▸`) MUST have `aria-hidden="true"` — it is a decorative direction indicator.',
    'The status dot MUST have `aria-hidden="true"` — it is an animated decorative element.',
    'Visually-hidden text (`<VisuallyHidden>Status: {label}</VisuallyHidden>`) MUST name the current status so the dot color is never the only state indicator. _(WCAG SC 1.4.1 Use of Color)_',
    'The output outcome MUST be named in visually-hidden text (`Tool call failed` / `Tool call succeeded`) — the danger/success text color is never the only outcome indicator. _(WCAG SC 1.4.1 Use of Color)_',
    'Code blocks (input/output) do not need additional ARIA; `<code>` is semantically sufficient.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description: 'Use a `<div>` with a click handler for the trigger — it must be a `<button>`.',
    },
    {
      guidance: false,
      description:
        'Hardcode a hex value for output color — use the status-driven token instead (`color.accent.danger` for `error`, `color.accent.success` otherwise).',
    },
  ],
  notes: `## Statuses

| Status    | Dot color token             | Output text color      | Screen reader label |
| --------- | ---------------------------- | ------------------------ | -------------------- |
| \`pending\` | \`color.tool.status.pending\` | \`color.accent.success\` | \`pending\`           |
| \`running\` | \`color.tool.status.running\` | \`color.accent.success\` | \`running\`           |
| \`done\`    | \`color.tool.status.done\`    | \`color.accent.success\` | \`completed\`         |
| \`error\`   | \`color.tool.status.error\`   | \`color.accent.danger\`  | \`failed\`            |

The screen reader label is rendered as visually-hidden text (\`Status: <label>\`) inside the card, alongside the dot — the dot's color is never the only state indicator.

The \`running\` status dot animates with \`ds-pulse\`. \`useReducedMotion()\` disables the animation.

## Implementation notes

- Content panel ID is generated with React's \`useId()\` — do not use a hand-written string, as it won't be collision-safe in multi-card views.
- Input is serialized with \`JSON.stringify(input, null, 2)\` — the component does not validate or sanitize input structure.
- Output color is driven by \`status\`: \`error\` → \`color.accent.danger\`, all others → \`color.accent.success\`.
- The card's outer container carries \`data-status="<status>"\` — a styling/testing hook for host CSS (e.g. Tailwind \`data-[status=error]:\`) and stable E2E/visual-regression selectors. It is not an ARIA attribute; the visually-hidden status text remains the accessible source of truth.

## Sources

- [WAI-ARIA APG — Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [WCAG 2.2 SC 4.1.2 — Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [MDN — \`<details>\` / \`<summary>\` vs. button disclosure](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
`,
}
