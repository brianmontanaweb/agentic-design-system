---
component: useReducedMotion
package: '@agentic-ds/core'
category: hook
status: implemented
tokens: n/a
wcag: AA
aria-pattern: n/a
mcp-states: n/a
---

# useReducedMotion

A React hook that returns `true` when the user has enabled the "reduce motion" accessibility preference (`prefers-reduced-motion: reduce`). Updates reactively when the OS preference changes at runtime.

---

## Signature

```ts
function useReducedMotion(): boolean
```

Returns `true` if `prefers-reduced-motion: reduce` is active, `false` otherwise. Returns `false` during SSR (no `window` access).

---

## When to use this hook vs AgenticProvider's CSS rule

`AgenticProvider` already injects a global CSS rule that collapses all `animation-duration` and `transition-duration` values inside `[data-agentic-ds]` to `0.01ms`. **For CSS-based animations and transitions, you do not need this hook** — the global rule handles it automatically.

Use `useReducedMotion()` only when you need to make a **JS-level branching decision** based on the motion preference:

| Scenario                                                                                          | Solution                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| CSS animation on a Chakra `Box` (`animation="ds-pulse..."`)                                       | AgenticProvider handles it — no hook needed |
| CSS `transition` on a Chakra style prop                                                           | AgenticProvider handles it — no hook needed |
| Conditionally rendering a component only when motion is allowed                                   | `useReducedMotion()`                        |
| Passing a reduced-motion-safe value to a JS animation library (e.g., Framer Motion, react-spring) | `useReducedMotion()`                        |
| Adjusting the number of animation frames or steps in a canvas/WebGL animation                     | `useReducedMotion()`                        |
| Skipping a particle effect or parallax effect entirely                                            | `useReducedMotion()`                        |

---

## Usage

```tsx
import { useReducedMotion } from '@agentic-ds/core'

function ParticleBackground() {
  const reducedMotion = useReducedMotion()

  // Skip the particle canvas entirely — CSS can't disable WebGL
  if (reducedMotion) return null

  return <ParticleCanvas />
}
```

```tsx
import { useReducedMotion } from '@agentic-ds/core'
import { motion } from 'framer-motion'

function SlideIn({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Accessibility

Requirements (WCAG 2.2 AA):

- When `useReducedMotion()` returns `true`, components MUST NOT play animations that involve motion (translation, scale, rotation). Fades are generally acceptable but SHOULD also be suppressed or shortened. _(WCAG SC 2.3.3)_
- Do NOT use this hook as a substitute for the AgenticProvider CSS rule. Always let the CSS rule suppress CSS animations; reserve this hook for JS-driven motion.
- This hook returns `false` during SSR. If rendering server-side with animations, ensure hydration does not cause a flash of animated content — prefer CSS-based suppression for SSR scenarios.

---

## Do / Don't

**Do:**

```tsx
// Disable a JS-driven animation library
const reduced = useReducedMotion()
const spring = useSpring({ x: 0, config: { duration: reduced ? 0 : 300 } })

// Skip a decorative animation component entirely
if (useReducedMotion()) return null
return <WaveAnimation />
```

**Don't:**

```tsx
// ❌ Using the hook to disable a CSS animation — AgenticProvider already does this
const reduced = useReducedMotion()
<Box animation={reduced ? 'none' : 'ds-pulse 1.2s infinite'} />

// ❌ Forgetting the hook when using a JS animation library
// framer-motion, react-spring, etc. ignore CSS prefers-reduced-motion rules
<motion.div animate={{ x: 100 }} /> // will animate even with reduced motion
```

---

## Sources

- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
- [prefers-reduced-motion: Taking a no-motion-first approach — CSS-Tricks](https://css-tricks.com/introduction-reduced-motion-media-query/)
