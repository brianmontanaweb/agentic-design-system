---
component: AgenticProvider
package: '@agentic-ds/core'
category: provider
status: implemented
tokens:
  colors: [all semantic tokens — AgenticProvider is the token resolution root]
wcag: AA
aria-pattern: n/a
mcp-states: n/a
---

# AgenticProvider

The root provider for the design system. Every application using `@agentic-ds/core` or `@agentic-ds/agents` MUST render `AgenticProvider` at the top of the component tree. It is responsible for:

1. **CSS custom property scope** — all Chakra token variables are emitted under `[data-agentic-ds]`, not `:root`, so the design system never leaks into the host application's global stylesheet.
2. **Color mode** — stamps `data-color-mode="dark" | "light"` on the `[data-agentic-ds]` wrapper, the single signal that drives both the Chakra `_dark`/`_light` conditions (theme.ts) and the static `tokens.css`. The provider never mutates `<html>` or writes storage; mode is fully scoped to its own subtree, so multiple providers with different schemes can coexist.
3. **Animation keyframes** — injects `@keyframes ds-pulse` and `@keyframes ds-blink` (and their `prefers-reduced-motion` overrides) into a scoped `<style>` element.
4. **Reduced-motion enforcement** — under `@media (prefers-reduced-motion: reduce)`, all `animation-duration` and `transition-duration` values inside `[data-agentic-ds]` are collapsed to `0.01ms`.

---

## Props

| Prop          | Type                            | Default     | Description                                                                                                                                                         |
| ------------- | ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`    | `ReactNode`                     | —           | Application content to render inside the provider.                                                                                                                  |
| `colorScheme` | `"dark" \| "light" \| "system"` | `"dark"`    | Controlled color scheme. `"dark"`/`"light"` pin the mode; `"system"` follows the OS `prefers-color-scheme` and live-updates. Hosts toggle by re-rendering the prop. |
| `theme`       | `AgenticTheme`                  | stock theme | Branded theme created by `defineAgenticTheme()`. Create it once at module scope — never inside render.                                                              |

With `colorScheme="system"` during SSR, the first render resolves to dark (no `matchMedia` on the server) and corrects itself after hydration if the OS prefers light.

---

## Theming — `defineAgenticTheme()`

`defineAgenticTheme(options)` is the sanctioned branding extension point. It builds a complete Chakra system from the stock semantic tokens plus the requested adjustments, and returns an opaque `AgenticTheme` handle for the `theme` prop. Importing the Chakra `system` directly remains banned by lint.

```tsx
import { AgenticProvider, defineAgenticTheme } from '@agentic-ds/core'

const theme = defineAgenticTheme({
  accent: '#e8590c',
  neutralWarmth: 0.5,
})

export function App() {
  return (
    <AgenticProvider theme={theme}>
      <Dashboard />
    </AgenticProvider>
  )
}
```

### Options

| Option          | Type                                            | Effect                                                                                                                                                                                                                   |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `accent`        | `string \| { dark?: string; light?: string }`   | Hex color for `color.accent.interactive` (buttons, focus rings, links). `color.text.on.accent` is re-derived per mode by WCAG contrast unless overridden.                                                                |
| `neutralWarmth` | `number` (−1 … 1)                               | Parametric OKLCH tint of the neutral tokens (`color.surface.*`, `color.border.subtle`, `color.text.primary/muted`). Positive = warm amber cast, negative = cool blue. Lightness — and therefore contrast — is preserved. |
| `colors`        | `Partial<Record<AgenticColorToken, ModeColor>>` | Per-token escape hatch, applied last. Keys are typed semantic token paths (e.g. `'color.stream.cursor'`).                                                                                                                |
| `name`          | `string` (kebab-case)                           | Scopes the theme's CSS variables to `[data-agentic-ds][data-agentic-theme="<name>"]`. Required only when providers with _different_ themes share a page.                                                                 |

Rules:

- Themes MUST be created at module scope. `defineAgenticTheme` builds a full style system; calling it in render churns styles on every update.
- Semantic status colors (`color.agent.status.*`, `color.tool.status.*`, `color.accent.success/warning/danger`) are deliberately untouched by `accent` and `neutralWarmth` — their hue carries meaning. Override them via `colors` only with equivalent-meaning hues.
- All hex inputs are validated (`#rgb`/`#rrggbb`); invalid values, unknown token paths, out-of-range warmth, and malformed names throw at theme-creation time.
- Multiple providers with different **unnamed** themes on one page collide (all scope to `[data-agentic-ds]`). Give each theme a `name` in that case.

