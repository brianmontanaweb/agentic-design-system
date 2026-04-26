import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { ProgressSteps, type Step } from './ProgressSteps'
import { renderWithProviders } from '../__tests__/test-utils'

function makeStep(overrides: Partial<Step> = {}): Step {
  return { id: 'step-1', label: 'Step One', status: 'pending', ...overrides }
}

describe('ProgressSteps', () => {
  describe('list semantics', () => {
    it('renders a list container', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep()]} />)
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('renders each step as a listitem', () => {
      const steps = [
        makeStep({ id: 'a', label: 'A', status: 'complete' }),
        makeStep({ id: 'b', label: 'B', status: 'active' }),
      ]
      renderWithProviders(<ProgressSteps steps={steps} />)
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('renders steps in the provided order', () => {
      const steps = [
        makeStep({ id: 'a', label: 'First', status: 'complete' }),
        makeStep({ id: 'b', label: 'Second', status: 'active' }),
        makeStep({ id: 'c', label: 'Third', status: 'pending' }),
      ]
      renderWithProviders(<ProgressSteps steps={steps} />)
      const items = screen.getAllByRole('listitem')
      expect(items[0]).toHaveTextContent('First')
      expect(items[1]).toHaveTextContent('Second')
      expect(items[2]).toHaveTextContent('Third')
    })
  })

  describe('aria-current', () => {
    it('sets aria-current="step" on the active step', () => {
      const steps = [
        makeStep({ id: 'a', label: 'Done', status: 'complete' }),
        makeStep({ id: 'b', label: 'Active', status: 'active' }),
        makeStep({ id: 'c', label: 'Next', status: 'pending' }),
      ]
      renderWithProviders(<ProgressSteps steps={steps} />)
      const items = screen.getAllByRole('listitem')
      expect(items[0]).not.toHaveAttribute('aria-current')
      expect(items[1]).toHaveAttribute('aria-current', 'step')
      expect(items[2]).not.toHaveAttribute('aria-current')
    })

    it('does not set aria-current on non-active statuses', () => {
      const statuses = ['pending', 'complete', 'waiting', 'cancelled'] as const
      statuses.forEach((status) => {
        const { unmount } = renderWithProviders(<ProgressSteps steps={[makeStep({ status })]} />)
        expect(screen.getByRole('listitem')).not.toHaveAttribute('aria-current')
        unmount()
      })
    })
  })

  describe('step dot symbols', () => {
    it('renders a checkmark for complete steps', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ status: 'complete' })]} />)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('renders a dash for cancelled steps', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ status: 'cancelled' })]} />)
      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('renders 1-based step numbers for pending steps', () => {
      const steps = [
        makeStep({ id: 'a', label: 'A', status: 'pending' }),
        makeStep({ id: 'b', label: 'B', status: 'pending' }),
      ]
      renderWithProviders(<ProgressSteps steps={steps} />)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('renders the step number for active steps', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ status: 'active' })]} />)
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('renders the step number for waiting steps', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ status: 'waiting' })]} />)
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('step content', () => {
    it('renders the step label', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ label: 'Fetch data' })]} />)
      expect(screen.getByText('Fetch data')).toBeInTheDocument()
    })

    it('renders the step description when provided', () => {
      renderWithProviders(
        <ProgressSteps steps={[makeStep({ description: 'Calling external API' })]} />
      )
      expect(screen.getByText('Calling external API')).toBeInTheDocument()
    })

    it('does not render a description element when omitted', () => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ description: undefined })]} />)
      expect(screen.queryByText('Calling external API')).not.toBeInTheDocument()
    })
  })

  describe('all 5 statuses render without crashing', () => {
    const allStatuses: Step['status'][] = ['pending', 'active', 'complete', 'waiting', 'cancelled']
    it.each(allStatuses)('renders status "%s"', (status) => {
      renderWithProviders(<ProgressSteps steps={[makeStep({ status })]} />)
      expect(screen.getByRole('list')).toBeInTheDocument()
    })
  })

  describe('aria-current updates on rerender', () => {
    it('moves aria-current to the newly active step', () => {
      const steps = [
        makeStep({ id: 'a', label: 'First', status: 'active' }),
        makeStep({ id: 'b', label: 'Second', status: 'pending' }),
      ]
      const { rerender } = renderWithProviders(<ProgressSteps steps={steps} />)
      expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step')
      expect(screen.getAllByRole('listitem')[1]).not.toHaveAttribute('aria-current')

      rerender(
        <ProgressSteps
          steps={[
            { ...steps[0], status: 'complete' },
            { ...steps[1], status: 'active' },
          ]}
        />
      )
      expect(screen.getAllByRole('listitem')[0]).not.toHaveAttribute('aria-current')
      expect(screen.getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step')
    })

    it('clears aria-current when the active step transitions to waiting', () => {
      const step = makeStep({ id: 'a', label: 'In progress', status: 'active' })
      const { rerender } = renderWithProviders(<ProgressSteps steps={[step]} />)
      expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'step')

      rerender(<ProgressSteps steps={[{ ...step, status: 'waiting' }]} />)
      expect(screen.getByRole('listitem')).not.toHaveAttribute('aria-current')
    })

    it('clears aria-current when the active step is cancelled', () => {
      const step = makeStep({ id: 'a', label: 'In progress', status: 'active' })
      const { rerender } = renderWithProviders(<ProgressSteps steps={[step]} />)
      expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'step')

      rerender(<ProgressSteps steps={[{ ...step, status: 'cancelled' }]} />)
      expect(screen.getByRole('listitem')).not.toHaveAttribute('aria-current')
    })
  })
})
