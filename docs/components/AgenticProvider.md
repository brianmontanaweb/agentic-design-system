---
component: AgenticProvider
package: "@agentic-ds/core"
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
2. **Color mode** — delegates to `next-themes` via a `ThemeProvider`; applies `class` attribute for Tailwind-compatible dark mode toggling.
3. **Animation keyframes** — injects `@keyframes ds-pulse` and `@keyframes ds-blink` (and their `prefers-reduced-motion` overrides) into a scoped `<style>` element.
4. **Reduced-motion enforcement** — under `@media (prefers-reduced-motion: reduce)`, all `animation-duration` and `transition-duration` values inside `[data-agentic-ds]` are collapsed to `0.01ms`.

---

## Props

| Prop                | Type                 | Default  | Description                                              |
|---------------------|----------------------|----------|----------------------------------------------------------|
| `children`          | `ReactNode`          | —        | Application content to render inside the provider.       |
| `defaultColorScheme`| `"dark" \| "light"` | `"dark"` | Initial color mode when no user preference is stored.    |

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

| Name         | Used by                                               | Motion            |
|--------------|-------------------------------------------------------|-------------------|
| `ds-pulse`   | `ThinkingIndicator`, `Button` loading dots, `AgentStatus` running dot | Scale + opacity pulse |
| `ds-blink`   | `StreamingText` cursor                                | Opacity blink     |

Components reference these by name: `animation: 'ds-pulse 1.2s ease-in-out infinite'`.

### Reduced-motion

Under `prefers-reduced-motion: reduce`:
- `ds-pulse` and `ds-blink` are redefined as no-ops (static values, no movement).
- All `animation-duration` and `transition-duration` inside `[data-agentic-ds]` are set to `0.01ms !important`.

This satisfies WCAG 2.2 SC 2.3.3 (Animation from Interactions, AAA) and SC 2.3.1 (Three Flashes or Below Threshold, AA).

---

## Accessibility

Requirements (WCAG 2.2 AA):

- `AgenticProvider` MUST be present for all ARIA live regions, semantic tokens, and keyboard focus indicators to function correctly. Do not render agent components outside a provider. *(WCAG SC 1.3.1, 4.1.2)*
- `prefers-reduced-motion` MUST be respected globally — AgenticProvider handles this automatically via the injected `<style>` block. Do not override `animation-duration` or `transition-duration` with `!important` inside components. *(WCAG SC 2.3.3)*
- Color mode MUST NOT be changed without user intent. Use `defaultColorScheme` to set an initial mode; use `next-themes`' `useTheme()` hook to respond to user-initiated changes.

---

## Do / Don't

**Do:**
```tsx
// Wrap the entire application
import { AgenticProvider } from '@agentic-ds/core'

function App() {
  return (
    <AgenticProvider defaultColorScheme="dark">
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
import { system } from '@agentic-ds/core'         // banned by no-restricted-imports rule
```

---

## Sources

- [next-themes documentation](https://github.com/pacocoursey/next-themes)
- [Chakra UI v3 — createSystem](https://www.chakra-ui.com/docs/theming/overview)
- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)
- [CSS `cssVarsRoot` scoping](https://www.chakra-ui.com/docs/theming/token-reference)
