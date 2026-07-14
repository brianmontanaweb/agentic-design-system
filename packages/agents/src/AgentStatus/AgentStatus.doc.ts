import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'AgentStatus',
  package: '@agentic-ds/agents',
  category: 'feedback',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#status',
  tokens: {
    colors: [
      'color.agent.status.idle',
      'color.agent.status.running',
      'color.agent.status.waiting',
      'color.agent.status.done',
      'color.agent.status.error',
      'color.agent.status.cancelled',
    ],
  },
  description:
    'Displays the current lifecycle state of an MCP agent as a colored dot paired with a text badge. Announces state changes to screen readers via a visually-hidden phrase.',
  props: {
    status: {
      type: 'AgentStatusValue',
      required: true,
      description: 'Current MCP lifecycle state',
    },
    label: {
      type: 'string',
      required: false,
      description: 'Override display text; falls back to status name',
    },
  },
  types: {
    AgentStatusValue: {
      values: ['idle', 'running', 'waiting', 'done', 'error', 'cancelled'],
      description:
        'All 6 MCP task lifecycle states must be supported. Do not add states outside this set. `waiting` maps to the MCP `input_required` state.',
    },
  },
  ariaNotes: [
    'MUST have `role="status"` + `aria-live="polite"` so transitions are announced without interrupting the user. _(WCAG SC 4.1.3)_',
    'A visually-hidden span MUST contain the full phrase `"Agent status: {label}"` — this is what screen readers announce.',
    'The visible badge MUST have `aria-hidden="true"`. The visually-hidden text is the sole SR announcement.',
    'Color MUST NOT be the only differentiator between states. _(WCAG SC 1.4.1)_ — the visually-hidden text fulfills this requirement for non-visual users; sighted users get the dot + badge label together.',
    'The `running` animation MUST respect `prefers-reduced-motion`.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description: 'Invent statuses outside the MCP lifecycle, e.g. a `"paused"` status.',
    },
    {
      guidance: false,
      description: 'Override the status token colors inline, e.g. wrapping in `<Box color="red">`.',
    },
  ],
  notes: `## States

All 6 MCP task lifecycle states must be supported. Do not add states outside this set. \`waiting\` maps to the MCP \`input_required\` state.

| Status      | Token                          | Meaning                      |
| ----------- | ------------------------------- | ----------------------------- |
| \`idle\`      | \`color.agent.status.idle\`      | Agent not running            |
| \`running\`   | \`color.agent.status.running\`   | Agent actively processing    |
| \`waiting\`   | \`color.agent.status.waiting\`   | Awaiting input from the user |
| \`done\`      | \`color.agent.status.done\`      | Task completed successfully  |
| \`error\`     | \`color.agent.status.error\`     | Task failed                  |
| \`cancelled\` | \`color.agent.status.cancelled\` | Task stopped by user action  |

The \`running\` dot animates with \`ds-pulse\`. All other states are static. \`useReducedMotion()\` disables the animation.

## Implementation notes

- Use \`color.agent.status.*\` semantic tokens — not raw \`accent.*\` tokens — so the meaning survives palette changes.
- The \`ds-pulse\` keyframe is injected by \`AgenticProvider\` and scoped to \`[data-agentic-ds]\`.
- Visually-hidden technique uses \`clipPath: inset(50%)\` rather than \`clip: rect(0,0,0,0)\` (the latter is deprecated).
- The \`role="status"\` element carries \`data-status="<status>"\` — a styling/testing hook for host CSS (e.g. Tailwind \`data-[status=error]:\`) and stable E2E/visual-regression selectors. It is not an ARIA attribute; the visually-hidden phrase remains the accessible source of truth.

## Sources

- [WAI-ARIA 1.2 — status role](https://www.w3.org/TR/wai-aria-1.2/#status)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [Inclusive Components — Live Regions](https://inclusive-components.design/live-regions/)
`,
}
