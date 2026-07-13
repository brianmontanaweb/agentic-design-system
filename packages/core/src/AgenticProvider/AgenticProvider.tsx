import { useEffect, useState, type ReactElement, type ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { durations } from '@agentic-ds/tokens'
import { defaultTheme, type AgenticTheme } from '../theme'

export type ColorScheme = 'dark' | 'light' | 'system'

export interface AgenticProviderProps {
  children: ReactNode
  /**
   * Controlled color scheme. 'dark' (default) and 'light' pin the mode;
   * 'system' follows the OS prefers-color-scheme and live-updates on change.
   * Hosts with their own theme toggle re-render with the new value.
   */
  colorScheme?: ColorScheme
  /**
   * Branded theme created by defineAgenticTheme(). Defaults to the stock
   * theme. Create it once at module scope — not inside render — so the
   * underlying style system is stable across re-renders.
   */
  theme?: AgenticTheme
}

// Keyframe names use the ds- prefix to prevent collisions in the host app's
// global stylesheet. Scoping @keyframes inside a selector requires CSS Nesting
// (Level 4) which isn't universally supported — top-level declarations are
// safer. The ds- prefix is the primary collision guard.
const keyframes = `
@keyframes ds-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.85); }
  50%       { opacity: 1;   transform: scale(1); }
}
@keyframes ds-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes ds-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 1; transform: scale(1); }
  }
  @keyframes ds-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 1; }
  }
  [data-agentic-ds] *, [data-agentic-ds] *::before, [data-agentic-ds] *::after {
    animation-duration: ${durations.instant.$value} !important;
    transition-duration: ${durations.instant.$value} !important;
  }
}
`

// SSR has no matchMedia, so the first render resolves to dark (the brand
// default) and corrects itself after hydration if the OS prefers light.
function useSystemScheme(): 'dark' | 'light' {
  const [scheme, setScheme] = useState<'dark' | 'light'>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => setScheme(e.matches ? 'light' : 'dark')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return scheme
}

export function AgenticProvider({
  children,
  colorScheme = 'dark',
  theme = defaultTheme,
}: AgenticProviderProps): ReactElement {
  const systemScheme = useSystemScheme()
  const resolved = colorScheme === 'system' ? systemScheme : colorScheme
  return (
    // data-agentic-ds is the cssVarsRoot selector in theme.ts — all Chakra
    // CSS custom properties are scoped to this element, not :root.
    // data-color-mode is the single color-mode signal: theme.ts conditions
    // and the static tokens.css both key off it, and it stays on this wrapper
    // so multiple providers with different schemes can coexist on one page.
    // data-agentic-theme (named themes only) narrows the cssVarsRoot so
    // differently-branded providers can also coexist — the two-attribute
    // selector out-specifies the stock [data-agentic-ds] one.
    // color-scheme makes UA rendering (scrollbars, form controls) match the
    // mode; being inherited CSS, it covers the subtree without touching the
    // host page — hosts own their own canvas color-scheme.
    <div
      data-agentic-ds=""
      data-agentic-theme={theme.name}
      data-color-mode={resolved}
      style={{ colorScheme: resolved }}
    >
      <style>{keyframes}</style>
      <ChakraProvider value={theme.system}>{children}</ChakraProvider>
    </div>
  )
}
