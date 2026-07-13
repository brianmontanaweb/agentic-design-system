import { describe, expect, it } from 'vitest'
import { handleGetComponent } from './get-component.js'

const ALL_COMPONENT_NAMES = [
  'AgenticProvider',
  'Button',
  'CodeBlock',
  'useReducedMotion',
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

    it('includes the category and WCAG level', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('Category: action')
      expect(result.content[0].text).toContain('WCAG: AA')
    })

    it('includes the ARIA pattern URL when the spec declares one', () => {
      const result = handleGetComponent({ name: 'ToolCallCard' })
      expect(result.content[0].text).toContain(
        'ARIA pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/'
      )
    })

    it('omits the ARIA pattern line when the spec declares n/a', () => {
      const result = handleGetComponent({ name: 'CodeBlock' })
      expect(result.content[0].text).not.toContain('ARIA pattern:')
    })

    it('includes ### Props section', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('### Props')
    })

    it('omits ### Props section for prop-less entries', () => {
      const result = handleGetComponent({ name: 'useReducedMotion' })
      expect(result.content[0].text).not.toContain('### Props')
    })

    it('shows required props as (required)', () => {
      const result = handleGetComponent({ name: 'AgentStatus' })
      expect(result.content[0].text).toContain('(required)')
    })

    it('shows optional props with their default values', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('default: "solid"')
    })

    it('includes ### Types section when the component has type enums', () => {
      const result = handleGetComponent({ name: 'AgentStatus' })
      expect(result.content[0].text).toContain('### Types')
      expect(result.content[0].text).toContain('AgentStatusValue')
    })

    it('omits ### Types section when the component has no type enums', () => {
      const result = handleGetComponent({ name: 'CodeBlock' })
      expect(result.content[0].text).not.toContain('### Types')
    })

    it('includes ### Tokens section listing token groups', () => {
      const result = handleGetComponent({ name: 'Button' })
      expect(result.content[0].text).toContain('### Tokens')
      expect(result.content[0].text).toContain('**radius**: radius.md')
    })

    it('describes the token resolution root for tokens: all', () => {
      const result = handleGetComponent({ name: 'AgenticProvider' })
      expect(result.content[0].text).toContain('All semantic tokens')
    })

    it('omits ### Tokens section when the spec declares n/a', () => {
      const result = handleGetComponent({ name: 'useReducedMotion' })
      expect(result.content[0].text).not.toContain('### Tokens')
    })

    it('includes ### Accessibility section for components with ariaNotes', () => {
      const result = handleGetComponent({ name: 'AgentStatus' })
      expect(result.content[0].text).toContain('### Accessibility')
    })
  })

  describe('wildcard "*"', () => {
    it('includes the total component count', () => {
      const result = handleGetComponent({ name: '*' })
      expect(result.content[0].text).toContain('11 total')
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
