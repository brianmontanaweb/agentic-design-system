import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'CodeBlock',
  package: '@agentic-ds/core',
  category: 'content',
  status: 'implemented',
  wcag: 'AA',
  tokens: {
    colors: ['bg.elevated', 'border.subtle', 'text.primary', 'text.muted'],
    radius: ['radius.md'],
    fonts: ['font.mono'],
  },
  description:
    'A styled container for displaying pre-formatted code. Renders an optional language label above a monospaced `<code>` element. CodeBlock is a display primitive — it does not provide syntax highlighting, line numbers, or copy functionality.',
  props: {
    children: {
      type: 'ReactNode',
      required: true,
      description: 'The code content; preserves whitespace via `white-space: pre`.',
    },
    language: {
      type: 'string',
      required: false,
      description:
        'Optional language label rendered above the code block (e.g. `"typescript"`). Not syntax-aware — display only.',
    },
  },
  ariaNotes: [
    'Code content is rendered inside a `<code>` element, which carries the implicit ARIA `code` role. This is the correct semantic element for code samples. _(HTML spec)_',
    'The language label is rendered as plain text above the code and is readable by assistive technology. It MUST NOT be `aria-hidden` — it provides useful context.',
    'If CodeBlock is used to display output that updates dynamically (e.g., streaming tool output), the parent component MUST wrap it in a live region (`role="log"` for sequential content). CodeBlock itself does not provide a live region. _(WCAG SC 4.1.3)_',
    'Color contrast of code text (`text.primary`) against background (`bg.elevated`) MUST meet ≥ 4.5:1. _(WCAG SC 1.4.3)_',
  ].join('\n'),
  bestPractices: [
    {
      guidance: false,
      description: 'Pass structured content (JSX) as children — use plain text or a string.',
    },
    {
      guidance: false,
      description:
        'Use CodeBlock for prose — use `<Text fontFamily="mono">` for inline code instead.',
    },
    {
      guidance: false,
      description:
        'Wrap live-updating content without a live region — wrap it in a `role="log" aria-live="polite"` container.',
    },
  ],
  notes: `## Implementation notes

- The outer \`Box\` is a \`<div>\` — not a \`<pre>\`. The \`white-space: pre\` behavior comes from the Chakra \`Code\` component's \`whiteSpace="pre"\` prop rather than the \`<pre>\` element. For full semantic correctness, a future update MAY wrap the inner \`Code\` in a \`<pre>\` element.
- \`language\` is display-only. Syntax highlighting SHOULD be added via a separate highlighter (e.g., \`highlight.js\`, \`shiki\`) injected as \`children\`.
- Overflow is handled with \`overflow: auto\` on the outer \`Box\`, so wide code scrolls horizontally rather than wrapping.

## Sources

- [MDN — \`<code>\` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code)
- [WCAG 2.2 SC 1.4.3 — Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
`,
}
