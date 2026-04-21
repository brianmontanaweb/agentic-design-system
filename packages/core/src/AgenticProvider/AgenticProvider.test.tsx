import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgenticProvider } from './AgenticProvider'

describe('AgenticProvider', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <AgenticProvider>
          <span>hello world</span>
        </AgenticProvider>,
      )
      expect(screen.getByText('hello world')).toBeInTheDocument()
    })

    it('wraps output in a data-agentic-ds element', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>,
      )
      expect(container.querySelector('[data-agentic-ds]')).toBeInTheDocument()
    })
  })

  describe('keyframe injection', () => {
    it('injects a <style> tag into the data-agentic-ds wrapper', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>,
      )
      const styleTag = container.querySelector('[data-agentic-ds] style')
      expect(styleTag).toBeInTheDocument()
    })

    it('includes the ds-pulse keyframe', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>,
      )
      const styleTag = container.querySelector('[data-agentic-ds] style')
      expect(styleTag?.textContent).toContain('ds-pulse')
    })

    it('includes the ds-blink keyframe', () => {
      const { container } = render(
        <AgenticProvider>
          <span>child</span>
        </AgenticProvider>,
      )
      const styleTag = container.querySelector('[data-agentic-ds] style')
      expect(styleTag?.textContent).toContain('ds-blink')
    })
  })
})
