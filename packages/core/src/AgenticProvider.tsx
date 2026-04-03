import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { system } from './theme'

export interface AgenticProviderProps {
  children: React.ReactNode
  defaultColorScheme?: 'dark' | 'light'
}

// Keyframes are scoped to [data-agentic-ds] so they don't pollute the host
// app's global stylesheet. The @keyframe names use a ds- prefix to further
// reduce collision risk, but scoping to the wrapper is the primary guard.
const keyframes = `
[data-agentic-ds] {
  @keyframes ds-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.85); }
    50%       { opacity: 1;   transform: scale(1); }
  }
  @keyframes ds-blink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-agentic-ds] {
    @keyframes ds-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 1; transform: scale(1); }
    }
    @keyframes ds-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 1; }
    }
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