---

## CSS scoping contract

The `[data-agentic-ds]` attribute is the CSS boundary for the entire design system. This attribute MUST NOT be placed on a descendant of another `[data-agentic-ds]` element — nesting two `AgenticProvider` instances produces undefined token resolution behavior.

```tsx
// CORRECT — single provider at the app root
<AgenticProvider>
  <App />
</AgenticProvider>

// WRONG — nested providers
<AgenticProvider>
  <AgenticProvider> {/* ❌ produces duplicate token scopes */}
    <Widget />
  </AgenticProvider>
</AgenticProvider>
```

For MCP App iframe embedding, the iframe document SHOULD render its own `AgenticProvider` as the outermost element, ensuring the iframe's token scope is fully self-contained.

---

## Animation keyframes

Two keyframes are injected globally (not scoped to `[data-agentic-ds]`, since `@keyframes` inside selectors requires CSS Nesting support). The `ds-` prefix prevents collisions with host application keyframe names.

| Name       | Used by                                                               | Motion                |
| ---------- | --------------------------------------------------------------------- | --------------------- |
| `ds-pulse` | `ThinkingIndicator`, `Button` loading dots, `AgentStatus` running dot | Scale + opacity pulse |
| `ds-blink` | `StreamingText` cursor                                                | Opacity blink         |

Components reference these by name: `animation: 'ds-pulse 1.2s ease-in-out infinite'`.

### Reduced-motion

Under `prefers-reduced-motion: reduce`:

- `ds-pulse` and `ds-blink` are redefined as no-ops (static values, no movement).
- All `animation-duration` and `transition-duration` inside `[data-agentic-ds]` are set to `0.01ms !important`.

This satisfies WCAG 2.2 SC 2.3.3 (Animation from Interactions, AAA) and SC 2.3.1 (Three Flashes or Below Threshold, AA).

---

## Accessibility

Requirements (WCAG 2.2 AA):

- `AgenticProvider` MUST be present for all ARIA live regions, semantic tokens, and keyboard focus indicators to function correctly. Do not render agent components outside a provider. _(WCAG SC 1.3.1, 4.1.2)_
- `prefers-reduced-motion` MUST be respected globally — AgenticProvider handles this automatically via the injected `<style>` block. Do not override `animation-duration` or `transition-duration` with `!important` inside components. _(WCAG SC 2.3.3)_
- Color mode MUST NOT be changed without user intent. The `colorScheme` prop is controlled — hold it in host state and update it only from a user-initiated toggle (or pass `"system"` to follow the OS preference the user already expressed).

---

## Do / Don't

**Do:**

```tsx
// Wrap the entire application
import { AgenticProvider } from '@agentic-ds/core'

function App() {
  const [scheme, setScheme] = useState<'dark' | 'light'>('dark')
  return (
    <AgenticProvider colorScheme={scheme}>
      <Router>
        <Routes />
      </Router>
    </AgenticProvider>
  )
}

// Use in a self-contained MCP App iframe
export function McpAppRoot() {
  return (
    <AgenticProvider>
      <AgentDashboard />
    </AgenticProvider>
  )
}
```

**Don't:**

```tsx
// ❌ Using design system components without a provider
import { Button } from '@agentic-ds/core'
function Orphan() {
  return <Button>Save</Button> // tokens won't resolve
}

// ❌ Importing ChakraProvider or system directly
import { ChakraProvider } from '@chakra-ui/react' // banned by no-restricted-imports rule
import { system } from '@agentic-ds/core' // banned by no-restricted-imports rule

// ❌ Creating a theme inside render — rebuilds the style system every update
function App() {
  const theme = defineAgenticTheme({ accent: '#e8590c' }) // move to module scope
  return <AgenticProvider theme={theme}>…</AgenticProvider>
}
```

---

## Sources

- [Chakra UI v3 — createSystem](https://www.chakra-ui.com/docs/theming/overview)
- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
- [CSS `cssVarsRoot` scoping](https://www.chakra-ui.com/docs/theming/token-reference)
