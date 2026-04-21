import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { MessageBubble } from './MessageBubble'
import { renderWithProviders } from '../__tests__/test-utils'

describe('MessageBubble', () => {
  describe('default sender labels', () => {
    it('shows "You" for user messages', () => {
      renderWithProviders(<MessageBubble sender="user" content="Hello" />)
      expect(screen.getByText('You')).toBeInTheDocument()
    })

    it('shows "Assistant" for assistant messages', () => {
      renderWithProviders(<MessageBubble sender="assistant" content="Hi there" />)
      expect(screen.getByText('Assistant')).toBeInTheDocument()
    })

    it('shows "Tool" for tool messages', () => {
      renderWithProviders(<MessageBubble sender="tool" content="Result" />)
      expect(screen.getByText('Tool')).toBeInTheDocument()
    })
  })

  describe('custom label', () => {
    it('overrides the default label', () => {
      renderWithProviders(<MessageBubble sender="assistant" content="Hi" label="Claude" />)
      expect(screen.getByText('Claude')).toBeInTheDocument()
      expect(screen.queryByText('Assistant')).not.toBeInTheDocument()
    })
  })

  describe('timestamp', () => {
    it('renders the timestamp when provided', () => {
      renderWithProviders(<MessageBubble sender="user" content="Hello" timestamp="12:34 PM" />)
      expect(screen.getByText('12:34 PM')).toBeInTheDocument()
    })

    it('does not render a timestamp when omitted', () => {
      renderWithProviders(<MessageBubble sender="user" content="Hello" />)
      expect(screen.queryByText('12:34 PM')).not.toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders string content', () => {
      renderWithProviders(<MessageBubble sender="user" content="Hello world" />)
      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })

    it('renders JSX content', () => {
      renderWithProviders(
        <MessageBubble sender="assistant" content={<strong>Bold response</strong>} />,
      )
      expect(screen.getByText('Bold response')).toBeInTheDocument()
    })
  })

  describe('all 3 sender roles render without crashing', () => {
    it.each(['user', 'assistant', 'tool'] as const)('renders sender "%s"', (sender) => {
      renderWithProviders(<MessageBubble sender={sender} content="test" />)
      expect(screen.getByText('test')).toBeInTheDocument()
    })
  })
})
