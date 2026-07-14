import { describe, expect, it } from 'vitest'
import { colorModes } from '@agentic-ds/tokens'
import { themeToCss } from '../theme-css'
import { rgbToHex } from '../color-utils'

// Hex inputs sourced from token values (never literals) to stay inside the
// no-hardcoded-color lint rule like every other test in this package.
const RED = colorModes['color.accent.danger'].dark
const WHITE = rgbToHex({ r: 1, g: 1, b: 1 })

describe('themeToCss', () => {
  it('scopes to [data-agentic-ds] for an unnamed theme', () => {
    const css = themeToCss({ accent: RED })
    expect(css).toContain('[data-agentic-ds] {')
    expect(css).not.toContain('data-agentic-theme')
  })

  it('scopes to the two-attribute selector for a named theme', () => {
    const css = themeToCss({ name: 'acme', accent: RED })
    expect(css).toContain('[data-agentic-ds][data-agentic-theme="acme"] {')
    expect(css).toContain('[data-agentic-ds][data-agentic-theme="acme"][data-color-mode="light"]')
    expect(css).toContain('[data-agentic-ds][data-agentic-theme="acme"][data-color-mode="dark"]')
  })

  it('includes both color modes', () => {
    const css = themeToCss({ name: 'acme', accent: RED })
    expect(css).toContain('@media (prefers-color-scheme: light)')
    expect(css).toContain('[data-agentic-ds][data-agentic-theme="acme"][data-color-mode="light"]')
  })

  it('carries the branded accent value into the custom property', () => {
    const css = themeToCss({ accent: RED })
    expect(css).toContain(`--ds-color-accent-interactive: ${RED};`)
  })

  it('re-derives on-accent contrast alongside the accent override', () => {
    const css = themeToCss({ accent: RED })
    expect(css).toContain('--ds-color-text-on-accent:')
  })

  it('matches the stock stylesheet colors when called with no options', () => {
    const css = themeToCss()
    expect(css).toContain(
      `--ds-color-accent-interactive: ${colorModes['color.accent.interactive'].dark};`
    )
  })

  it('omits non-color tokens — those stay in the base static stylesheet', () => {
    const css = themeToCss({ accent: RED })
    expect(css).not.toContain('--ds-duration-')
    expect(css).not.toContain('--ds-space-')
    expect(css).not.toContain('@keyframes')
  })

  it('rejects invalid theme names, matching defineAgenticTheme', () => {
    expect(() => themeToCss({ name: 'Not Valid' })).toThrow(/invalid theme name/)
  })

  it('rejects malformed colors, matching resolveThemeColors', () => {
    expect(() => themeToCss({ accent: 'tomato' })).toThrow(/invalid color/i)
  })

  it('applies neutralWarmth tinting like the runtime theme', () => {
    const warm = themeToCss({ neutralWarmth: 0.8 })
    const stock = themeToCss()
    expect(warm).not.toBe(stock)
  })

  it('applies a per-token color override', () => {
    const css = themeToCss({ colors: { 'color.stream.cursor': WHITE } })
    expect(css).toContain(`--ds-color-stream-cursor: ${WHITE};`)
  })
})
