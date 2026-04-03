import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react'
import { fonts, colors } from '@agentic-ds/tokens'

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
        mono:    { value: fonts.mono.$value },
        sans:    { value: fonts.sans.$value },
        heading: { value: fonts.sans.$value },
        body:    { value: fonts.sans.$value },
      },
    },
    semanticTokens: {
      colors: {
        // ---- Base surfaces ----
        'bg.base':      { value: { _dark: colors.bgBase.$value,       _light: '#f8f9fa' } },
        'bg.surface':   { value: { _dark: colors.bgSurface.$value,    _light: '#ffffff' } },
        'bg.elevated':  { value: { _dark: colors.bgElevated.$value,   _light: '#f0f0f5' } },
        'border.subtle':{ value: { _dark: colors.borderSubtle.$value, _light: '#e2e2e8' } },
        'text.primary': { value: { _dark: colors.textPrimary.$value,  _light: '#0a0a0f' } },
        'text.muted':   { value: { _dark: colors.textMuted.$value,    _light: '#6666aa' } },

        // ---- Accent palette ----
        'accent.blue':  { value: { _dark: colors.accentBlue.$value,  _light: '#2563eb' } },
        'accent.green': { value: { _dark: colors.accentGreen.$value, _light: '#16a34a' } },
        'accent.amber': { value: { _dark: colors.accentAmber.$value, _light: '#d97706' } },
        'accent.red':   { value: { _dark: colors.accentRed.$value,   _light: '#dc2626' } },

        // ---- Step background tints (ProgressSteps) ----
        // 8-digit hex: RRGGBBAA — 0x22 ≈ 13% opacity tint over the step circle background.
        'bg.step.active':   { value: { _dark: '#4d9fff22', _light: '#2563eb22' } },
        'bg.step.complete': { value: { _dark: '#3dd68c22', _light: '#16a34a22' } },
        'bg.step.waiting':  { value: { _dark: '#f59e0b22', _light: '#d9770622' } },

        // ---- Semantic alias tier: MCP agent lifecycle states ----
        // Use these in agent components instead of raw accent tokens.
        'color.agent.status.idle':      { value: { _dark: colors.textMuted.$value,    _light: '#6666aa' } },
        'color.agent.status.running':   { value: { _dark: colors.accentBlue.$value,   _light: '#2563eb' } },
        'color.agent.status.waiting':   { value: { _dark: colors.accentAmber.$value,  _light: '#d97706' } },
        'color.agent.status.done':      { value: { _dark: colors.accentGreen.$value,  _light: '#16a34a' } },
        'color.agent.status.error':     { value: { _dark: colors.accentRed.$value,    _light: '#dc2626' } },
        'color.agent.status.cancelled': { value: { _dark: colors.textMuted.$value,    _light: '#6666aa' } },

        // ---- Semantic alias tier: tool call lifecycle states ----
        'color.tool.status.pending': { value: { _dark: colors.textMuted.$value,    _light: '#6666aa' } },
        'color.tool.status.running': { value: { _dark: colors.accentBlue.$value,   _light: '#2563eb' } },
        'color.tool.status.done':    { value: { _dark: colors.accentGreen.$value,  _light: '#16a34a' } },
        'color.tool.status.error':   { value: { _dark: colors.accentRed.$value,    _light: '#dc2626' } },

        // ---- Semantic alias tier: message role backgrounds ----
        'color.message.user.bg':      { value: { _dark: colors.bgElevated.$value,   _light: '#f0f0f5' } },
        'color.message.assistant.bg': { value: { _dark: colors.bgSurface.$value,    _light: '#ffffff' } },
        'color.message.tool.bg':      { value: { _dark: colors.bgElevated.$value,   _light: '#f0f0f5' } },
        'color.message.tool.border':  { value: { _dark: colors.borderSubtle.$value, _light: '#e2e2e8' } },
      },
    },
  },
  // No globalCss — libraries must not set styles on body or any global selector.
})

export const system = createSystem(defaultConfig, config)
