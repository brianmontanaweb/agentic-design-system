import { describe, it, expect } from 'vitest'
import {
  colorModes,
  spacing,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  durations,
  radii,
  shadows,
  zIndex,
  getCSSVariables,
  tokens,
} from './index.js'

// ---- Helpers ----

const HEX_RE = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/

function isLeafToken(v: unknown): v is { $value: unknown; $type: string } {
  return typeof v === 'object' && v !== null && '$value' in v && '$type' in v
}

function collectLeaves(obj: object): { $value: unknown; $type: string }[] {
  const leaves: { $value: unknown; $type: string }[] = []
  for (const val of Object.values(obj)) {
    if (isLeafToken(val)) {
      leaves.push(val)
    } else if (typeof val === 'object' && val !== null) {
      leaves.push(...collectLeaves(val as object))
    }
  }
  return leaves
}

// ---- Color modes ----

describe('colorModes', () => {
  it('every entry has resolved dark and light values and color type', () => {
    for (const [path, token] of Object.entries(colorModes)) {
      expect(token.$type, path).toBe('color')
      expect(token.dark, path).toMatch(HEX_RE)
      expect(token.light, path).toMatch(HEX_RE)
    }
  })

  it('every key is a dot path under the color group', () => {
    for (const path of Object.keys(colorModes)) {
      expect(path).toMatch(/^color\.[a-zA-Z.]+$/)
    }
  })

  it('step tint values carry an alpha channel (8-digit hex)', () => {
    expect(colorModes['color.surface.step.active'].dark).toMatch(/^#[0-9a-fA-F]{8}$/)
    expect(colorModes['color.surface.step.active'].light).toMatch(/^#[0-9a-fA-F]{8}$/)
  })

  it('resolves aliases — semantic entries equal their primitives per mode', () => {
    expect(colorModes['color.agent.status.running']).toMatchObject({
      dark: colorModes['color.accent.interactive'].dark,
      light: colorModes['color.accent.interactive'].light,
    })
    expect(colorModes['color.message.tool.border']).toMatchObject({
      dark: colorModes['color.border.subtle'].dark,
      light: colorModes['color.border.subtle'].light,
    })
  })

  it('dark and light differ where the palette is mode-specific', () => {
    expect(colorModes['color.surface.base'].dark).not.toBe(colorModes['color.surface.base'].light)
    expect(colorModes['color.accent.interactive'].dark).not.toBe(
      colorModes['color.accent.interactive'].light
    )
  })
})

// ---- Non-color token shape ----

describe('token shape', () => {
  it('every spacing token has dimension type and px value', () => {
    for (const token of collectLeaves(spacing)) {
      expect(token.$type).toBe('dimension')
      expect(token.$value as string).toMatch(/^\d+px$/)
    }
  })

  it('every durations token has duration type and ms value', () => {
    for (const token of collectLeaves(durations)) {
      expect(token.$type).toBe('duration')
      expect(token.$value as string).toMatch(/^\d+(\.\d+)?ms$/)
    }
  })

  it('every radii token has dimension type and px value', () => {
    for (const token of collectLeaves(radii)) {
      expect(token.$type).toBe('dimension')
      expect(token.$value as string).toMatch(/px$/)
    }
  })

  it('every fontWeight token has fontWeight type and numeric value', () => {
    for (const token of collectLeaves(fontWeights)) {
      expect(token.$type).toBe('fontWeight')
      expect(typeof token.$value).toBe('number')
    }
  })

  it('every lineHeight token is a unitless number', () => {
    for (const token of collectLeaves(lineHeights)) {
      expect(token.$type).toBe('number')
      expect(typeof token.$value).toBe('number')
    }
  })

  it('every shadow token serializes to a CSS box-shadow string', () => {
    for (const token of collectLeaves(shadows)) {
      expect(token.$type).toBe('shadow')
      expect(token.$value as string).toMatch(/^(\d+(\.\d+)?(px)? ){3}rgba?\(/)
    }
  })

  it('every font token serializes to a CSS font-family list', () => {
    for (const token of collectLeaves(fonts)) {
      expect(token.$type).toBe('fontFamily')
      expect(token.$value as string).toContain(',')
    }
  })

  it('every zIndex token has number type and numeric value', () => {
    for (const token of collectLeaves(zIndex)) {
      expect(token.$type).toBe('number')
      expect(typeof token.$value).toBe('number')
    }
  })
})

// ---- MCP lifecycle completeness ----

describe('MCP lifecycle states', () => {
  it('has all 6 required agent status states', () => {
    for (const state of ['idle', 'running', 'waiting', 'done', 'error', 'cancelled']) {
      expect(colorModes).toHaveProperty(`color.agent.status.${state}`)
    }
  })

  it('has all 4 required tool status states', () => {
    for (const state of ['pending', 'running', 'done', 'error']) {
      expect(colorModes).toHaveProperty(`color.tool.status.${state}`)
    }
  })
})

// ---- z-index ordering ----

describe('z-index ordering', () => {
  it('layers are strictly increasing: dropdown < sticky < overlay < modal < tooltip', () => {
    expect(zIndex.dropdown.$value).toBeLessThan(zIndex.sticky.$value)
    expect(zIndex.sticky.$value).toBeLessThan(zIndex.overlay.$value)
    expect(zIndex.overlay.$value).toBeLessThan(zIndex.modal.$value)
    expect(zIndex.modal.$value).toBeLessThan(zIndex.tooltip.$value)
  })
})

// ---- Immutability ----

describe('immutability', () => {
  it('all top-level token exports are frozen', () => {
    expect(Object.isFrozen(colorModes)).toBe(true)
    expect(Object.isFrozen(spacing)).toBe(true)
    expect(Object.isFrozen(fonts)).toBe(true)
    expect(Object.isFrozen(fontSizes)).toBe(true)
    expect(Object.isFrozen(fontWeights)).toBe(true)
    expect(Object.isFrozen(lineHeights)).toBe(true)
    expect(Object.isFrozen(durations)).toBe(true)
    expect(Object.isFrozen(radii)).toBe(true)
    expect(Object.isFrozen(shadows)).toBe(true)
    expect(Object.isFrozen(zIndex)).toBe(true)
    expect(Object.isFrozen(tokens)).toBe(true)
  })
})

// ---- getCSSVariables ----

describe('getCSSVariables', () => {
  const css = getCSSVariables()

  it('returns a non-empty string', () => {
    expect(typeof css).toBe('string')
    expect(css.length).toBeGreaterThan(0)
  })

  it('is scoped to [data-agentic-ds] — never :root', () => {
    expect(css).toContain('[data-agentic-ds]')
    expect(css).not.toContain(':root')
  })

  it('emits one variable per colorModes entry in the default block', () => {
    for (const path of Object.keys(colorModes)) {
      expect(css).toContain(`--ds-${path.replaceAll('.', '-')}:`)
    }
  })

  it('includes all six MCP agent status variables', () => {
    for (const state of ['idle', 'running', 'waiting', 'done', 'error', 'cancelled']) {
      expect(css).toContain(`--ds-color-agent-status-${state}`)
    }
  })

  it('includes all space variables', () => {
    for (const key of Object.keys(spacing)) {
      expect(css).toContain(`--ds-space-${key}`)
    }
  })

  it('includes all radius variables', () => {
    for (const key of Object.keys(radii)) {
      expect(css).toContain(`--ds-radius-${key}`)
    }
  })

  it('includes all z-index variables', () => {
    for (const key of Object.keys(zIndex)) {
      expect(css).toContain(`--ds-z-index-${key}`)
    }
  })

  it('follows the OS preference via prefers-color-scheme unless a mode is pinned', () => {
    expect(css).toContain('@media (prefers-color-scheme: light)')
    expect(css).toContain('[data-agentic-ds]:not([data-color-mode="dark"])')
  })

  it('supports pinning either mode via data-color-mode', () => {
    expect(css).toContain('[data-agentic-ds][data-color-mode="light"]')
    expect(css).toContain('[data-agentic-ds][data-color-mode="dark"]')
  })

  it('pins dark values in the dark block and light values in the light blocks', () => {
    const darkBlock = css.slice(0, css.indexOf('@media'))
    expect(darkBlock).toContain(
      `--ds-color-surface-base: ${colorModes['color.surface.base'].dark};`
    )
    const lightBlock = css.slice(css.indexOf('@media'))
    expect(lightBlock).toContain(
      `--ds-color-surface-base: ${colorModes['color.surface.base'].light};`
    )
  })

  it('resolves primitive values — no DTCG alias notation in output', () => {
    expect(css).not.toMatch(/\{color\.[\w.]+\}/)
  })

  it('every CSS variable value is a non-empty string', () => {
    const varDecls = [...css.matchAll(/--ds-[\w-]+:\s*([^;]+);/g)]
    expect(varDecls.length).toBeGreaterThan(0)
    for (const [, value] of varDecls) {
      expect(value.trim().length).toBeGreaterThan(0)
    }
  })
})
