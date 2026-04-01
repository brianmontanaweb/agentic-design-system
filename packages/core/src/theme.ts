import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react'
import { fonts } from '@agentic-ds/tokens'

const buttonRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'body',
    fontWeight: 'medium',
    borderRadius: 'md',
    cursor: 'pointer',
    transition: 'all 100ms',
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'accent.blue',
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
        bg: 'accent.blue',
        color: 'white',
        _hover: { opacity: 0.85 },
        _active: { transform: 'scale(0.97)', opacity: 0.75 },
      },
      outline: {
        bg: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border.subtle',
        color: 'text.primary',
        _hover: { bg: 'bg.elevated' },
        _active: { bg: 'bg.elevated', transform: 'scale(0.97)' },
      },
      ghost: {
        bg: 'transparent',
        color: 'text.muted',
        _hover: { bg: 'bg.elevated', color: 'text.primary' },
        _active: { bg: 'bg.elevated', transform: 'scale(0.97)' },
      },
      danger: {
        bg: 'accent.red',
        color: 'white',
        _hover: { opacity: 0.85 },
        _active: { transform: 'scale(0.97)', opacity: 0.75 },
      },
    },
    size: {
      sm: { h: '28px', px: 3, fontSize: 'xs' },
      md: { h: '36px', px: 4, fontSize: 'sm' },
      lg: { h: '44px', px: 5, fontSize: 'md' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

const config = defineConfig({
  // Scope all CSS custom properties to the provider root element rather than
  // :root. This prevents the design system from leaking token values into the
  // host application's global scope when the library is imported.
  cssVarsRoot: '[data-agentic-ds]',
  theme: {
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      fonts: {
        mono: { value: fonts.mono },
        sans: { value: fonts.sans },
        heading: { value: fonts.sans },
        body: { value: fonts.sans },
      },
    },
    semanticTokens: {
      colors: {
        'bg.base': { value: { _dark: '#0a0a0f', _light: '#f8f9fa' } },
        'bg.surface': { value: { _dark: '#13131a', _light: '#ffffff' } },
        'bg.elevated': { value: { _dark: '#1c1c26', _light: '#f0f0f5' } },
        'border.subtle': { value: { _dark: '#2a2a38', _light: '#e2e2e8' } },
        'text.primary': { value: { _dark: '#f0f0f5', _light: '#0a0a0f' } },
        'text.muted': { value: { _dark: '#8888aa', _light: '#6666aa' } },
        'accent.blue': { value: { _dark: '#4d9fff', _light: '#2563eb' } },
        'accent.green': { value: { _dark: '#3dd68c', _light: '#16a34a' } },
        'accent.amber': { value: { _dark: '#f59e0b', _light: '#d97706' } },
        'accent.red': { value: { _dark: '#f87171', _light: '#dc2626' } },
      },
    },
  },
  // No globalCss — libraries must not set styles on body or any global selector.
})

export const system = createSystem(defaultConfig, config)
