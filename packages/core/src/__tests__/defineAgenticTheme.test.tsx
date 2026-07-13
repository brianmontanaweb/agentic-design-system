import React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { colorModes } from '@agentic-ds/tokens'
import { defineAgenticTheme, resolveThemeColors, defaultTheme } from '../theme'
import { contrastRatio, hexToRgb, rgbToHex, rgbToOklch } from '../color-utils'
import { AgenticProvider } from '../AgenticProvider'

// Hex inputs are sourced from token values (never literals) so this file
// stays inside the no-hardcoded-color lint rule like every other test.
const WHITE = rgbToHex({ r: 1, g: 1, b: 1 })
const NEAR_BLACK = colorModes['color.surface.base'].dark
const STOCK_ACCENT = colorModes['color.accent.interactive']
const RED = colorModes['color.accent.danger'].dark

describe('resolveThemeColors', () => {
  describe('defaults', () => {
    it('returns the stock token values when called with no options', () => {
      const resolved = resolveThemeColors()
      for (const [path, token] of Object.entries(colorModes)) {
        expect(resolved[path as keyof typeof colorModes]).toEqual({
          dark: token.dark,
          light: token.light,
        })
      }
    })
  })

  describe('accent', () => {
    it('applies a single hex accent to both modes', () => {
      const resolved = resolveThemeColors({ accent: RED })
      expect(resolved['color.accent.interactive']).toEqual({ dark: RED, light: RED })
    })

    it('supports per-mode accents with fallback to the stock value', () => {
      const resolved = resolveThemeColors({ accent: { dark: RED } })
      expect(resolved['color.accent.interactive'].dark).toBe(RED)
      expect(resolved['color.accent.interactive'].light).toBe(STOCK_ACCENT.light)
    })

    it('derives white on-accent text for a dark accent', () => {
      const resolved = resolveThemeColors({ accent: NEAR_BLACK })
      expect(resolved['color.text.on.accent']).toEqual({ dark: WHITE, light: WHITE })
    })

    it('derives dark on-accent text for a white accent', () => {
      const resolved = resolveThemeColors({ accent: WHITE })
      expect(resolved['color.text.on.accent']).toEqual({ dark: NEAR_BLACK, light: NEAR_BLACK })
    })

    it('always yields at least AA-large contrast between accent and on-accent', () => {
      for (const accent of [RED, NEAR_BLACK, WHITE, STOCK_ACCENT.light]) {
        const resolved = resolveThemeColors({ accent })
        const ratio = contrastRatio(
          hexToRgb(resolved['color.accent.interactive'].dark),
          hexToRgb(resolved['color.text.on.accent'].dark)
        )
        expect(ratio).toBeGreaterThanOrEqual(3)
      }
    })

    it('does not clobber an explicit on-accent override', () => {
      const resolved = resolveThemeColors({
        accent: NEAR_BLACK,
        colors: { 'color.text.on.accent': RED },
      })
      expect(resolved['color.text.on.accent']).toEqual({ dark: RED, light: RED })
    })
  })

  describe('neutralWarmth', () => {
    it('leaves all tokens unchanged at 0', () => {
      expect(resolveThemeColors({ neutralWarmth: 0 })).toEqual(resolveThemeColors())
    })

    it('changes the neutral surfaces but not the semantic accents', () => {
      const warm = resolveThemeColors({ neutralWarmth: 0.8 })
      const stock = resolveThemeColors()
      expect(warm['color.surface.elevated']).not.toEqual(stock['color.surface.elevated'])
      expect(warm['color.border.subtle']).not.toEqual(stock['color.border.subtle'])
      expect(warm['color.accent.interactive']).toEqual(stock['color.accent.interactive'])
      expect(warm['color.agent.status.running']).toEqual(stock['color.agent.status.running'])
    })

    it('warm and cool casts differ from each other', () => {
      const warm = resolveThemeColors({ neutralWarmth: 0.8 })
      const cool = resolveThemeColors({ neutralWarmth: -0.8 })
      expect(warm['color.surface.elevated']).not.toEqual(cool['color.surface.elevated'])
    })

    it('preserves perceptual lightness of tinted neutrals', () => {
      const warm = resolveThemeColors({ neutralWarmth: 1 })
      const stock = resolveThemeColors()
      for (const path of ['color.surface.base', 'color.text.primary'] as const) {
        const before = rgbToOklch(hexToRgb(stock[path].dark)).l
        const after = rgbToOklch(hexToRgb(warm[path].dark)).l
        expect(Math.abs(after - before)).toBeLessThan(0.02)
      }
    })

    it('rejects values outside [-1, 1]', () => {
      expect(() => resolveThemeColors({ neutralWarmth: 2 })).toThrow(/neutralWarmth/)
      expect(() => resolveThemeColors({ neutralWarmth: Number.NaN })).toThrow(/neutralWarmth/)
    })
  })

  describe('colors overrides', () => {
    it('applies a per-token override to both modes', () => {
      const resolved = resolveThemeColors({ colors: { 'color.stream.cursor': RED } })
      expect(resolved['color.stream.cursor']).toEqual({ dark: RED, light: RED })
    })

    it('applies a single-mode override and keeps the other mode stock', () => {
      const resolved = resolveThemeColors({ colors: { 'color.border.subtle': { light: RED } } })
      expect(resolved['color.border.subtle'].light).toBe(RED)
      expect(resolved['color.border.subtle'].dark).toBe(colorModes['color.border.subtle'].dark)
    })

    it('rejects unknown token paths', () => {
      const colors = { 'color.not.a.token': RED } as unknown as NonNullable<
        Parameters<typeof resolveThemeColors>[0]
      >['colors']
      expect(() => resolveThemeColors({ colors })).toThrow(/unknown color token/)
    })

    it('rejects malformed hex values', () => {
      expect(() => resolveThemeColors({ accent: 'tomato' })).toThrow(/invalid color/i)
      expect(() =>
        resolveThemeColors({ colors: { 'color.stream.cursor': RED.slice(0, 3) } })
      ).toThrow(/invalid color/i)
    })
  })
})

