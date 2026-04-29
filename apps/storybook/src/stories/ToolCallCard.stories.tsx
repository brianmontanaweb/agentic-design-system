import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { ToolCallCard } from '@agentic-ds/agents'

const meta: Meta<typeof ToolCallCard> = {
  title: 'Agents/ToolCallCard',
  component: ToolCallCard,
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'running', 'done', 'error'],
    },
  },
}
export default meta

type Story = StoryObj<typeof ToolCallCard>

export const Done: Story = {
  args: {
    toolName: 'search_papers',
    input: { query: 'diffusion models 2024', limit: 10 },
    output: 'Found 10 papers. Top result: "Consistency Models" (2024)...',
    status: 'done',
    defaultOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'search_papers details' })

    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Input')).toBeInTheDocument()
    await expect(canvas.getByText('Output')).toBeInTheDocument()

    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText('Input')).not.toBeInTheDocument()
  },
}

export const Running: Story = {
  args: {
    toolName: 'fetch_abstract',
    input: { paper_id: 'arxiv:2402.00123' },
    status: 'running',
  },
}

export const Error: Story = {
  args: {
    toolName: 'read_file',
    input: { path: '/etc/secret' },
    output: 'Error: Permission denied',
    status: 'error',
    defaultOpen: true,
  },
}

export const Collapsed: Story = {
  args: {
    toolName: 'search_papers',
    input: { query: 'transformers' },
    output: 'Found 5 results.',
    status: 'done',
    defaultOpen: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'search_papers details' })

    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText('Input')).not.toBeInTheDocument()

    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Input')).toBeInTheDocument()
    await expect(canvas.getByText('Output')).toBeInTheDocument()

    await userEvent.keyboard('{Enter}')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  },
}

export const KeyboardNavigation: Story = {
  args: {
    toolName: 'get_weather',
    input: { city: 'NYC' },
    status: 'done',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'get_weather details' })

    await step('Tab moves focus to the expand button', async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
    })

    await step('Space expands the card', async () => {
      await userEvent.keyboard(' ')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(canvas.getByText('Input')).toBeInTheDocument()
    })

    await step('Enter collapses the card', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(canvas.queryByText('Input')).not.toBeInTheDocument()
    })
  },
}
