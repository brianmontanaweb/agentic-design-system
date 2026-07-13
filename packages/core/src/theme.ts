import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  type SystemContext,
} from '@chakra-ui/react'
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
import { isHexColor, pickHigherContrast, rgbToHex, tintNeutral } from './color-utils'

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
        color: 'color.text.on.danger',
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

// ---- Theming API (defineAgenticTheme) ----

/** A semantic color token path, e.g. 'color.accent.interactive'. */
export type AgenticColorToken = keyof typeof colorModes

/** A color value applied to one or both color modes. */
export type ModeColor = string | { dark?: string; light?: string }

export interface AgenticThemeOptions {
  /**
   * Scope name for this theme. Required only when providers with *different*
   * themes coexist on one page: it scopes the theme's CSS custom properties
   * to [data-agentic-ds][data-agentic-theme="<name>"], which AgenticProvider
   * stamps automatically. Lowercase letters, digits, and hyphens.
   */
  name?: string
  /**
   * Brand accent as a hex color, applied to color.accent.interactive.
   * A single string applies to both modes. color.text.on.accent is
   * re-derived per mode for WCAG contrast unless explicitly overridden
   * via `colors`.
   */
  accent?: ModeColor
  /**
   * Neutral warmth from -1 (cool blue cast) to 1 (warm amber cast); 0 keeps
   * the stock neutrals. Parametrically tints the surface, border, and text
   * neutral tokens in OKLCH space, preserving lightness (and therefore
   * contrast ratios).
   */
  neutralWarmth?: number
  /** Per-token semantic color overrides. Applied last, over accent/warmth. */
  colors?: Partial<Record<AgenticColorToken, ModeColor>>
}

/** Opaque theme handle for AgenticProvider. Create with defineAgenticTheme(). */
export interface AgenticTheme {
  readonly name?: string
  /** @internal Chakra system consumed by AgenticProvider — do not use directly. */
  readonly system: SystemContext
}

interface ModePair {
  dark: string
  light: string
}

// Neutrals eligible for warmth tinting. Deliberately excludes
// color.text.on.accent (contrast-critical) and the semantic status/accent
// colors (hue carries meaning there).
const NEUTRAL_TOKENS: readonly AgenticColorToken[] = [
  'color.surface.base',
  'color.surface.default',
  'color.surface.elevated',
  'color.border.subtle',
  'color.text.primary',
  'color.text.muted',
]

const WHITE = rgbToHex({ r: 1, g: 1, b: 1 })
// Darkest stock neutral — the dark-mode page background.
const DARKEST_NEUTRAL = colorModes['color.surface.base'].dark

const THEME_NAME_PATTERN = /^[a-z][a-z0-9-]*$/

function assertHex(value: string, context: string): void {
  if (!isHexColor(value)) {
    throw new Error(
      `defineAgenticTheme: invalid color "${value}" for ${context}. Expected #rgb or #rrggbb.`
    )
  }
}

function toModePair(value: ModeColor, fallback: ModePair, context: string): ModePair {
  if (typeof value === 'string') {
    assertHex(value, context)
    return { dark: value, light: value }
  }
  if (value.dark !== undefined) assertHex(value.dark, `${context} (dark)`)
  if (value.light !== undefined) assertHex(value.light, `${context} (light)`)
  return { dark: value.dark ?? fallback.dark, light: value.light ?? fallback.light }
}

/**
 * Resolve the full semantic color map (token path → per-mode values) for a
 * set of theme options. Exported for tests; not part of the public API.
 * Precedence: stock tokens → neutralWarmth tint → accent derivation →
 * explicit `colors` overrides.
 */
export function resolveThemeColors(
  options: AgenticThemeOptions = {}
): Record<AgenticColorToken, ModePair> {
  const { accent, neutralWarmth = 0, colors = {} } = options

  if (!Number.isFinite(neutralWarmth) || neutralWarmth < -1 || neutralWarmth > 1) {
    throw new Error(
      `defineAgenticTheme: neutralWarmth must be between -1 and 1, got ${String(neutralWarmth)}.`
    )
  }

  const resolved = Object.fromEntries(
    Object.entries(colorModes).map(([path, token]) => [
      path,
      { dark: token.dark, light: token.light },
    ])
  ) as Record<AgenticColorToken, ModePair>

  if (neutralWarmth !== 0) {
    for (const path of NEUTRAL_TOKENS) {
      resolved[path] = {
        dark: tintNeutral(resolved[path].dark, neutralWarmth),
        light: tintNeutral(resolved[path].light, neutralWarmth),
      }
    }
  }

  if (accent !== undefined) {
    const pair = toModePair(accent, resolved['color.accent.interactive'], 'accent')
    resolved['color.accent.interactive'] = pair
    resolved['color.text.on.accent'] = {
      dark: pickHigherContrast(pair.dark, WHITE, DARKEST_NEUTRAL),
      light: pickHigherContrast(pair.light, WHITE, DARKEST_NEUTRAL),
    }
  }

  for (const [path, value] of Object.entries(colors)) {
    if (!(path in colorModes)) {
      throw new Error(`defineAgenticTheme: unknown color token "${path}".`)
    }
    const tokenPath = path as AgenticColorToken
    resolved[tokenPath] = toModePair(value, resolved[tokenPath], `colors["${path}"]`)
  }

  return resolved
}

function buildSystem(
  semanticColorValues: Record<AgenticColorToken, ModePair>,
  cssVarsRoot: string
): SystemContext {
  // Every colorModes entry becomes a Chakra semantic token under its own dot
  // path (e.g. 'color.surface.base', 'color.agent.status.running'), so the
  // light/dark mapping is derived from the token source, never hand-maintained.
  // Per-token rationale (e.g. the color.text.on.accent contrast flip) lives in
  // the $description fields in packages/tokens/tokens/*.json.
  const semanticColors: Record<string, { value: { _dark: string; _light: string } }> =
    Object.fromEntries(
      Object.entries(semanticColorValues).map(([path, pair]) => [
        path,
        { value: { _dark: pair.dark, _light: pair.light } },
      ])
    )

  const config = defineConfig({
    // Scope all CSS custom properties to the provider root element rather than
    // :root. This prevents the design system from leaking token values into the
    // host application's global scope when the library is imported. Named
    // themes narrow the scope further so differently-themed providers can
    // coexist on one page (the named selector wins on specificity).
    cssVarsRoot,
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

  return createSystem(defaultConfig, config)
}

/**
 * Create a branded theme for AgenticProvider. Call once at module scope and
 * pass the result to the provider's `theme` prop:
 *
 * ```tsx
 * const theme = defineAgenticTheme({ accent: '#e8590c', neutralWarmth: 0.5 })
 * <AgenticProvider theme={theme}>…</AgenticProvider>
 * ```
 */
export function defineAgenticTheme(options: AgenticThemeOptions = {}): AgenticTheme {
  const { name } = options
  if (name !== undefined && !THEME_NAME_PATTERN.test(name)) {
    throw new Error(
      `defineAgenticTheme: invalid theme name "${name}". Use lowercase letters, digits, and hyphens, starting with a letter.`
    )
  }
  const cssVarsRoot =
    name === undefined ? '[data-agentic-ds]' : `[data-agentic-ds][data-agentic-theme="${name}"]`
  return { name, system: buildSystem(resolveThemeColors(options), cssVarsRoot) }
}

// Stock theme used when AgenticProvider receives no `theme` prop. Internal —
// intentionally not re-exported from the package entry point (the
// no-restricted-imports ban on `system` still guards the old escape hatch).
export const defaultTheme: AgenticTheme = defineAgenticTheme()
