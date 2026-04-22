import { describe, expect, it } from 'vitest'
import { handleGetComponent } from './get-component.js'

const ALL_COMPONENT_NAMES = [
  'Button',
  'CodeBlock',
  'AgentStatus',
  'ThinkingIndicator',
  'ProgressSteps',
  'ToolCallCard',
  'StreamingText',
  'MessageThread',
  'MessageBubble',
]

describe('handleGetComponent', () => {
  describe('exact match', () => {
    it('returns a heading with the component name', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('## Button')
    })

    it('matches case-insensitively', () => {
      const exact = handleGetComponent({ name: 'Button' })
      const lower = handleGetComponent({ name: 'button' })
      const mixed = handleGetComponent({ name: 'BUTTON' })
      expect(lower.content[0].text).toBe(exact.content[0].text)
      expect(mixed.content[0].text).toBe(exact.content[0].text)
    })

    it('includes the package location', () => {
      const core = handleGetComponent({ name: 'Button' })
      expect(core.content[0].text).toContain('@agentic-ds/core')

      const agents = handleGetComponent({ name: 'AgentStatus' })
      expect(agents.content[0].text).toContain('@agentic-ds/agents')
    })

    it('includes ### Props section', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('### Props')
    })

    it('shows required props as (required)', () => {
      const result = handleGetComponent({ name: 'AgentStatus' })
      expect(result.content[0].text).toContain('(required)')
    })

    it('shows optional props with their default values', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain("default: 'solid'")
    })

    it('includes ### Types section when the component has type enums', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('### Types')
    })

    it('omits ### Types section when the component has no type enums', () => {
      const result = handleGetComponent({ name: 'CodeBlock' })
      expect(result.content[0].text).not.toContain('### Types')
    })

    it('includes ### Accessibility section for components with ariaNotes', () => {
      const result = handleGetComponent({ name: 'AgentStatus' })
      expect(result.content[0].text).toContain('### Accessibility')
    })

    it('omits ### Accessibility section for components without ariaNotes', () => {
      const result = handleGetComponent({ name: 'MessageBubble' })
      expect(result.content[0].text).not.toContain('### Accessibility')
    })
  })

  describe('wildcard "*"', () => {
    it('includes the total component count', () => {
      const result = handleGetComponent({ name: '*' })
      expect(result.content[0].text).toContain('9 total')
    })

    it('lists every component name', () => {
      const result = handleGetComponent({ name: '*' })
      const text = result.content[0].text
      for (const name of ALL_COMPONENT_NAMES) {
        expect(text, `"${name}" missing from wildcard listing`).toContain(name)
      }
    })

    it('includes both package names', () => {
      const result = handleGetComponent({ name: '*' })
      const text = result.content[0].text
      expect(text).toContain('@agentic-ds/core')
      expect(text).toContain('@agentic-ds/agents')
    })
  })

  describe('not found', () => {
    it('returns an error message naming the unknown component', () => {
      const result = handleGetComponent({ name: 'Nonexistent' })
      expect(result.content[0].text).toContain('Component "Nonexistent" not found.')
    })

    it('lists all available component names in the error', () => {
      const result = handleGetComponent({ name: 'Nonexistent' })
      const text = result.content[0].text
      for (const name of ALL_COMPONENT_NAMES) {
        expect(text, `"${name}" missing from not-found error`).toContain(name)
      }
    })

    it('suggests using "*" to list all components', () => {
      const result = handleGetComponent({ name: 'Nonexistent' })
      expect(result.content[0].text).toContain('"*"')
    })
  })

  describe('response envelope', () => {
    it('always returns content array with a single text entry', () => {
      for (const name of ['Button', '*', 'Nonexistent']) {
        const result = handleGetComponent({ name })
        expect(result.content).toHaveLength(1)
        expect(result.content[0].type).toBe('text')
        expect(typeof result.content[0].text).toBe('string')
      }
    })
  })
})
