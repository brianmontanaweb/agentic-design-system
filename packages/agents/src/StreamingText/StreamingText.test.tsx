import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { StreamingText } from './StreamingText'
import { renderWithProviders } from '../__tests__/test-utils'

describe('StreamingText', () => {
  describe('ARIA live region', () => {
    it('has role="log"', () => {
      renderWithProviders(<StreamingText text="Hello" />)
      expect(screen.getByRole('log')).toBeInTheDocument()
    })

    it('has aria-live="polite"', () => {
      renderWithProviders(<StreamingText text="Hello" />)
      expect(screen.getByRole('log')).toHaveAttribute('aria-live', 'polite')
    })

    it('has aria-atomic="false"', () => {
      renderWithProviders(<StreamingText text="Hello" />)
      expect(screen.getByRole('log')).toHaveAttribute('aria-atomic', 'false')
    })

    it('uses the default aria-label "Streaming output"', () => {
      renderWithProviders(<StreamingText text="Hello" />)
      expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Streaming output')
    })

    it('accepts a custom aria-label', () => {
      renderWithProviders(<StreamingText text="Hello" aria-label="Tool result stream" />)
      expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Tool result stream')
    })
  })

  describe('text rendering', () => {
    it('renders the text content', () => {
      renderWithProviders(<StreamingText text="Streamed content here" />)
      expect(screen.getByText('Streamed content here')).toBeInTheDocument()
    })

    it('renders an empty string without crashing', () => {
      renderWithProviders(<StreamingText text="" />)
      expect(screen.getByRole('log')).toBeInTheDocument()
    })
  })

  describe('streaming cursor', () => {
    it('renders the cursor when isStreaming is true', () => {
      renderWithProviders(<StreamingText text="Hello" isStreaming />)
      const logEl = screen.getByRole('log')
      expect(logEl.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    })

    it('does not render the cursor when isStreaming is false', () => {
      renderWithProviders(<StreamingText text="Hello" isStreaming={false} />)
      const logEl = screen.getByRole('log')
      expect(logEl.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
    })

    it('does not render the cursor by default', () => {
      renderWithProviders(<StreamingText text="Hello" />)
      const logEl = screen.getByRole('log')
      expect(logEl.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
    })
  })
})
