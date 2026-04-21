import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { MessageThread } from './MessageThread'
import { renderWithProviders } from '../__tests__/test-utils'

describe('MessageThread', () => {
  describe('ARIA live region', () => {
    it('has role="log"', () => {
      renderWithProviders(<MessageThread>content</MessageThread>)
      expect(screen.getByRole('log')).toBeInTheDocument()
    })

    it('has aria-live="polite"', () => {
      renderWithProviders(<MessageThread>content</MessageThread>)
      expect(screen.getByRole('log')).toHaveAttribute('aria-live', 'polite')
    })

    it('has aria-atomic="false"', () => {
      renderWithProviders(<MessageThread>content</MessageThread>)
      expect(screen.getByRole('log')).toHaveAttribute('aria-atomic', 'false')
    })
  })

  describe('aria-label', () => {
    it('uses the default label', () => {
      renderWithProviders(<MessageThread>content</MessageThread>)
      expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Message thread')
    })

    it('accepts a custom aria-label', () => {
      renderWithProviders(<MessageThread aria-label="Agent conversation">content</MessageThread>)
      expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Agent conversation')
    })
  })

  describe('children', () => {
    it('renders children inside the log region', () => {
      renderWithProviders(
        <MessageThread>
          <div>Hello from user</div>
        </MessageThread>,
      )
      expect(screen.getByText('Hello from user')).toBeInTheDocument()
    })
  })

  describe('autoScroll', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('calls scrollIntoView on mount when autoScroll is true (default)', () => {
      renderWithProviders(<MessageThread>content</MessageThread>)
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('does not call scrollIntoView when autoScroll is false', () => {
      renderWithProviders(<MessageThread autoScroll={false}>content</MessageThread>)
      expect(window.HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled()
    })

    it('calls scrollIntoView again when children update', () => {
      const { rerender } = renderWithProviders(<MessageThread>first message</MessageThread>)
      vi.clearAllMocks()
      rerender(<MessageThread>second message</MessageThread>)
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1)
    })
  })
})
