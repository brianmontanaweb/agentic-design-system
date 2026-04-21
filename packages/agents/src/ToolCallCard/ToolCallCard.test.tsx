import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolCallCard, type ToolCallStatus } from './ToolCallCard'
import { renderWithProviders } from '../__tests__/test-utils'

describe('ToolCallCard', () => {
  describe('rendering', () => {
    it('renders the tool name', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" />)
      expect(screen.getByText('get_weather')).toBeInTheDocument()
    })

    it('has an accessible label on the expand button', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" />)
      expect(screen.getByRole('button', { name: 'get_weather details' })).toBeInTheDocument()
    })
  })

  describe('collapse / expand', () => {
    it('starts collapsed by default', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" input={{ city: 'NYC' }} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByText('Input')).not.toBeInTheDocument()
    })

    it('starts open when defaultOpen is true', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" input={{ city: 'NYC' }} defaultOpen />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('Input')).toBeInTheDocument()
    })

    it('expands when the header is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ToolCallCard toolName="get_weather" input={{ city: 'NYC' }} />)
      await user.click(screen.getByRole('button'))
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('Input')).toBeInTheDocument()
    })

    it('collapses when clicked a second time', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ToolCallCard toolName="get_weather" input={{ city: 'NYC' }} defaultOpen />)
      await user.click(screen.getByRole('button'))
      expect(screen.queryByText('Input')).not.toBeInTheDocument()
    })

    it('aria-controls points to the content panel id', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" input={{}} defaultOpen />)
      const btn = screen.getByRole('button')
      const panelId = btn.getAttribute('aria-controls') ?? ''
      expect(panelId).toBeTruthy()
      expect(document.getElementById(panelId)).toBeInTheDocument()
    })
  })

  describe('input rendering', () => {
    it('renders input as formatted JSON', async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(
        <ToolCallCard toolName="get_weather" input={{ city: 'NYC' }} />,
      )
      await user.click(screen.getByRole('button'))
      expect(screen.getByText('Input')).toBeInTheDocument()
      expect(container.querySelector('code')?.textContent).toContain('"city": "NYC"')
    })

    it('renders nested object input correctly', async () => {
      const user = userEvent.setup()
      const input = { filters: { status: 'active', limit: 10 } }
      const { container } = renderWithProviders(<ToolCallCard toolName="query" input={input} />)
      await user.click(screen.getByRole('button'))
      expect(container.querySelector('code')?.textContent).toContain('"status": "active"')
    })

    it('does not show Input section when input is undefined', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ToolCallCard toolName="get_weather" output="sunny" />)
      await user.click(screen.getByRole('button'))
      expect(screen.queryByText('Input')).not.toBeInTheDocument()
      expect(screen.getByText('Output')).toBeInTheDocument()
    })
  })

  describe('output rendering', () => {
    it('renders output section when output is provided', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" output="72°F" defaultOpen />)
      expect(screen.getByText('Output')).toBeInTheDocument()
      expect(screen.getByText('72°F')).toBeInTheDocument()
    })

    it('does not show Output section when output is undefined', () => {
      renderWithProviders(<ToolCallCard toolName="get_weather" defaultOpen />)
      expect(screen.queryByText('Output')).not.toBeInTheDocument()
    })
  })

  describe('all 4 statuses render without crashing', () => {
    const statuses: ToolCallStatus[] = ['pending', 'running', 'done', 'error']
    it.each(statuses)('renders status "%s"', (status) => {
      renderWithProviders(<ToolCallCard toolName="tool" status={status} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
