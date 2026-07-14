import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'MessageThread',
  package: '@agentic-ds/agents',
  category: 'layout',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#log',
  tokens: {
    colors: ['color.border.subtle'],
  },
  description:
    'A scrollable container for a conversation between a user and an agent. New messages are announced to screen readers as they arrive. Optionally auto-scrolls to the latest message.',
  props: {
    children: {
      type: 'React.ReactNode',
      required: true,
      description: 'Sequence of `<MessageBubble>` components',
    },
    maxHeight: {
      type: 'string',
      required: false,
      default: '"600px"',
      description: 'CSS max-height of the scroll container',
    },
    autoScroll: {
      type: 'boolean',
      required: false,
      default: 'true',
      description: 'Scrolls to bottom whenever `children` changes',
    },
    'aria-label': {
      type: 'string',
      required: false,
      default: '"Message thread"',
      description: 'Label for the `role="log"` region',
    },
  },
  ariaNotes: [
    'MUST have `role="log"` + `aria-live="polite"` + `aria-atomic="false"` so new messages are announced incrementally. _(WCAG SC 4.1.3)_',
    '`aria-label` MUST be set to a meaningful phrase. Override the default `"Message thread"` when the context is more specific (e.g., `"Agent conversation"`, `"Support chat"`).',
    '`aria-atomic="false"` ensures screen readers announce only the newly added message rather than reading the entire thread.',
    'The scrollable container is the live region; do not wrap children in an additional live region.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description: 'Wrap children in another live region — the thread container is already one.',
    },
    {
      guidance: false,
      description: 'Omit `aria-label` when multiple threads exist on the same page.',
    },
  ],
  notes: `## Auto-scroll behaviour

\`autoScroll\` uses a sentinel \`<div ref={bottomRef}>\` at the end of the list and calls \`scrollIntoView({ behavior: 'smooth' })\` when \`children\` changes. Disable it (\`autoScroll={false}\`) when the user has scrolled up to read history, or wire your own scroll logic.

## Implementation notes

- The custom scrollbar is styled with \`-webkit-scrollbar\` CSS; the scrollbar thumb uses the \`--ds-border-subtle\` CSS variable with a hardcoded hex fallback for browsers that don't support CSS variables (acceptable: applies only to a cosmetic scrollbar).
- \`autoScroll\` fires on every \`children\` change via \`useEffect\`; if children updates are very frequent, consider debouncing outside the component.

## Sources

- [WAI-ARIA 1.2 — log role](https://www.w3.org/TR/wai-aria-1.2/#log)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [MDN — aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
`,
}
