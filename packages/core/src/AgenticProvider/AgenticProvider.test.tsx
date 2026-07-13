import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { colorModes, spacing, durations } from '@agentic-ds/tokens'
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

    it('skips the <style> tag with injectStyles={false} (CSP-strict embeds)', () => {
      const { container } = render(
        <AgenticProvider injectStyles={false}>
          <span>child</span>
        </AgenticProvider>
      )
      expect(container.querySelector('[data-agentic-ds] > style')).not.toBeInTheDocument()
    })

    it('still renders children and the scope wrapper with injectStyles={false}', () => {
      const { container } = render(
        <AgenticProvider injectStyles={false}>
          <span>hello</span>
        </AgenticProvider>
      )
      expect(screen.getByText('hello')).toBeInTheDocument()
      expect(container.querySelector('[data-agentic-ds]')).toBeInTheDocument()
    })
  })

  describe('token-to-DOM contract', () => {
    it('CSS custom properties are addressable on [data-agentic-ds] via getComputedStyle', () => {
      const { container } = render(
        <AgenticProvider>
          <span />
        </AgenticProvider>
      )
      const root = container.querySelector('[data-agentic-ds]')
      expect(root).toBeInTheDocument()
      if (!(root instanceof HTMLElement)) throw new Error('[data-agentic-ds] root not rendered')

      // jsdom has no CSS cascade engine, so verify CSS var addressability using inline
      // styles. This confirms the [data-agentic-ds] element is in the DOM and that
      // DS token var names are valid CSS custom property identifiers on that element.
      root.style.setProperty('--ds-color-surface-base', colorModes['color.surface.base'].dark)
      root.style.setProperty(
        '--ds-color-accent-interactive',
        colorModes['color.accent.interactive'].dark
      )
      root.style.setProperty(
        '--ds-color-agent-status-running',
        colorModes['color.agent.status.running'].dark
      )
      root.style.setProperty(
        '--ds-color-agent-status-error',
        colorModes['color.agent.status.error'].dark
      )
      root.style.setProperty('--ds-space-4', spacing[4].$value)
      root.style.setProperty('--ds-duration-normal', durations.normal.$value)

      const computed = getComputedStyle(root)
      expect(computed.getPropertyValue('--ds-color-surface-base').trim()).toBe(
        colorModes['color.surface.base'].dark
      )
      expect(computed.getPropertyValue('--ds-color-accent-interactive').trim()).toBe(
        colorModes['color.accent.interactive'].dark
      )
      expect(computed.getPropertyValue('--ds-color-agent-status-running').trim()).toBe(
        colorModes['color.agent.status.running'].dark
      )
      expect(computed.getPropertyValue('--ds-color-agent-status-error').trim()).toBe(
        colorModes['color.agent.status.error'].dark
      )
      expect(computed.getPropertyValue('--ds-space-4').trim()).toBe(spacing[4].$value)
      expect(computed.getPropertyValue('--ds-duration-normal').trim()).toBe(durations.normal.$value)
    })

    it('Chakra CSS vars are scoped to [data-agentic-ds], not :root', () => {
      render(
        <AgenticProvider>
          <span />
        </AgenticProvider>
      )

      const allStyles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.textContent)
        .join('\n')

      // cssVarsRoot in theme.ts is '[data-agentic-ds]' — Chakra must emit its
      // CSS custom properties scoped to that selector, never to :root.
      expect(allStyles).toContain('[data-agentic-ds]')
      expect(allStyles).not.toMatch(/:root\s*\{[^}]*--/)
    })
  })

  describe('color mode', () => {
    // Restore the shared setup.ts matchMedia mock (matches: false for all
    // queries) after tests that override it.
    afterEach(() => {
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    })

    function getModeRoot(container: HTMLElement): HTMLElement {
      const root = container.querySelector('[data-agentic-ds]')
      if (!(root instanceof HTMLElement)) throw new Error('[data-agentic-ds] root not rendered')
      return root
    }

    it('stamps data-color-mode="dark" by default', () => {
      const { container } = render(
        <AgenticProvider>
          <span />
        </AgenticProvider>
      )
      expect(getModeRoot(container).getAttribute('data-color-mode')).toBe('dark')
    })

    it('stamps data-color-mode="light" when pinned', () => {
      const { container } = render(
        <AgenticProvider colorScheme="light">
          <span />
        </AgenticProvider>
      )
      expect(getModeRoot(container).getAttribute('data-color-mode')).toBe('light')
    })

    it('sets the CSS color-scheme property on the wrapper so UA rendering matches the mode', () => {
      const { container } = render(
        <AgenticProvider colorScheme="light">
          <span />
        </AgenticProvider>
      )
      expect(getModeRoot(container).style.colorScheme).toBe('light')
    })

    it('colorScheme="system" resolves via prefers-color-scheme', () => {
      // The shared setup mock reports matches: false for every query, so the
      // OS reads as not-light → dark.
      const { container } = render(
        <AgenticProvider colorScheme="system">
          <span />
        </AgenticProvider>
      )
      expect(getModeRoot(container).getAttribute('data-color-mode')).toBe('dark')

      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      const { container: lightOS } = render(
        <AgenticProvider colorScheme="system">
          <span />
        </AgenticProvider>
      )
      expect(getModeRoot(lightOS).getAttribute('data-color-mode')).toBe('light')
    })

    it('never sets a class or attribute on <html> — mode stays scoped to the wrapper', () => {
      render(
        <AgenticProvider colorScheme="light">
          <span />
        </AgenticProvider>
      )
      expect(document.documentElement.className).toBe('')
      expect(document.documentElement.getAttribute('data-color-mode')).toBeNull()
    })

    it('emits Chakra dark/light conditions keyed on data-color-mode, not classes', () => {
      render(
        <AgenticProvider>
          <span />
        </AgenticProvider>
      )
      const allStyles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.textContent)
        .join('\n')
      expect(allStyles).toContain('[data-color-mode=dark]')
      expect(allStyles).toContain('[data-color-mode=light]')
    })
  })
})
