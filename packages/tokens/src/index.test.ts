import { describe, it, expect } from 'vitest'
import {
  colors,
  lightColors,
  stepTints,
  semanticColors,
  space,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  duration,
  radius,
  shadows,
  zIndex,
  getCSSVariables,
  tokens,
} from './index.js'

// ---- Helpers ----

const HEX_RE = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/
const DTCG_ALIAS_RE = /^\{[a-zA-Z.]+\}$/

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

// ---- Token shape ----

describe('token shape', () => {
  it('every primitive color token has $value and $type', () => {
    for (const token of collectLeaves(colors)) {
      expect(token.$type).toBe('color')
      expect(typeof token.$value).toBe('string')
    }
  })

  it('every light color token has $value and $type', () => {
    for (const token of collectLeaves(lightColors)) {
      expect(token.$type).toBe('color')
      expect(typeof token.$value).toBe('string')
    }
  })

  it('every space token has dimension type and px value', () => {
    for (const token of collectLeaves(space)) {
      expect(token.$type).toBe('dimension')
      expect(token.$value as string).toMatch(/^\d+px$/)
    }
  })

  it('every duration token has duration type and ms value', () => {
    for (const token of collectLeaves(duration)) {
      expect(token.$type).toBe('duration')
      expect(token.$value as string).toMatch(/^\d+ms$/)
    }
  })

  it('every radius token has dimension type and px value', () => {
    for (const token of collectLeaves(radius)) {
      expect(token.$type).toBe('dimension')
      expect(token.$value as string).toMatch(/px$/)
    }
  })

  it('every fontWeight token has fontWeight type', () => {
    for (const token of collectLeaves(fontWeights)) {
      expect(token.$type).toBe('fontWeight')
    }
  })

  it('every shadow token has shadow type', () => {
    for (const token of collectLeaves(shadows)) {
      expect(token.$type).toBe('shadow')
    }
  })

  it('every zIndex token has number type and numeric value', () => {
    for (const token of collectLeaves(zIndex)) {
      expect(token.$type).toBe('number')
      expect(typeof token.$value).toBe('number')
    }
  })
})

// ---- Color value format ----

