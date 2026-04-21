import React from 'react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, type TooltipPlacement } from './Tooltip'
import { renderWithProviders } from '../__tests__/test-utils'

// Chakra applies visibility via CSS classes; RTL excludes visibility:hidden elements
// from getByRole by default. Use { hidden: true } when the tooltip starts hidden.

describe('Tooltip', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('structure', () => {
    it('renders trigger children', () => {
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    it('renders tooltip element with role="tooltip" when enabled', () => {
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument()
    })

    it('tooltip contains the label text', () => {
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Save file')
    })
  })

  describe('ARIA', () => {
    it('sets aria-describedby on trigger pointing to the tooltip id', () => {
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      const trigger = screen.getByRole('button')
      const tooltip = screen.getByRole('tooltip', { hidden: true })
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)
    })

    it('does not set aria-describedby on trigger when isDisabled', () => {
      renderWithProviders(
        <Tooltip label="Save file" isDisabled><button>Save</button></Tooltip>,
      )
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('disabled state', () => {
    it('does not render the tooltip element when isDisabled', () => {
      renderWithProviders(
        <Tooltip label="Save file" isDisabled><button>Save</button></Tooltip>,
      )
      expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument()
    })

    it('still renders children when isDisabled', () => {
      renderWithProviders(
        <Tooltip label="Save file" isDisabled><button>Save</button></Tooltip>,
      )
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })
  })

  describe('hover interaction', () => {
    it('tooltip is initially not visible', () => {
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible()
    })

    it('tooltip becomes visible on mouseenter', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      await user.hover(screen.getByRole('button'))
      expect(screen.getByRole('tooltip', { hidden: true })).toBeVisible()
    })

    it('tooltip hides after mouseleave once the hide delay elapses', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      await user.hover(screen.getByRole('button'))
      await user.unhover(screen.getByRole('button'))
      await waitFor(() =>
        expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible(),
      )
    })
  })

  describe('focus interaction', () => {
    it('tooltip becomes visible on focus', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      await user.tab()
      expect(screen.getByRole('tooltip', { hidden: true })).toBeVisible()
    })

    it('tooltip hides on blur once the hide delay elapses', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      await user.tab()
      act(() => { screen.getByRole('button').blur() })
      await waitFor(() =>
        expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible(),
      )
    })
  })

  describe('keyboard interaction', () => {
    it('Escape dismisses the tooltip while it is visible', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Tooltip label="Save file"><button>Save</button></Tooltip>,
      )
      await user.tab()
      expect(screen.getByRole('tooltip', { hidden: true })).toBeVisible()
      await user.keyboard('{Escape}')
      await waitFor(() =>
        expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible(),
      )
    })
  })

  describe('placements', () => {
    const placements: TooltipPlacement[] = ['top', 'right', 'bottom', 'left']
    it.each(placements)('renders placement "%s" without crashing', (placement) => {
      renderWithProviders(
        <Tooltip label="Info" placement={placement}><button>Trigger</button></Tooltip>,
      )
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument()
    })
  })
})
