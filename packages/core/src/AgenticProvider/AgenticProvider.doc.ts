import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'AgenticProvider',
  package: '@agentic-ds/core',
  category: 'provider',
  status: 'implemented',
  wcag: 'AA',
  tokens: 'all',
  description:
    'The root provider for the design system. Every application using `@agentic-ds/core` or `@agentic-ds/agents` MUST render `AgenticProvider` at the top of the component tree.',
  props: {
    children: {
      type: 'ReactNode',
      required: true,
      description: 'Application content to render inside the provider.',
    },
    colorScheme: {
      type: '"dark" | "light" | "system"',
      required: false,
      default: '"dark"',
      description:
        'Controlled color scheme. `"dark"`/`"light"` pin the mode; `"system"` follows the OS `prefers-color-scheme` and live-updates. Hosts toggle by re-rendering the prop.',
    },
    theme: {
      type: 'AgenticTheme',
      required: false,
      default: 'stock theme',
      description:
        'Branded theme created by `defineAgenticTheme()`. Create it once at module scope — never inside render.',
    },
    injectStyles: {
      type: 'boolean',
      required: false,
      default: 'true',
      description:
        "Set `false` for CSP-strict documents (`style-src` without `unsafe-inline`) that link the built stylesheet (`@agentic-ds/mcp-builder/iife/css`) instead of relying on the provider's inline `<style>` keyframes.",
    },
  },
  ariaNotes: [
    '`AgenticProvider` MUST be present for all ARIA live regions, semantic tokens, and keyboard focus indicators to function correctly. Do not render agent components outside a provider. _(WCAG SC 1.3.1, 4.1.2)_',
    '`prefers-reduced-motion` MUST be respected globally — AgenticProvider handles this automatically via the injected `<style>` block. Do not override `animation-duration` or `transition-duration` with `!important` inside components. _(WCAG SC 2.3.3)_',
    'Color mode MUST NOT be changed without user intent. The `colorScheme` prop is controlled — hold it in host state and update it only from a user-initiated toggle (or pass `"system"` to follow the OS preference the user already expressed).',
  ].join('\n'),
  bestPractices: [
    {
      guidance: true,
      description:
        'Create themes with `defineAgenticTheme()` at module scope — calling it during render rebuilds the entire style system on every update.',
    },
    {
      guidance: true,
      description:
        'Override semantic status colors (`color.agent.status.*`, `color.tool.status.*`, `color.accent.success/warning/danger`) only via the `colors` option, and only with equivalent-meaning hues — `accent` and `neutralWarmth` deliberately leave them untouched because their hue carries meaning.',
    },
    {
      guidance: true,
      description:
        'Give each theme a `name` when providers with different themes coexist on one page — unnamed themes all scope to `[data-agentic-ds]` and collide.',
    },
    {
      guidance: true,
      description: 'Render exactly one `AgenticProvider` at the application root.',
    },
    {
      guidance: false,
      description:
        'Nest one `AgenticProvider` inside another — this produces duplicate token scopes and undefined token resolution behavior.',
    },
    {
      guidance: false,
      description:
        'Render design system components without a provider ancestor — their semantic tokens will not resolve.',
    },
    {
      guidance: false,
      description:
        'Import `ChakraProvider` from `@chakra-ui/react` or `system` from `@agentic-ds/core` directly — both are banned by the `no-restricted-imports` lint rule; use `AgenticProvider` and `defineAgenticTheme()` instead.',
    },
  ],
  notes: `## Theming — \`defineAgenticTheme()\`

\`defineAgenticTheme(options)\` is the sanctioned branding extension point. It builds a complete Chakra system from the stock semantic tokens plus the requested adjustments, and returns an opaque \`AgenticTheme\` handle for the \`theme\` prop. Importing the Chakra \`system\` directly remains banned by lint.

### Options

| Option          | Type                                            | Effect                                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \`accent\`        | \`string \\| { dark?: string; light?: string }\`   | Hex color for \`color.accent.interactive\` (buttons, focus rings, links). \`color.text.on.accent\` is re-derived per mode by WCAG contrast unless overridden.                                                                |
| \`neutralWarmth\` | \`number\` (−1 … 1)                               | Parametric OKLCH tint of the neutral tokens (\`color.surface.*\`, \`color.border.subtle\`, \`color.text.primary/muted\`). Positive = warm amber cast, negative = cool blue. Lightness — and therefore contrast — is preserved. |
| \`colors\`        | \`Partial<Record<AgenticColorToken, ModeColor>>\` | Per-token escape hatch, applied last. Keys are typed semantic token paths (e.g. \`'color.stream.cursor'\`).                                                                                                                |
| \`name\`          | \`string\` (kebab-case)                           | Scopes the theme's CSS variables to \`[data-agentic-ds][data-agentic-theme="<name>"]\`. Required only when providers with _different_ themes share a page.                                                                 |

All hex inputs are validated (\`#rgb\`/\`#rrggbb\`); invalid values, unknown token paths, out-of-range warmth, and malformed names throw at theme-creation time.

## CSS scoping contract

The \`[data-agentic-ds]\` attribute is the CSS boundary for the entire design system. This attribute MUST NOT be placed on a descendant of another \`[data-agentic-ds]\` element — nesting two \`AgenticProvider\` instances produces undefined token resolution behavior.

For MCP App iframe embedding, the iframe document SHOULD render its own \`AgenticProvider\` as the outermost element, ensuring the iframe's token scope is fully self-contained.

### CSP-strict embedding

The provider's default inline \`<style>\` keyframes are refused under a \`style-src\` policy without \`unsafe-inline\`. For those documents, link the built stylesheet (\`@agentic-ds/mcp-builder/iife/css\`) and pass \`injectStyles={false}\`.

The built stylesheet carries the same keyframes and reduced-motion rules plus all \`--ds-*\` custom properties (both color modes). Chakra's own component styles are unaffected by CSP: in the production IIFE bundle they are inserted via CSSOM \`insertRule\`, which \`style-src\` does not restrict. The artifact captures the stock theme only — \`defineAgenticTheme()\` output is runtime-emitted, so branded CSP-strict embeds are not yet supported.

## Animation keyframes

Two keyframes are injected globally (not scoped to \`[data-agentic-ds]\`, since \`@keyframes\` inside selectors requires CSS Nesting support). The \`ds-\` prefix prevents collisions with host application keyframe names.

| Name       | Used by                                                                | Motion                |
| ---------- | ------------------------------------------------------------------------ | ---------------------- |
| \`ds-pulse\` | \`ThinkingIndicator\`, \`Button\` loading dots, \`AgentStatus\` running dot | Scale + opacity pulse |
| \`ds-blink\` | \`StreamingText\` cursor                                                | Opacity blink         |

Components reference these by name via the \`animation\` CSS property, pairing the keyframe name with a duration token and easing, e.g. \`ds-pulse ease-in-out infinite\`.

### Reduced-motion

Under \`prefers-reduced-motion: reduce\`:

- \`ds-pulse\` and \`ds-blink\` are redefined as no-ops (static values, no movement).
- All \`animation-duration\` and \`transition-duration\` inside \`[data-agentic-ds]\` are collapsed to a near-zero value with \`!important\`.

This satisfies WCAG 2.2 SC 2.3.3 (Animation from Interactions, AAA) and SC 2.3.1 (Three Flashes or Below Threshold, AA).

## SSR note

With \`colorScheme="system"\` during SSR, the first render resolves to dark (no \`matchMedia\` on the server) and corrects itself after hydration if the OS prefers light.

## Sources

- [Chakra UI v3 — createSystem](https://www.chakra-ui.com/docs/theming/overview)
- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
- [CSS \`cssVarsRoot\` scoping](https://www.chakra-ui.com/docs/theming/token-reference)
`,
}
