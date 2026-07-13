import { describe, expect, it } from 'vitest'
import { handleSearch } from './search.js'

describe('handleSearch', () => {
  describe('component matches', () => {
    it('finds components by name term', () => {
      const result = handleSearch({ query: 'button' })
      expect(result.content[0].text).toContain('[component] Button (@agentic-ds/core)')
    })

    it('finds components by description words', () => {
      // "lifecycle" appears in AgentStatus's description, not its name
      const result = handleSearch({ query: 'lifecycle state' })
      expect(result.content[0].text).toContain('[component] AgentStatus')
    })

    it('ranks an exact name match above description-only matches', () => {
      const result = handleSearch({ query: 'button' })
      const lines = result.content[0].text.split('\n')
      const firstHit = lines.find((l) => l.startsWith('['))
      expect(firstHit).toContain('Button')
    })

    it('includes a description snippet for each hit', () => {
      const result = handleSearch({ query: 'streaming', kind: 'component' })
      const hit = result.content[0].text.split('\n').find((l) => l.includes('StreamingText'))
      expect(hit).toMatch(/ — .+/)
    })
  })

  describe('token matches', () => {
    it('finds tokens by path segment', () => {
      const result = handleSearch({ query: 'spacing', kind: 'token' })
      expect(result.content[0].text).toMatch(/\[token] spacing\./)
    })

    it('finds tokens by $description words', () => {
      // Agent status tokens carry descriptions mentioning their state
      const result = handleSearch({ query: 'agent status running', kind: 'token' })
      expect(result.content[0].text).toContain('[token] color.agent.status.running')
    })

    it('includes the token value in the result line', () => {
      const result = handleSearch({ query: 'durations fast', kind: 'token' })
      const hit = result.content[0].text.split('\n').find((l) => l.includes('durations.fast'))
      expect(hit).toMatch(/durations\.fast — .+/)
    })
  })

  describe('kind filter', () => {
    it('kind: "component" excludes tokens', () => {
      const result = handleSearch({ query: 'status', kind: 'component' })
      expect(result.content[0].text).not.toContain('[token]')
      expect(result.content[0].text).toContain('[component]')
    })

    it('kind: "token" excludes components', () => {
      const result = handleSearch({ query: 'status', kind: 'token' })
      expect(result.content[0].text).not.toContain('[component]')
      expect(result.content[0].text).toContain('[token]')
    })

    it('defaults to both kinds', () => {
      const result = handleSearch({ query: 'status' })
      expect(result.content[0].text).toContain('[component]')
      expect(result.content[0].text).toContain('[token]')
    })
  })

  describe('limit', () => {
    it('caps results at the given limit', () => {
      const result = handleSearch({ query: 'color', limit: 3 })
      const hits = result.content[0].text.split('\n').filter((l) => l.startsWith('['))
      expect(hits).toHaveLength(3)
    })

    it('defaults to 10 results', () => {
      const result = handleSearch({ query: 'color' })
      const hits = result.content[0].text.split('\n').filter((l) => l.startsWith('['))
      expect(hits.length).toBeLessThanOrEqual(10)
    })

    it('reports total match count alongside the returned count', () => {
      const result = handleSearch({ query: 'color', limit: 3 })
      expect(result.content[0].text).toMatch(/^Top 3 of \d+ matches/)
    })
  })

  describe('dense mode', () => {
    it('returns names only, without descriptions or header', () => {
      const result = handleSearch({ query: 'button', dense: true })
      const text = result.content[0].text
      expect(text).not.toMatch(/^Top /)
      expect(text.split('\n').every((l) => /^\[(component|token)] \S/.test(l))).toBe(true)
      expect(text).not.toContain(' — ')
    })

    it('is shorter than the default output for the same query', () => {
      const dense = handleSearch({ query: 'status', dense: true })
      const full = handleSearch({ query: 'status' })
      expect(dense.content[0].text.length).toBeLessThan(full.content[0].text.length)
    })
  })

  describe('no matches', () => {
    it('returns a no-match message preserving the query', () => {
      const result = handleSearch({ query: 'xyznotarealthing' })
      expect(result.content[0].text).toContain(
        'No components or tokens matched "xyznotarealthing".'
      )
    })

    it('treats a query with only stop-characters as no match', () => {
      const result = handleSearch({ query: '?? !' })
      expect(result.content[0].text).toContain('No components or tokens matched')
    })
  })

  describe('response envelope', () => {
    it('always returns a single text content entry', () => {
      for (const query of ['status', 'xyznotarealthing']) {
        const result = handleSearch({ query })
        expect(result.content).toHaveLength(1)
        expect(result.content[0].type).toBe('text')
      }
    })
  })
})
