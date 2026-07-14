import type { ComponentDoc } from '@agentic-ds/component-doc'

// Fixture with intentional spec drift for update-component evals — do not fix.
export const doc: ComponentDoc = {
  name: 'Button',
  package: '@agentic-ds/core',
  category: 'action',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  tokens: {
    // SPEC DRIFT: one real token used in source (for text on accent
    // backgrounds) is missing from this list
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
    // SPEC DRIFT: one real prop (a string-literal-key prop in source) is
    // missing an entry here
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
      guidance: false,
      description:
        'Render a `<div role="button">` for a clickable element — use `<button>` exclusively.',
    },
  ],
  notes: `## Variants

| Variant   | Use case                                         | Background    | Border          | Text           |
| --------- | ------------------------------------------------ | ------------- | --------------- | -------------- |
| \`solid\`   | Primary action per context (one per view max)    | \`accent.blue\` | none            | white          |
| \`outline\` | Secondary action alongside a \`solid\` button      | transparent   | \`border.subtle\` | \`text.primary\` |
| \`ghost\`   | Tertiary or toolbar actions; low visual priority | transparent   | none            | \`text.muted\`   |
| \`danger\`  | Destructive actions (delete, revoke, reset)      | \`accent.red\`  | none            | white          |

## Sizes

| Size | Height | Padding (x) | Font size | Icon size |
| ---- | ------ | ----------- | --------- | --------- |
| \`sm\` | 28px   | 12px        | \`xs\`      | 14px      |
| \`md\` | 36px   | 16px        | \`sm\`      | 16px      |
| \`lg\` | 44px   | 20px        | \`md\`      | 18px      |

## States

Implement all states. Do not omit hover or focus-visible.

Focus ring MUST use \`:focus-visible\`, not \`:focus\`, to avoid showing the ring on mouse click.

Disabled state MUST use \`aria-disabled="true"\` + \`tabIndex={-1}\` rather than the HTML \`disabled\` attribute when the button must remain in the tab order for accessibility tools.
`,
  // SPEC DRIFT above: the States note's disabled-state tab-order guidance
  // contradicts what the real source actually implements.
}
