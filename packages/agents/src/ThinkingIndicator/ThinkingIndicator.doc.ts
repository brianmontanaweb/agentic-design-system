import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'ThinkingIndicator',
  package: '@agentic-ds/agents',
  category: 'feedback',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#status',
  tokens: {
    colors: ['color.accent.interactive', 'color.text.muted'],
    duration: ['duration.stream.thinking'],
  },
  description:
    'Three pulsing dots that indicate an agent is processing. Announces a text label to screen readers; the dots themselves are decorative and hidden from assistive technology.',
  props: {
    label: {
      type: 'string',
      required: false,
      default: '"Thinking"',
      description: 'Text shown alongside dots; announced to SRs',
    },
  },
  ariaNotes: [
    'MUST have `role="status"` + `aria-live="polite"` so the label is announced when the component appears. _(WCAG SC 4.1.3)_',
    'The inner dot container MUST have `aria-hidden="true"` — dots are decorative and must not be read individually by screen readers.',
    'The visible label text is the SR announcement. Do not use a separate visually-hidden span unless the visible label differs from what should be announced.',
    'All dot animations MUST respect `prefers-reduced-motion`. When reduced motion is active, `animation` is set to `undefined` and the dots render as static circles.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description:
        'Suppress the label with an empty string — screen readers lose the announcement entirely.',
    },
    {
      guidance: false,
      description: 'Use ThinkingIndicator for non-agent loading states — prefer a spinner instead.',
    },
  ],
  notes: `## Implementation notes

- Each dot staggers its start by an index-based delay multiplier (\`i * <per-dot delay>\`) using the \`ds-pulse\` keyframe from \`AgenticProvider\`.
- \`useReducedMotion()\` from \`@agentic-ds/core\` gates the \`animation\` prop — when true, animation is \`undefined\`.
- Dot color \`color.accent.interactive\` intentionally matches the \`running\` state of \`AgentStatus\` for visual consistency.

## Sources

- [WAI-ARIA 1.2 — status role](https://www.w3.org/TR/wai-aria-1.2/#status)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
`,
}
