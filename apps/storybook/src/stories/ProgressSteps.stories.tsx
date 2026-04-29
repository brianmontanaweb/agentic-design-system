import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
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

export const Default: Story = {
  args: { steps },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('listitem')

    await expect(items[2]).toHaveAttribute('aria-current', 'step')
    await expect(items[0]).not.toHaveAttribute('aria-current')
    await expect(items[1]).not.toHaveAttribute('aria-current')
    await expect(items[3]).not.toHaveAttribute('aria-current')
  },
}

export const AllComplete: Story = {
  args: {
    steps: steps.map((s) => ({ ...s, status: 'complete' as const })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('listitem')
    for (const item of items) {
      await expect(item).not.toHaveAttribute('aria-current')
    }
    const checkmarks = canvas.getAllByText('✓')
    await expect(checkmarks).toHaveLength(4)
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('listitem')
    for (const item of items) {
      await expect(item).not.toHaveAttribute('aria-current')
    }
    await expect(canvas.getByText('Awaiting user confirmation')).toBeInTheDocument()
    await expect(
      canvas.getByText('Please review and confirm before continuing.')
    ).toBeInTheDocument()
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByRole('listitem')
    for (const item of items) {
      await expect(item).not.toHaveAttribute('aria-current')
    }
    const dashes = canvas.getAllByText('—')
    await expect(dashes).toHaveLength(2)
  },
}

const TRANSITION_LABELS = ['Fetch data', 'Process results', 'Format output']

export const StepTransition: Story = {
  render: function StepTransitionStory() {
    const [activeIdx, setActiveIdx] = useState(0)

    const stepData = TRANSITION_LABELS.map((label, i) => ({
      id: String(i),
      label,
      status: (i < activeIdx ? 'complete' : i === activeIdx ? 'active' : 'pending') as
        | 'complete'
        | 'active'
        | 'pending',
    }))

    return (
      <div>
        <ProgressSteps steps={stepData} />
        <button
          onClick={() => setActiveIdx((prev) => Math.min(prev + 1, TRANSITION_LABELS.length))}
          data-testid="advance"
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Advance
        </button>
      </div>
    )
  },
  play: async ({ canvasElement, step }: Parameters<NonNullable<Story['play']>>[0]) => {
    const canvas = within(canvasElement)

    await step('first step starts as active', async () => {
      const items = canvas.getAllByRole('listitem')
      await expect(items[0]).toHaveAttribute('aria-current', 'step')
      await expect(items[1]).not.toHaveAttribute('aria-current')
      await expect(items[2]).not.toHaveAttribute('aria-current')
    })

    await step('advance to step 2 — aria-current moves', async () => {
      await userEvent.click(canvas.getByTestId('advance'))
      const items = canvas.getAllByRole('listitem')
      await expect(items[0]).not.toHaveAttribute('aria-current')
      await expect(items[1]).toHaveAttribute('aria-current', 'step')
      await expect(items[2]).not.toHaveAttribute('aria-current')
    })

    await step('advance to step 3 — aria-current moves again', async () => {
      await userEvent.click(canvas.getByTestId('advance'))
      const items = canvas.getAllByRole('listitem')
      await expect(items[0]).not.toHaveAttribute('aria-current')
      await expect(items[1]).not.toHaveAttribute('aria-current')
      await expect(items[2]).toHaveAttribute('aria-current', 'step')
    })

    await step('all steps complete — no aria-current, all checkmarks', async () => {
      await userEvent.click(canvas.getByTestId('advance'))
      const items = canvas.getAllByRole('listitem')
      for (const item of items) {
        await expect(item).not.toHaveAttribute('aria-current')
      }
      await expect(canvas.getAllByText('✓')).toHaveLength(3)
    })
  },
}