describe('defineAgenticTheme', () => {
  it('returns a theme with a Chakra system', () => {
    const theme = defineAgenticTheme({ accent: RED })
    expect(theme.system).toBeDefined()
    expect(theme.name).toBeUndefined()
  })

  it('produces a distinct system from the default theme', () => {
    const theme = defineAgenticTheme({ accent: RED })
    expect(theme.system).not.toBe(defaultTheme.system)
  })

  it('carries a valid name through to the theme', () => {
    expect(defineAgenticTheme({ name: 'brand-x' }).name).toBe('brand-x')
  })

  it('rejects names that are not lowercase kebab-case', () => {
    expect(() => defineAgenticTheme({ name: 'Brand X' })).toThrow(/invalid theme name/)
    expect(() => defineAgenticTheme({ name: '1st' })).toThrow(/invalid theme name/)
  })
})

describe('AgenticProvider theme prop', () => {
  it('renders children under a custom theme', () => {
    const theme = defineAgenticTheme({ accent: RED })
    const { getByText } = render(
      <AgenticProvider theme={theme}>
        <span>branded</span>
      </AgenticProvider>
    )
    expect(getByText('branded')).toBeInTheDocument()
  })

  it('omits data-agentic-theme for the default and unnamed themes', () => {
    const unnamed = defineAgenticTheme({ accent: RED })
    for (const theme of [undefined, unnamed]) {
      const { container, unmount } = render(
        <AgenticProvider theme={theme}>
          <span>child</span>
        </AgenticProvider>
      )
      const wrapper = container.querySelector('[data-agentic-ds]')
      expect(wrapper).not.toHaveAttribute('data-agentic-theme')
      unmount()
    }
  })

  it('stamps data-agentic-theme for a named theme', () => {
    const theme = defineAgenticTheme({ name: 'brand-x', accent: RED })
    const { container } = render(
      <AgenticProvider theme={theme}>
        <span>child</span>
      </AgenticProvider>
    )
    expect(container.querySelector('[data-agentic-ds]')).toHaveAttribute(
      'data-agentic-theme',
      'brand-x'
    )
  })
})
