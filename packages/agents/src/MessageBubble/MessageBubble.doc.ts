import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'MessageBubble',
  package: '@agentic-ds/agents',
  category: 'display',
  status: 'implemented',
  wcag: 'AA',
  tokens: {
    colors: [
      'color.message.user.bg',
      'color.message.assistant.bg',
      'color.message.tool.bg',
      'color.text.primary',
      'color.text.muted',
      'color.accent.interactive',
      'color.accent.success',
      'color.border.subtle',
    ],
  },
  description:
    'A single message card within a conversation thread. Background color, label color, and default label text vary by sender role.',
  props: {
    sender: {
      type: 'MessageRole',
      required: true,
      description: 'Determines visual treatment',
    },
    content: {
      type: 'React.ReactNode',
      required: true,
      description: 'Message body — text, `<StreamingText>`, `<CodeBlock>`, etc.',
    },
    label: {
      type: 'string',
      required: false,
      description: 'Override sender label; falls back to role default',
    },
    timestamp: {
      type: 'string',
      required: false,
      description: 'Optional timestamp shown in the header row',
    },
  },
  types: {
    MessageRole: {
      values: ['user', 'assistant', 'tool'],
    },
  },
  ariaNotes: [
    'The label and timestamp are in the DOM above the content — screen readers encounter them in natural reading order.',
    'Role differentiation is conveyed by both label text and background color. Color alone is not the sole signal. _(WCAG SC 1.4.1)_',
    'Do not set `aria-label` on the bubble itself — `MessageThread` (the parent `role="log"`) handles the region label.',
    "When nesting `<StreamingText>` as `content`, do not add an additional `aria-live` region on the bubble — the `StreamingText`'s own region is sufficient.",
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description: 'Hardcode a background color — use the role-driven token instead.',
    },
    {
      guidance: false,
      description: 'Wrap a bubble in its own live region — `MessageThread` already handles this.',
    },
  ],
  notes: `## Roles

| Role        | Background token             | Label color                | Default label |
| ----------- | ------------------------------ | ---------------------------- | ------------- |
| \`user\`      | \`color.message.user.bg\`      | \`color.text.muted\`         | You           |
| \`assistant\` | \`color.message.assistant.bg\` | \`color.accent.interactive\` | Assistant     |
| \`tool\`      | \`color.message.tool.bg\`      | \`color.accent.success\`     | Tool          |

## Implementation notes

- Background and label colors are driven by \`roleConfig\` — add new roles there rather than conditioning inline.
- The \`content\` prop accepts any \`React.ReactNode\`; compose \`StreamingText\`, \`CodeBlock\`, or plain text freely.
- \`timestamp\` is not formatted by the component — pass a pre-formatted string (e.g., \`"2:34 PM"\`).

## Sources

- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [Inclusive Components — Cards](https://inclusive-components.design/cards/)
`,
}
