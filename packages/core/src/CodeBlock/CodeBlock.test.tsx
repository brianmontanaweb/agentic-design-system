import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'
import { renderWithProviders } from '../__tests__/test-utils'

describe('CodeBlock', () => {
  describe('code content', () => {
    it('renders the code children', () => {
      renderWithProviders(<CodeBlock>const x = 1</CodeBlock>)
      expect(screen.getByText('const x = 1')).toBeInTheDocument()
    })

    it('renders multi-line code', () => {
      const { container } = renderWithProviders(<CodeBlock>{'line1\nline2'}</CodeBlock>)
      // RTL normalizes whitespace in getByText, so check raw textContent instead
      expect(container.querySelector('code')?.textContent).toContain('line1')
      expect(container.querySelector('code')?.textContent).toContain('line2')
    })
  })

  describe('language label', () => {
    it('shows the language label when language prop is provided', () => {
      renderWithProviders(<CodeBlock language="typescript">const x = 1</CodeBlock>)
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })

    it('does not render a language label when language is omitted', () => {
      renderWithProviders(<CodeBlock>const x = 1</CodeBlock>)
      expect(screen.queryByText('typescript')).not.toBeInTheDocument()
    })

    it('supports any language string', () => {
      renderWithProviders(<CodeBlock language="python">print("hi")</CodeBlock>)
      expect(screen.getByText('python')).toBeInTheDocument()
    })
  })
})
