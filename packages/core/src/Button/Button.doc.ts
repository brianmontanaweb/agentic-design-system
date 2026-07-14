import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'Button',
  package: '@agentic-ds/core',
  category: 'action',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  tokens: {
    colors: [
      'accent.blue',
      'accent.red',
      'text.primary',
      'text.muted',
      'bg.elevated',
      'border.subtle',
    ],
    radius: ['radius.md'],
    duration: ['duration.fast', 'duration.normal'],
    fonts: ['font.sans'],
  },
  description:
    'A clickable element that triggers an action or submits a form. The Button is the primary interactive primitive in the design system.',
  props: {
    variant: {
      type: '"solid" | "outline" | "ghost" | "danger"',
      required: false,
      default: '"solid"',
      description: 'Visual style',
    },
    size: {
      type: '"sm" | "md" | "lg"',
      required: false,
      default: '"md"',
      description: 'Height and padding scale',
    },
    disabled: {
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction; applies disabled state styles',
    },
    loading: {
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Shows loading indicator; prevents interaction',
    },
    loadingText: {
      type: 'string',
      required: false,
      description: 'SR-only text announced while loading',
    },
    leftIcon: {
      type: 'React.ReactElement',
      required: false,
      description: 'Icon rendered before label; 8px gap',
    },
    rightIcon: {
      type: 'React.ReactElement',
      required: false,
      description: 'Icon rendered after label; 8px gap',
    },
    fullWidth: {
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Stretches to fill container width',
    },
    type: {
      type: '"button" | "submit" | "reset"',
      required: false,
      default: '"button"',
      description: 'HTML button type',
    },
    onClick: {
      type: 'React.MouseEventHandler',
      required: false,
      description: 'Click handler',
    },
    children: {
      type: 'React.ReactNode',
      required: false,
      description: 'Button label — MUST be present or `aria-label` set',
    },
    'aria-label': {
      type: 'string',
      required: false,
      description: 'Accessible name; required for icon-only buttons',
    },
  },
  ariaNotes: [
    'Button MUST have an accessible name from either `children` text content or `aria-label`. An icon-only button with no text MUST have `aria-label`. _(WCAG SC 4.1.2)_',
    'Contrast ratio of label text against background MUST be ≥ 4.5:1 for normal text. _(WCAG SC 1.4.3)_',
    'Focus indicator MUST have a contrast ratio ≥ 3:1 against adjacent colors. _(WCAG SC 1.4.11, 2.4.11)_',
    '`Space` and `Enter` MUST both activate the button. _(WAI-ARIA APG Button Pattern)_',
    'Loading state MUST set `aria-busy="true"` and announce `loadingText` to screen readers via `aria-label` swap or visually-hidden span.',
    'Do NOT use `role="button"` on a `<div>`. Use `<button>` exclusively.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: true,
      description: 'Use the lowest-weight variant that still makes the action clear.',
    },
    {
      guidance: false,
      description: 'Include more than one `solid` button in the same action group in one view.',
    },
    {
      guidance: false,
      description: 'Use `danger` for anything other than irreversible or destructive actions.',
    },
    {
      guidance: false,
      description:
        'Use `ghost` as the sole button in a form — it lacks sufficient affordance on its own.',
    },
    {
      guidance: true,
      description: 'Use sentence case for labels: "Save changes", not "Save Changes" or "SAVE".',
    },
    {
      guidance: true,
      description: 'Be specific: "Delete project" rather than "Delete" when context is ambiguous.',
    },
    {
      guidance: true,
      description: 'Lead labels with an action verb: "Save", "Send", "Add item".',
    },
    {
      guidance: true,
      description: 'Keep labels under 4 words where possible; never let one wrap to two lines.',
    },
    {
      guidance: false,
      description:
        'Use an ellipsis ("Save…") to imply a confirmation dialog — this is an outdated convention.',
    },
    {
      guidance: true,
      description:
        'Icons should visually reinforce the label, never contradict or replace it, unless `aria-label` is set.',
    },
    {
      guidance: true,
      description: 'Use `leftIcon` for directional actions, e.g. an upload arrow pointing up.',
    },
    {
      guidance: true,
      description:
        'Use `rightIcon` for navigation actions, e.g. a chevron pointing right for "Next".',
    },
    {
      guidance: false,
      description: 'Use both `leftIcon` and `rightIcon` on the same button.',
    },
    {
      guidance: true,
      description: 'Icon-only buttons must have `aria-label` and a tooltip.',
    },
    {
      guidance: false,
      description:
        'Render a `<div role="button">` for a clickable element — use `<button>` exclusively.',
    },
    {
      guidance: false,
      description:
        'Leave a `disabled` button unexplained — pair it with a tooltip or inline hint describing why.',
    },
  ],
  notes: `## Variants

| Variant   | Use case                                         | Background    | Border          | Text             |
| --------- | ------------------------------------------------ | ------------- | --------------- | ---------------- |
| \`solid\`   | Primary action per context (one per view max)    | \`accent.blue\` | none            | white            |
| \`outline\` | Secondary action alongside a \`solid\` button      | transparent   | \`border.subtle\` | \`text.primary\`   |
| \`ghost\`   | Tertiary or toolbar actions; low visual priority | transparent   | none            | \`text.muted\`     |
| \`danger\`  | Destructive actions (delete, revoke, reset)      | \`accent.red\`  | none            | \`text.on.danger\` |

## Sizes

| Size | Height | Padding (x) | Font size | Icon size |
| ---- | ------ | ----------- | --------- | --------- |
| \`sm\` | 28px   | 12px        | \`xs\`      | 14px      |
| \`md\` | 36px   | 16px        | \`sm\`      | 16px      |
| \`lg\` | 44px   | 20px        | \`md\`      | 18px      |

Default size: \`md\`. Touch targets MUST meet WCAG 2.2 SC 2.5.8 minimum of 24×24px (all sizes satisfy this).

## States

| State         | Visual treatment                                                                    |
| ------------- | ------------------------------------------------------------------------------------ |
| Default       | Base variant styles                                                                 |
| Hover         | Lighten/darken background by 10% using opacity                                      |
| Focus-visible | 2px solid \`accent.blue\` outline, 2px offset — keyboard only                         |
| Active        | Scale \`0.97\`, darken background by 15%                                              |
| Disabled      | \`opacity: 0.4\`, \`cursor: not-allowed\`, no pointer events                            |
| Loading       | Replace content with \`ThinkingIndicator\`; preserve button width; \`aria-busy="true"\` |

Focus ring MUST use \`:focus-visible\`, not \`:focus\`, to avoid showing the ring on mouse click.

Disabled state MUST use \`aria-disabled="true"\` + \`tabIndex={-1}\` rather than the HTML \`disabled\` attribute when the button must remain in the tab order for accessibility tools.

## Implementation notes

- Extend Chakra UI's \`Button\` recipe via \`defineRecipe\` in \`packages/core/src/theme.ts\`. Do not create a new element — wrap Chakra's \`Button\`.
- Animation timing for hover/active transitions: \`duration.fast\`.
- The \`loading\` prop SHOULD preserve the button's current width to prevent layout shift. Achieve this by keeping the label in the DOM with \`visibility: hidden\` and overlaying the \`ThinkingIndicator\`.
- \`type="button"\` default prevents accidental form submission when the button is inside a \`<form>\`.

## Sources

- [WAI-ARIA Authoring Practices Guide — Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — keyboard behavior and ARIA requirements
- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/) — contrast, touch target, and focus indicator criteria
- [Shopify Polaris — Button](https://polaris.shopify.com/components/actions/button) — variant and usage pattern reference
- [Google Material Design 3 — Buttons](https://m3.material.io/components/buttons/guidelines) — hierarchy and weight conventions
- [Radix UI Themes — Button](https://www.radix-ui.com/themes/docs/components/button) — loading and icon patterns
- [llms.txt specification — Answer.AI / Jeremy Howard, 2024](https://llmstxt.org/) — markdown-first, token-efficient documentation structure
- [Builder.io — AGENTS.md](https://www.builder.io/blog/agents-md) — agent-readable constraint documentation
- [Anthropic — Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — structured, explicit specs for LLM consumption
`,
}
