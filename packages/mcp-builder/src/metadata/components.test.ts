import { describe, expect, it } from 'vitest'
import { components } from './components.js'

const VALID_PACKAGES = ['@agentic-ds/core', '@agentic-ds/agents']

const EXPECTED_NAMES = [
  'Button', 'CodeBlock', 'AgentStatus', 'ThinkingIndicator',
  'ProgressSteps', 'ToolCallCard', 'StreamingText', 'MessageThread', 'MessageBubble',
]

// These agent components are accessibility-critical and must have ariaNotes
const ARIA_REQUIRED = [
  'AgentStatus', 'ThinkingIndicator', 'ProgressSteps', 'ToolCallCard', 'StreamingText', 'MessageThread',
]

describe('components metadata', () => {
  it('has the expected number of components', () => {
    expect(components).toHaveLength(9)
  })

  it('contains all expected component names', () => {
    const names = new Set(components.map((c) => c.name))
    for (const name of EXPECTED_NAMES) {
      expect(names.has(name), `missing component: ${name}`).toBe(true)
    }
  })

  it('has no duplicate component names', () => {
    const names = components.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  describe('each component', () => {
    it.each(components)('$name has all required fields', (component) => {
      expect(component.name).toBeTruthy()
      expect(component.description).toBeTruthy()
      expect(component.props).toBeDefined()
    })

    it.each(components)('$name has a valid package', (component) => {
      expect(VALID_PACKAGES).toContain(component.package)
    })

    it.each(components)('$name: every prop has name, type, and required', (component) => {
      for (const [propName, def] of Object.entries(component.props)) {
        expect(propName, 'prop name must be non-empty').toBeTruthy()
        expect(def.type, `${component.name}.${propName} missing type`).toBeTruthy()
        expect(
          typeof def.required,
          `${component.name}.${propName} required must be boolean`,
        ).toBe('boolean')
      }
    })

    it.each(components)('$name: type enum values are non-empty arrays', (component) => {
      if (!component.types) return
      for (const [typeName, def] of Object.entries(component.types)) {
        expect(
          def.values.length,
          `${component.name}.${typeName} must have at least one value`,
        ).toBeGreaterThan(0)
      }
    })
  })

  describe('accessibility requirements', () => {
    it.each(ARIA_REQUIRED)('%s has ariaNotes', (name) => {
      const component = components.find((c) => c.name === name)
      expect(component, `${name} not found in components`).toBeDefined()
      expect(component?.ariaNotes, `${name} is missing ariaNotes`).toBeTruthy()
    })
  })
})
