import { describe, expect, it } from 'vitest'
import { buildStaticCss } from './static-css.js'

// The built stylesheet must let a CSP-strict iframe (style-src without
// 'unsafe-inline') render the design system without AgenticProvider's inline
// <style> injection: custom properties, keyframes, and reduced-motion rules.
describe('buildStaticCss', () => {
  const css = buildStaticCss()

  it('scopes custom properties to [data-agentic-ds], never :root', () => {
    expect(css).toContain('[data-agentic-ds] {')
    expect(css).not.toContain(':root')
  })

  it('includes both color modes', () => {
    expect(css).toContain('[data-agentic-ds][data-color-mode="light"]')
    expect(css).toContain('@media (prefers-color-scheme: light)')
  })

  it('includes the ds-prefixed keyframes', () => {
    expect(css).toContain('@keyframes ds-pulse')
    expect(css).toContain('@keyframes ds-blink')
  })

  it('includes the reduced-motion overrides scoped to [data-agentic-ds]', () => {
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('[data-agentic-ds] *, [data-agentic-ds] *::before')
  })

  it('names representative token custom properties', () => {
    expect(css).toContain('--ds-color-agent-status-running:')
    expect(css).toContain('--ds-duration-fast:')
  })

  it('documents the CSP embedding contract in the header', () => {
    expect(css).toContain('injectStyles={false}')
    expect(css).toContain('stock theme only')
  })
})
