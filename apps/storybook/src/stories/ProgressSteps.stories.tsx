import type { Meta, StoryObj } from '@storybook/react'
import { ProgressSteps } from '@agentic-ds/agents'

const meta: Meta<typeof ProgressSteps> = {
  title: 'Agents/ProgressSteps',
  component: ProgressSteps,
}
export default meta

type Story = StoryObj<typeof ProgressSteps>

const steps = [
  { id: '1', label: 'Parse request', status: 'complete' as const },
  { id: '2', label: 'Query knowledge base', status: 'complete' as const },
  {
    id: '3',
    label: 'Generate response',
    status: 'active' as const,
    description: 'Using claude-sonnet-4-6...',
  },
  { id: '4', label: 'Post-process output', status: 'pending' as const },
]

export const Default: Story = { args: { steps } }

export const AllComplete: Story = {
  args: {
    steps: steps.map((s) => ({ ...s, status: 'complete' as const })),
  },
}

export const AllPending: Story = {
  args: {
    steps: steps.map((s) => ({ ...s, status: 'pending' as const })),
  },
}

export const WithWaiting: Story = {
  args: {
    steps: [
      { id: '1', label: 'Parse request', status: 'complete' as const },
      { id: '2', label: 'Query knowledge base', status: 'complete' as const },
      {
        id: '3',
        label: 'Awaiting user confirmation',
        status: 'waiting' as const,
        description: 'Please review and confirm before continuing.',
      },
      { id: '4', label: 'Post-process output', status: 'pending' as const },
    ],
  },
}

export const WithCancelled: Story = {
  args: {
    steps: [
      { id: '1', label: 'Parse request', status: 'complete' as const },
      { id: '2', label: 'Query knowledge base', status: 'complete' as const },
      { id: '3', label: 'Generate response', status: 'cancelled' as const },
      { id: '4', label: 'Post-process output', status: 'cancelled' as const },
    ],
  },
}
