import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react'
import { fonts, colors, lightColors, stepTints, duration } from '@agentic-ds/tokens'

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
    transition: `all ${duration.fast.$value}`,
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
        color: 'color.on.accent',
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
        color: 'color.on.accent',
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
        mono: { value: fonts.mono.$value },
        sans: { value: fonts.sans.$value },
        heading: { value: fonts.sans.$value },
        body: { value: fonts.sans.$value },
      },
    },
    semanticTokens: {
      colors: {
        // ---- Base surfaces ----
        'bg.base': { value: { _dark: colors.bgBase.$value, _light: lightColors.bgBase.$value } },
        'bg.surface': {
          value: { _dark: colors.bgSurface.$value, _light: lightColors.bgSurface.$value },
        },
        'bg.elevated': {
          value: { _dark: colors.bgElevated.$value, _light: lightColors.bgElevated.$value },
        },
        'border.subtle': {
          value: { _dark: colors.borderSubtle.$value, _light: lightColors.borderSubtle.$value },
        },
        'text.primary': {
          value: { _dark: colors.textPrimary.$value, _light: lightColors.textPrimary.$value },
        },
        'text.muted': {
          value: { _dark: colors.textMuted.$value, _light: lightColors.textMuted.$value },
        },

        // ---- Accent palette ----
        'accent.blue': {
          value: { _dark: colors.accentBlue.$value, _light: lightColors.accentBlue.$value },
        },
        'accent.green': {
          value: { _dark: colors.accentGreen.$value, _light: lightColors.accentGreen.$value },
        },
        'accent.amber': {
          value: { _dark: colors.accentAmber.$value, _light: lightColors.accentAmber.$value },
        },
        'accent.red': {
          value: { _dark: colors.accentRed.$value, _light: lightColors.accentRed.$value },
        },

        // ---- Contrast-safe text color for use on accent backgrounds ----
        // Dark mode accent colors are light pastels (#4d9fff, #f87171) — white
        // text fails WCAG AA (≈2.7:1). Flip to near-black so contrast exceeds 7:1.
        // Light mode accent colors are dark (#2563eb, #dc2626) — white text passes.
        'color.on.accent': {
          value: { _dark: colors.bgBase.$value, _light: lightColors.onAccent.$value },
        },

        // ---- Step background tints (ProgressSteps) ----
        // 8-digit hex: RRGGBBAA — 0x22 ≈ 13% opacity tint over the step circle background.
        'bg.step.active': {
          value: { _dark: stepTints.active.dark.$value, _light: stepTints.active.light.$value },
        },
        'bg.step.complete': {
          value: { _dark: stepTints.complete.dark.$value, _light: stepTints.complete.light.$value },
        },
        'bg.step.waiting': {
          value: { _dark: stepTints.waiting.dark.$value, _light: stepTints.waiting.light.$value },
        },

        // ---- Semantic alias tier: MCP agent lifecycle states ----
        // Use these in agent components instead of raw accent tokens.
        'color.agent.status.idle': {
          value: { _dark: colors.textMuted.$value, _light: lightColors.textMuted.$value },
        },
        'color.agent.status.running': {
          value: { _dark: colors.accentBlue.$value, _light: lightColors.accentBlue.$value },
        },
        'color.agent.status.waiting': {
          value: { _dark: colors.accentAmber.$value, _light: lightColors.accentAmber.$value },
        },
        'color.agent.status.done': {
          value: { _dark: colors.accentGreen.$value, _light: lightColors.accentGreen.$value },
        },
        'color.agent.status.error': {
          value: { _dark: colors.accentRed.$value, _light: lightColors.accentRed.$value },
        },
        'color.agent.status.cancelled': {
          value: { _dark: colors.textMuted.$value, _light: lightColors.textMuted.$value },
        },

        // ---- Semantic alias tier: tool call lifecycle states ----
        'color.tool.status.pending': {
          value: { _dark: colors.textMuted.$value, _light: lightColors.textMuted.$value },
        },
        'color.tool.status.running': {
          value: { _dark: colors.accentBlue.$value, _light: lightColors.accentBlue.$value },
        },
        'color.tool.status.done': {
          value: { _dark: colors.accentGreen.$value, _light: lightColors.accentGreen.$value },
        },
        'color.tool.status.error': {
          value: { _dark: colors.accentRed.$value, _light: lightColors.accentRed.$value },
        },

        // ---- Semantic alias tier: message role backgrounds ----
        'color.message.user.bg': {
          value: { _dark: colors.bgElevated.$value, _light: lightColors.bgElevated.$value },
        },
        'color.message.assistant.bg': {
          value: { _dark: colors.bgSurface.$value, _light: lightColors.bgSurface.$value },
        },
        'color.message.tool.bg': {
          value: { _dark: colors.bgElevated.$value, _light: lightColors.bgElevated.$value },
        },
        'color.message.tool.border': {
          value: { _dark: colors.borderSubtle.$value, _light: lightColors.borderSubtle.$value },
        },
      },
    },
  },
  // No globalCss — libraries must not set styles on body or any global selector.
})

export const system = createSystem(defaultConfig, config)
