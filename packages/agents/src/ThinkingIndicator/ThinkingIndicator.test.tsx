import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { ThinkingIndicator } from './ThinkingIndicator'
import { renderWithProviders } from '../__tests__/test-utils'

describe('ThinkingIndicator', () => {
  describe('ARIA', () => {
    it('has role="status"', () => {
      renderWithProviders(<ThinkingIndicator />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has aria-live="polite"', () => {
      renderWithProviders(<ThinkingIndicator />)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })

    it('marks the animation dot group as aria-hidden', () => {
      renderWithProviders(<ThinkingIndicator />)
      const statusEl = screen.getByRole('status')
      expect(statusEl.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    })
  })

  describe('label', () => {
    it('shows the default "Thinking" label', () => {
      renderWithProviders(<ThinkingIndicator />)
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })

    it('shows a custom label when provided', () => {
      renderWithProviders(<ThinkingIndicator label="Processing…" />)
      expect(screen.getByText('Processing…')).toBeInTheDocument()
      expect(screen.queryByText('Thinking')).not.toBeInTheDocument()
    })

    it('hides the label text when an empty string is passed', () => {
      renderWithProviders(<ThinkingIndicator label="" />)
      expect(screen.queryByText('Thinking')).not.toBeInTheDocument()
    })
  })
})
