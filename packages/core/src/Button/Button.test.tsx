import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, type ButtonVariant, type ButtonSize } from './Button'
import { renderWithProviders } from '../__tests__/test-utils'

describe('Button', () => {
  describe('rendering', () => {
    it('renders children as its label', () => {
      renderWithProviders(<Button>Save changes</Button>)
      expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
    })

    it('renders with aria-label when no children', () => {
      renderWithProviders(<Button aria-label="Close panel" />)
      expect(screen.getByRole('button', { name: 'Close panel' })).toBeInTheDocument()
    })

    it('stretches to full width when fullWidth is set', () => {
      renderWithProviders(<Button fullWidth>Submit</Button>)
      expect(screen.getByRole('button')).toHaveStyle({ width: '100%' })
    })
  })

  describe('variants', () => {
    const variants: ButtonVariant[] = ['solid', 'outline', 'ghost', 'danger']
    it.each(variants)('renders variant "%s" without crashing', (variant) => {
      renderWithProviders(<Button variant={variant}>Action</Button>)
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    const sizes: ButtonSize[] = ['sm', 'md', 'lg']
    it.each(sizes)('renders size "%s" without crashing', (size) => {
      renderWithProviders(<Button size={size}>Action</Button>)
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('type prop', () => {
    it('defaults to type="button"', () => {
      renderWithProviders(<Button>Save</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('sets type="submit"', () => {
      renderWithProviders(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('sets type="reset"', () => {
      renderWithProviders(<Button type="reset">Reset</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
    })
  })

  describe('icons', () => {
    it('renders leftIcon inside the button', () => {
      const icon = <svg data-testid="left-icon" />
      renderWithProviders(<Button leftIcon={icon}>Save</Button>)
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('renders rightIcon inside the button', () => {
      const icon = <svg data-testid="right-icon" />
      renderWithProviders(<Button rightIcon={icon}>Save</Button>)
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })

    it('renders both leftIcon and rightIcon together', () => {
      renderWithProviders(
        <Button leftIcon={<svg data-testid="left" />} rightIcon={<svg data-testid="right" />}>
          Save
        </Button>
      )
      expect(screen.getByTestId('left')).toBeInTheDocument()
      expect(screen.getByTestId('right')).toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('applies native disabled attribute', () => {
      renderWithProviders(<Button disabled>Save</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 })
      const onClick = vi.fn()
      renderWithProviders(
        <Button disabled onClick={onClick}>
          Save
        </Button>
      )
      await user.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('loading state', () => {
    it('sets aria-busy when loading', () => {
      renderWithProviders(<Button loading>Save</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('swaps aria-label for loadingText when loading', () => {
      renderWithProviders(
        <Button loading loadingText="Saving…">
          Save
        </Button>
      )
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Saving…')
    })

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 })
      const onClick = vi.fn()
      renderWithProviders(
        <Button loading onClick={onClick}>
          Save
        </Button>
      )
      await user.click(screen.getByRole('button'))
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('onClick', () => {
    it('calls onClick when clicked in default state', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      renderWithProviders(<Button onClick={onClick}>Save</Button>)
      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('keyboard interaction', () => {
    it('calls onClick when Enter is pressed', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      renderWithProviders(<Button onClick={onClick}>Save</Button>)
      screen.getByRole('button').focus()
      await user.keyboard('{Enter}')
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('calls onClick when Space is pressed', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      renderWithProviders(<Button onClick={onClick}>Save</Button>)
      screen.getByRole('button').focus()
      await user.keyboard(' ')
      expect(onClick).toHaveBeenCalledOnce()
    })
  })
})
