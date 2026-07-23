import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'ProgressSteps',
  package: '@agentic-ds/agents',
  category: 'navigation',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  tokens: {
    colors: [
      'color.step.pending.dot',
      'color.step.pending.label',
      'color.step.pending.bg',
      'color.step.active.dot',
      'color.step.active.label',
      'color.step.active.bg',
      'color.step.complete.dot',
      'color.step.complete.label',
      'color.step.complete.bg',
      'color.step.waiting.dot',
      'color.step.waiting.label',
      'color.step.waiting.bg',
      'color.step.cancelled.dot',
      'color.step.cancelled.label',
      'color.step.cancelled.bg',
      'color.text.muted',
    ],
  },
  description:
    'A vertical ordered list of steps showing the progress of a multi-stage agent task. Each step reflects one of five statuses that map to MCP lifecycle states.',
  props: {
    steps: {
      type: 'Step[]',
      required: true,
      description: 'Ordered list of steps',
    },
  },
  types: {
    Step: {
      values: ['{ id: string; label: string; status: StepStatus; description?: string }'],
    },
    StepStatus: {
      values: ['pending', 'active', 'complete', 'waiting', 'cancelled'],
    },
  },
  ariaNotes: [
    'The outer `VStack` MUST have `role="list"` and each step `role="listitem"`. _(WAI-ARIA list pattern)_',
    'The active step MUST have `aria-current="step"`. _(WCAG SC 1.3.1)_',
    'Color MUST NOT be the only differentiator between states. _(WCAG SC 1.4.1)_ — the step indicator (number, ✓, —) provides a secondary visual signal.',
    'Step numbers and symbols are rendered inside the dot container; they MUST have sufficient contrast against `bg.step.*` tint backgrounds.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description: 'Use non-unique `id`s across steps — this breaks React reconciliation.',
    },
    {
      guidance: false,
      description: 'Mark more than one step as `active` at the same time.',
    },
  ],
  notes: `## Step statuses

Each status maps to a \`color.step.<status>.{dot,label,bg}\` semantic token triple — the component never reaches for a primitive or a raw accent/surface token directly.

| Status      | Dot border token          | Label token                  | Background token           | Indicator   | Label weight |
| ----------- | -------------------------- | ----------------------------- | --------------------------- | ----------- | ------------ |
| \`pending\`   | \`color.step.pending.dot\`   | \`color.step.pending.label\`   | \`color.step.pending.bg\`    | Step number | normal       |
| \`active\`    | \`color.step.active.dot\`    | \`color.step.active.label\`    | \`color.step.active.bg\`     | Step number | medium       |
| \`complete\`  | \`color.step.complete.dot\`  | \`color.step.complete.label\`  | \`color.step.complete.bg\`   | ✓ checkmark | normal       |
| \`waiting\`   | \`color.step.waiting.dot\`   | \`color.step.waiting.label\`   | \`color.step.waiting.bg\`    | Step number | medium       |
| \`cancelled\` | \`color.step.cancelled.dot\` | \`color.step.cancelled.label\` | \`color.step.cancelled.bg\`  | — em-dash   | normal       |

## Implementation notes

- \`color.step.{active,complete,waiting}.bg\` alias \`color.surface.step.*\`, which use 8-digit hex (\`RRGGBBAA\`) for a 13% opacity tint — do not replace with an rgba color function, which would break the semantic token contract.
- Do not show a connector line between steps in the current implementation — layout relies on \`VStack\` gap only.
- The \`waiting\` status signals \`input_required\` in the MCP protocol; it is visually distinct from \`active\` via \`color.step.waiting.dot\` (aliasing \`color.accent.warning\`).
- Each \`listitem\` carries its own \`data-status="<status>"\` — a styling/testing hook for host CSS (e.g. Tailwind \`data-[status=active]:\`) and stable E2E/visual-regression selectors, independent of and in addition to \`aria-current\`.

## Sources

- [WAI-ARIA — list / listitem roles](https://www.w3.org/TR/wai-aria-1.2/#list)
- [WCAG 2.2 SC 1.3.1 — Info and Relationships](https://www.w3.org/TR/WCAG22/#info-and-relationships)
- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [MCP Protocol — Task Lifecycle States](https://modelcontextprotocol.io/docs/concepts/architecture)
`,
}
