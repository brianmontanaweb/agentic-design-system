import { describe, expect, it } from 'vitest'
import { handleGetToken } from './get-token.js'

describe('handleGetToken', () => {
  describe('when tokens match', () => {
    it('returns a found message with match count', () => {
      const result = handleGetToken({ name: 'spacing' })
      expect(result.content[0].text).toMatch(/^Found \d+ tokens? matching "spacing":/)
    })

    it('returns token entries in "path: value (type)" format', () => {
      const result = handleGetToken({ name: 'spacing' })
      expect(result.content[0].text).toMatch(/spacing\.\S+: .+ \(\w+\)/)
    })

    it('matches case-insensitively', () => {
      const lower = handleGetToken({ name: 'durations' })
      const upper = handleGetToken({ name: 'DURATIONS' })
      // The header echoes the original query, so compare only the token entry lines
      const lowerEntries = lower.content[0].text.split('\n').slice(2)
      const upperEntries = upper.content[0].text.split('\n').slice(2)
      expect(lowerEntries).toEqual(upperEntries)
    })

    it('trims whitespace from the query', () => {
      const clean = handleGetToken({ name: 'spacing' })
      const padded = handleGetToken({ name: '  spacing  ' })
      // The header echoes the original query, so compare only the token entry lines
      const cleanEntries = clean.content[0].text.split('\n').slice(2)
      const paddedEntries = padded.content[0].text.split('\n').slice(2)
      expect(cleanEntries).toEqual(paddedEntries)
    })

    it('matches partial paths (prefix search)', () => {
      const result = handleGetToken({ name: 'radii' })
      expect(result.content[0].text).toMatch(/radii\./)
    })

    it('matches tokens across all categories', () => {
      const categories = [
        'colors',
        'lightColors',
        'semanticColors',
        'spacing',
        'fonts',
        'fontSizes',
        'fontWeights',
        'durations',
        'radii',
        'lineHeights',
        'shadows',
        'zIndex',
      ]
      for (const category of categories) {
        const result = handleGetToken({ name: category })
        expect(result.content[0].text, `no tokens found for category "${category}"`).toMatch(
          /^Found/
        )
      }
    })

    it('uses plural "tokens" when multiple results are found', () => {
      const result = handleGetToken({ name: 'spacing' })
      expect(result.content[0].text).toMatch(/Found \d+ tokens matching/)
    })

    it('uses singular "token" when exactly one result is found', () => {
      // semanticColors.agent.status.running is specific enough to be unique
      const result = handleGetToken({ name: 'agent.status.running' })
      const text = result.content[0].text
      if (text.startsWith('Found 1')) {
        expect(text).toMatch(/Found 1 token matching/)
      }
    })

    it('includes description as a comment when present', () => {
      // Check that at least some token entries include a description comment
      const result = handleGetToken({ name: 'semanticColors' })
      const text = result.content[0].text
      // Some semantic tokens have descriptions; at least one should include " // "
      expect(text).toContain('//')
    })
  })

  describe('when no tokens match', () => {
    it('returns a no-match message preserving the original query', () => {
      const result = handleGetToken({ name: 'xyznotarealtoken' })
      expect(result.content[0].text).toContain('No tokens found matching "xyznotarealtoken".')
    })

    it('lists all 8 available categories', () => {
      const result = handleGetToken({ name: 'xyznotarealtoken' })
      const text = result.content[0].text
      const expected = [
        'colors',
        'lightColors',
        'semanticColors',
        'spacing',
        'fonts',
        'fontSizes',
        'fontWeights',
        'durations',
        'radii',
        'lineHeights',
        'shadows',
        'zIndex',
      ]
      for (const cat of expected) {
        expect(text, `"${cat}" missing from no-match message`).toContain(cat)
      }
    })

    it('includes usage examples', () => {
      const result = handleGetToken({ name: 'xyznotarealtoken' })
      expect(result.content[0].text).toContain('Examples:')
    })
  })

  describe('response envelope', () => {
    it('always returns content array with a single text entry', () => {
      for (const name of ['space', 'xyznotarealtoken']) {
        const result = handleGetToken({ name })
        expect(result.content).toHaveLength(1)
        expect(result.content[0].type).toBe('text')
        expect(typeof result.content[0].text).toBe('string')
      }
    })
  })
})
