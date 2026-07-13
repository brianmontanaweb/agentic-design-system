import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react'
import {
  fonts,
  colorModes,
  durations,
  lineHeights,
  radii,
  shadows,
  zIndex,
  spacing,
  fontSizes,
  fontWeights,
} from '@agentic-ds/tokens'

export const buttonRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'body',
    fontWeight: 'medium',
    borderRadius: 'md',
    border: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    transition: `all ${durations.fast.$value}`,
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'color.accent.interactive',
      outlineOffset: '2px',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'color.accent.interactive',
        color: 'color.text.on.accent',
        _hover: { opacity: 0.85 },
        _active: { transform: 'scale(0.97)', opacity: 0.75 },
      },
      outline: {
        bg: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'color.border.subtle',
        color: 'color.text.primary',
        _hover: { bg: 'color.surface.elevated' },
        _active: { bg: 'color.surface.elevated', transform: 'scale(0.97)' },
      },
      ghost: {
        bg: 'transparent',
        color: 'color.text.muted',
        _hover: { bg: 'color.surface.elevated', color: 'color.text.primary' },
        _active: { bg: 'color.surface.elevated', transform: 'scale(0.97)' },
      },
      danger: {
        bg: 'color.accent.danger',
        color: 'color.text.on.accent',
        _hover: { opacity: 0.85 },
        _active: { transform: 'scale(0.97)', opacity: 0.75 },
      },
    },
    size: {
      sm: { h: '28px', px: 3, fontSize: 'xs', gap: 1 },
      md: { h: '36px', px: 4, fontSize: 'sm', gap: 2 },
      lg: { h: '44px', px: 5, fontSize: 'md', gap: 2 },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

// Convert DTCG token group to Chakra token format ({ value: string })
function toCW<T extends Record<string, { $value: string | number }>>(
  group: T
): Record<keyof T, { value: string }> {
  return Object.fromEntries(
    Object.entries(group).map(([k, t]) => [k, { value: String(t.$value) }])
  ) as Record<keyof T, { value: string }>
}

// Every colorModes entry becomes a Chakra semantic token under its own dot
// path (e.g. 'color.surface.base', 'color.agent.status.running'), so the
// light/dark mapping is derived from the token source, never hand-maintained.
// Per-token rationale (e.g. the color.text.on.accent contrast flip) lives in
// the $description fields in packages/tokens/tokens/*.json.
const semanticColors: Record<string, { value: { _dark: string; _light: string } }> =
  Object.fromEntries(
    Object.entries(colorModes).map(([path, token]) => [
      path,
      { value: { _dark: token.dark, _light: token.light } },
    ])
  )

const config = defineConfig({
  // Scope all CSS custom properties to the provider root element rather than
  // :root. This prevents the design system from leaking token values into the
  // host application's global scope when the library is imported.
  cssVarsRoot: '[data-agentic-ds]',
  // Color mode is driven exclusively by the data-color-mode attribute that
  // AgenticProvider stamps on the [data-agentic-ds] wrapper — the same signal
  // the static tokens.css honors. Chakra's default .dark/.light class
  // conditions are deliberately replaced: no <html> mutation, and multiple
  // providers with different schemes can coexist on one page.
  conditions: {
    dark: '&:is([data-color-mode=dark], [data-color-mode=dark] *)',
    light: '&:is([data-color-mode=light], [data-color-mode=light] *)',
  },
  theme: {
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      fonts: toCW(fonts),
      spacing: toCW(spacing),
      fontSizes: toCW(fontSizes),
      fontWeights: toCW(fontWeights),
      lineHeights: toCW(lineHeights),
      radii: toCW(radii),
      shadows: toCW(shadows),
      durations: {
        fast: { value: durations.fast.$value },
        normal: { value: durations.normal.$value },
        slow: { value: durations.slow.$value },
      },
      zIndex: toCW(zIndex),
    },
    semanticTokens: {
      colors: semanticColors,
    },
  },
  // Scoped to [data-agentic-ds] — does not touch :root or body.
  globalCss: {
    '[data-agentic-ds]': {
      '@media (prefers-reduced-motion: reduce)': {
        '& *, & *::before, & *::after': {
          animationDuration: `${durations.instant.$value} !important`,
          transitionDuration: `${durations.instant.$value} !important`,
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
