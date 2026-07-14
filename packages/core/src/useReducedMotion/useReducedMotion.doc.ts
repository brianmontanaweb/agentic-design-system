import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: 'useReducedMotion',
  package: '@agentic-ds/core',
  category: 'hook',
  status: 'implemented',
  wcag: 'AA',
  description:
    'A React hook that returns `true` when the user has enabled the "reduce motion" accessibility preference (`prefers-reduced-motion: reduce`). Updates reactively when the OS preference changes at runtime.',
  props: {},
  ariaNotes: [
    'When `useReducedMotion()` returns `true`, components MUST NOT play animations that involve motion (translation, scale, rotation). Fades are generally acceptable but SHOULD also be suppressed or shortened. _(WCAG SC 2.3.3)_',
    'Do NOT use this hook as a substitute for the AgenticProvider CSS rule. Always let the CSS rule suppress CSS animations; reserve this hook for JS-driven motion.',
    'This hook returns `false` during SSR. If rendering server-side with animations, ensure hydration does not cause a flash of animated content — prefer CSS-based suppression for SSR scenarios.',
  ].join('\n'),
  bestPractices: [
    {
      guidance: true,
      description:
        'Use this hook only for JS-level branching decisions based on the motion preference: conditionally rendering a component, passing a reduced-motion-safe value to a JS animation library (Framer Motion, react-spring), adjusting canvas/WebGL animation frames, or skipping a particle/parallax effect entirely.',
    },
    {
      guidance: false,
      description:
        "Use this hook to disable a CSS animation or transition on a Chakra style prop — AgenticProvider's global CSS rule already collapses those to a near-zero duration automatically.",
    },
    {
      guidance: false,
      description:
        'Forget this hook when using a JS animation library — libraries like framer-motion and react-spring ignore the CSS `prefers-reduced-motion` media query entirely.',
    },
  ],
  notes: `## Signature

\`\`\`ts
function useReducedMotion(): boolean
\`\`\`

Returns \`true\` if \`prefers-reduced-motion: reduce\` is active, \`false\` otherwise. Returns \`false\` during SSR (no \`window\` access).

## When to use this hook vs AgenticProvider's CSS rule

\`AgenticProvider\` already injects a global CSS rule that collapses all \`animation-duration\` and \`transition-duration\` values inside \`[data-agentic-ds]\` to a near-zero duration. For CSS-based animations and transitions, this hook is not needed — the global rule handles it automatically. Reach for \`useReducedMotion()\` only when making a JS-level branching decision: conditionally rendering a component, passing a value to a JS animation library, adjusting canvas/WebGL frame counts, or skipping a decorative particle/parallax effect.

## Sources

- [MDN — \`prefers-reduced-motion\`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
- [prefers-reduced-motion: Taking a no-motion-first approach — CSS-Tricks](https://css-tricks.com/introduction-reduced-motion-media-query/)
`,
}
