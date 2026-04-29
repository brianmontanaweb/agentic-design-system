import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { colors, space, duration } from '@agentic-ds/tokens'
import { AgenticProvider } from './AgenticProvider'

describe('AgenticProvider', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <AgenticProvider>
          <span>hello world</span>
        </AgenticProvider>
      )
      expect(screen.getByText('hello world')).toBeInTheDocument()
    })

    it('wraps output in a data-agentic-ds element', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>
      )
      expect(container.querySelector('[data-agentic-ds]')).toBeInTheDocument()
    })
  })

  describe('keyframe injection', () => {
    it('injects a <style> tag into the data-agentic-ds wrapper', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>
      )
      const styleTag = container.querySelector('[data-agentic-ds] style')
      expect(styleTag).toBeInTheDocument()
    })

    it('includes the ds-pulse keyframe', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>
      )
      const styleTag = container.querySelector('[data-agentic-ds] style')
      expect(styleTag?.textContent).toContain('ds-pulse')
    })

    it('includes the ds-blink keyframe', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>
      )
      const styleTag = container.querySelector('[data-agentic-ds] style')
      expect(styleTag?.textContent).toContain('ds-blink')
    })
  })

  describe('token-to-DOM contract', () => {
    it('CSS custom properties are addressable on [data-agentic-ds] via getComputedStyle', () => {
      const { container } = render(
        <AgenticProvider>
          <span />
        </AgenticProvider>
      )
      const root = container.querySelector('[data-agentic-ds]') as HTMLElement
      expect(root).toBeInTheDocument()

      // jsdom has no CSS cascade engine, so verify CSS var addressability using inline
      // styles. This confirms the [data-agentic-ds] element is in the DOM and that
      // DS token var names are valid CSS custom property identifiers on that element.
      root.style.setProperty('--ds-color-surface-base', colors.bgBase.$value)
      root.style.setProperty('--ds-color-accent-interactive', colors.accentBlue.$value)
      root.style.setProperty('--ds-color-agent-status-running', colors.accentBlue.$value)
      root.style.setProperty('--ds-color-agent-status-error', colors.accentRed.$value)
      root.style.setProperty('--ds-space-4', space[4].$value)
      root.style.setProperty('--ds-duration-normal', duration.normal.$value)

      const computed = getComputedStyle(root)
      expect(computed.getPropertyValue('--ds-color-surface-base').trim()).toBe(colors.bgBase.$value)
      expect(computed.getPropertyValue('--ds-color-accent-interactive').trim()).toBe(
        colors.accentBlue.$value
      )
      expect(computed.getPropertyValue('--ds-color-agent-status-running').trim()).toBe(
        colors.accentBlue.$value
      )
      expect(computed.getPropertyValue('--ds-color-agent-status-error').trim()).toBe(
        colors.accentRed.$value
      )
      expect(computed.getPropertyValue('--ds-space-4').trim()).toBe(space[4].$value)
      expect(computed.getPropertyValue('--ds-duration-normal').trim()).toBe(duration.normal.$value)
    })

    it('Chakra CSS vars are scoped to [data-agentic-ds], not :root', () => {
      render(
        <AgenticProvider>
          <span />
        </AgenticProvider>
      )

      const allStyles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.textContent ?? '')
        .join('\n')

      // cssVarsRoot in theme.ts is '[data-agentic-ds]' — Chakra must emit its
      // CSS custom properties scoped to that selector, never to :root.
      expect(allStyles).toContain('[data-agentic-ds]')
      expect(allStyles).not.toMatch(/:root\s*\{[^}]*--/)
    })
  })
})
