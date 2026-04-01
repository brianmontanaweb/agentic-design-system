import type { Meta, StoryObj } from '@storybook/react'
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
}
