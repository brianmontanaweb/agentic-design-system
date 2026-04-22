import type { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { system } from '../theme'

export interface AgenticProviderProps {
  children: ReactNode
  defaultColorScheme?: 'dark' | 'light'
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
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`

export function AgenticProvider({ children, defaultColorScheme = 'dark' }: AgenticProviderProps) {
  return (
    // data-agentic-ds is the cssVarsRoot selector in theme.ts — all Chakra
    // CSS custom properties are scoped to this element, not :root.
    // ThemeProvider sets data-theme / class on this element for color mode.
    <div data-agentic-ds="">
      <style>{keyframes}</style>
      <ChakraProvider value={system}>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultColorScheme}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ChakraProvider>
    </div>
  )
}
