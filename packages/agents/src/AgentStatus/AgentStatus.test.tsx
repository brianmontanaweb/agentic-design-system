import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { AgentStatus, type AgentStatusValue } from './AgentStatus'
import { renderWithProviders } from '../__tests__/test-utils'

const allStatuses: AgentStatusValue[] = ['idle', 'running', 'waiting', 'done', 'error', 'cancelled']

describe('AgentStatus', () => {
  describe('ARIA', () => {
    it('has role="status"', () => {
      renderWithProviders(<AgentStatus status="idle" />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has aria-live="polite"', () => {
      renderWithProviders(<AgentStatus status="idle" />)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })

    it('includes visually-hidden "Agent status:" phrase', () => {
      renderWithProviders(<AgentStatus status="running" />)
      expect(screen.getByText(/Agent status:/i)).toBeInTheDocument()
    })

    it('uses custom label in the hidden phrase', () => {
      renderWithProviders(<AgentStatus status="running" label="Processing data" />)
      expect(screen.getByText('Agent status: Processing data')).toBeInTheDocument()
    })
  })

  describe('default status labels', () => {
    const statusLabels: [AgentStatusValue, string][] = [
      ['idle', 'Idle'],
      ['running', 'Running'],
      ['waiting', 'Waiting'],
      ['done', 'Done'],
      ['error', 'Error'],
      ['cancelled', 'Cancelled'],
    ]

    it.each(statusLabels)('displays default label for "%s" status', (status, label) => {
      renderWithProviders(<AgentStatus status={status} />)
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  describe('custom label', () => {
    it('overrides the default status label text', () => {
      renderWithProviders(<AgentStatus status="running" label="Processing data" />)
      expect(screen.getByText('Processing data')).toBeInTheDocument()
      expect(screen.queryByText('Running')).not.toBeInTheDocument()
    })
  })

  describe('dynamic status changes', () => {
    it('updates the visible label when status prop changes', () => {
      const { rerender } = renderWithProviders(<AgentStatus status="running" />)
      expect(screen.getByText('Running')).toBeInTheDocument()
      rerender(<AgentStatus status="done" />)
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.queryByText('Running')).not.toBeInTheDocument()
    })

    it('updates the hidden phrase when status prop changes', () => {
      const { rerender } = renderWithProviders(<AgentStatus status="running" />)
      expect(screen.getByText('Agent status: Running')).toBeInTheDocument()
      rerender(<AgentStatus status="error" />)
      expect(screen.getByText('Agent status: Error')).toBeInTheDocument()
    })
  })

  describe('all 6 MCP lifecycle states render', () => {
    it.each(allStatuses)('renders status "%s" without crashing', (status) => {
      renderWithProviders(<AgentStatus status={status} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('waiting and cancelled state transitions', () => {
    it('announces the waiting state when status changes from running to waiting', () => {
      const { rerender } = renderWithProviders(<AgentStatus status="running" />)
      expect(screen.getByText('Agent status: Running')).toBeInTheDocument()

      rerender(<AgentStatus status="waiting" />)
      expect(screen.getByText('Agent status: Waiting')).toBeInTheDocument()
      expect(screen.queryByText('Agent status: Running')).not.toBeInTheDocument()
    })

    it('announces the cancelled state when status changes from running to cancelled', () => {
      const { rerender } = renderWithProviders(<AgentStatus status="running" />)
      expect(screen.getByText('Agent status: Running')).toBeInTheDocument()

      rerender(<AgentStatus status="cancelled" />)
      expect(screen.getByText('Agent status: Cancelled')).toBeInTheDocument()
      expect(screen.queryByText('Agent status: Running')).not.toBeInTheDocument()
    })

    it('transitions from waiting back to running', () => {
      const { rerender } = renderWithProviders(<AgentStatus status="waiting" />)
      expect(screen.getByText('Waiting')).toBeInTheDocument()

      rerender(<AgentStatus status="running" />)
      expect(screen.getByText('Running')).toBeInTheDocument()
      expect(screen.queryByText('Waiting')).not.toBeInTheDocument()
    })
  })
})