describe('color value format', () => {
  it('all primitive color $values are valid 6- or 8-digit hex', () => {
    for (const token of collectLeaves(colors)) {
      expect(token.$value as string, `colors.${token.$value}`).toMatch(HEX_RE)
    }
  })

  it('all light color $values are valid 6- or 8-digit hex', () => {
    for (const token of collectLeaves(lightColors)) {
      expect(token.$value as string, `lightColors.${token.$value}`).toMatch(HEX_RE)
    }
  })

  it('all stepTint $values are valid 8-digit hex (with alpha)', () => {
    for (const token of collectLeaves(stepTints)) {
      expect(token.$value as string).toMatch(/^#[0-9a-fA-F]{8}$/)
    }
  })
})

// ---- Semantic alias format ----

describe('semantic alias format', () => {
  it('all semantic color $values use DTCG {group.key} alias notation', () => {
    for (const token of collectLeaves(semanticColors)) {
      expect(token.$value as string, `semantic token: ${JSON.stringify(token)}`).toMatch(
        DTCG_ALIAS_RE
      )
    }
  })

  it('all semantic alias references point to existing primitive keys', () => {
    const primitiveKeys = new Set(Object.keys(colors))
    for (const token of collectLeaves(semanticColors)) {
      const ref = (token.$value as string).replace(/^\{colors\./, '').replace(/\}$/, '')
      expect(primitiveKeys, `${token.$value} references unknown primitive`).toContain(ref)
    }
  })
})

// ---- MCP lifecycle completeness ----

describe('MCP lifecycle states', () => {
  const agentStates = semanticColors.agent.status

  it('has all 6 required agent status states', () => {
    expect(agentStates).toHaveProperty('idle')
    expect(agentStates).toHaveProperty('running')
    expect(agentStates).toHaveProperty('waiting')
    expect(agentStates).toHaveProperty('done')
    expect(agentStates).toHaveProperty('error')
    expect(agentStates).toHaveProperty('cancelled')
  })

  it('has all 4 required tool status states', () => {
    const toolStates = semanticColors.tool.status
    expect(toolStates).toHaveProperty('pending')
    expect(toolStates).toHaveProperty('running')
    expect(toolStates).toHaveProperty('done')
    expect(toolStates).toHaveProperty('error')
  })
})

// ---- Dark / light parity ----

describe('dark/light primitive parity', () => {
  it('lightColors has the same base keys as colors', () => {
    const darkKeys = Object.keys(colors).sort()
    // lightColors has one extra: onAccent — that is intentional
    for (const key of darkKeys) {
      expect(lightColors).toHaveProperty(key)
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
    expect(Object.isFrozen(colors)).toBe(true)
    expect(Object.isFrozen(lightColors)).toBe(true)
    expect(Object.isFrozen(stepTints)).toBe(true)
    expect(Object.isFrozen(semanticColors)).toBe(true)
    expect(Object.isFrozen(space)).toBe(true)
    expect(Object.isFrozen(fonts)).toBe(true)
    expect(Object.isFrozen(fontSizes)).toBe(true)
    expect(Object.isFrozen(fontWeights)).toBe(true)
    expect(Object.isFrozen(lineHeights)).toBe(true)
    expect(Object.isFrozen(radius)).toBe(true)
    expect(Object.isFrozen(shadows)).toBe(true)
    expect(Object.isFrozen(zIndex)).toBe(true)
    expect(Object.isFrozen(tokens)).toBe(true)
  })
})

// ---- getCSSVariables ----

describe('getCSSVariables', () => {
  let css: string

  it('returns a non-empty string', () => {
    css = getCSSVariables()
    expect(typeof css).toBe('string')
    expect(css.length).toBeGreaterThan(0)
  })

  it('is scoped to [data-agentic-ds] — never :root', () => {
    css = getCSSVariables()
    expect(css).toContain('[data-agentic-ds]')
    expect(css).not.toContain(':root')
  })

  it('includes all six MCP agent status variables', () => {
    css = getCSSVariables()
    expect(css).toContain('--ds-color-agent-status-idle')
    expect(css).toContain('--ds-color-agent-status-running')
    expect(css).toContain('--ds-color-agent-status-waiting')
    expect(css).toContain('--ds-color-agent-status-done')
    expect(css).toContain('--ds-color-agent-status-error')
    expect(css).toContain('--ds-color-agent-status-cancelled')
  })

  it('includes all four tool status variables', () => {
    css = getCSSVariables()
    expect(css).toContain('--ds-color-tool-status-pending')
    expect(css).toContain('--ds-color-tool-status-running')
    expect(css).toContain('--ds-color-tool-status-done')
    expect(css).toContain('--ds-color-tool-status-error')
  })

  it('includes all space variables', () => {
    css = getCSSVariables()
    for (const key of Object.keys(space)) {
      expect(css).toContain(`--ds-space-${key}`)
    }
  })

  it('includes all radius variables', () => {
    css = getCSSVariables()
    for (const key of Object.keys(radius)) {
      expect(css).toContain(`--ds-radius-${key}`)
    }
  })

  it('includes all z-index variables', () => {
    css = getCSSVariables()
    for (const key of Object.keys(zIndex)) {
      expect(css).toContain(`--ds-z-index-${key}`)
    }
  })

  it('includes a light-mode override block with prefers-color-scheme: light', () => {
    css = getCSSVariables()
    expect(css).toContain('@media (prefers-color-scheme: light)')
  })

  it('resolves primitive values — no DTCG alias notation in output', () => {
    css = getCSSVariables()
    expect(css).not.toMatch(/\{colors\.\w+\}/)
  })

  it('every CSS variable value is a non-empty string', () => {
    css = getCSSVariables()
    const varDecls = [...css.matchAll(/--ds-[\w-]+:\s*([^;]+);/g)]
    expect(varDecls.length).toBeGreaterThan(0)
    for (const [, value] of varDecls) {
      expect(value.trim().length).toBeGreaterThan(0)
    }
  })
})
