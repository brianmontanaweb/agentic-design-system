import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'StreamingText',
  package: '@agentic-ds/agents',
  category: 'display',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#log',
  tokens: {
    colors: ['color.text.primary', 'color.stream.cursor'],
    duration: ['duration.stream.blink'],
  },
  description:
    'Renders a growing block of text that is being streamed token-by-token from an agent. A blinking cursor indicates the stream is active. New text is announced incrementally to screen readers.',
  props: {
    text: {
      type: 'string',
      required: true,
      description: 'The full text accumulated so far',
    },
    isStreaming: {
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Shows blinking cursor when `true`',
    },
    fontSize: {
      type: 'string',
      required: false,
      default: '"sm"',
      description: 'Chakra font size token',
    },
    color: {
      type: 'string',
      required: false,
      default: '"color.text.primary"',
      description: 'Chakra color token for the text',
    },
    'aria-label': {
      type: 'string',
      required: false,
      default: '"Streaming output"',
      description: 'Label for the live region',
    },
  },
  ariaNotes: [
    'MUST have `role="log"` + `aria-live="polite"` + `aria-atomic="false"` so screen readers announce only newly appended text, not the full buffer each time. _(WCAG SC 4.1.3)_',
    'The blinking cursor MUST have `aria-hidden="true"` — it is decorative and must not be read aloud. _(WCAG SC 1.3.3)_',
    'Cursor animation MUST respect `prefers-reduced-motion`. When active, `animation` is set to `undefined` (cursor remains visible but static).',
    '`aria-label` MUST describe the region purpose — consumers should override `"Streaming output"` if the context is more specific (e.g., `"Agent reasoning"`).',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description:
        'Wrap StreamingText in another live region — nested live regions behave unpredictably.',
    },
    {
      guidance: false,
      description: 'Pass a raw hex value for `color` — use a semantic token instead.',
    },
  ],
  notes: `## Why \`aria-live="polite"\` and \`aria-atomic="false"\`

\`aria-atomic="false"\` instructs screen readers to announce only the DOM nodes that changed since the last render, not the entire region. This is correct for streaming: users hear each new chunk rather than the entire accumulated text repeated. \`aria-live="polite"\` avoids interrupting the user mid-sentence.

## Implementation notes

- The \`text\` prop should be the full accumulated string, not a delta. The component does not manage internal buffer state.
- Cursor is an inline \`<span>\` colored \`color.stream.cursor\` with \`ds-blink\` keyframe (defined by \`AgenticProvider\`), \`w="2px"\`, \`h="1em"\`, \`verticalAlign="text-bottom"\`. Timing is \`duration.stream.blink\` — do not hardcode.
- For very high-frequency streams (sub-frame token intervals), consider debouncing \`text\` updates in the parent to avoid excessive SR announcements.

## Sources

- [WAI-ARIA 1.2 — log role](https://www.w3.org/TR/wai-aria-1.2/#log)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [Inclusive Components — Live Regions](https://inclusive-components.design/live-regions/)
- [MDN — aria-atomic](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-atomic)
`,
}
