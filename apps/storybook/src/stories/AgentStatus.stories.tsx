import type { Meta, StoryObj } from '@storybook/react'
import { AgentStatus } from '@agentic-ds/agents'

const meta: Meta<typeof AgentStatus> = {
  title: 'Agents/AgentStatus',
  component: AgentStatus,
  argTypes: {
    status: {
      control: 'select',
      options: ['idle', 'running', 'done', 'error'],
    },
  },
}
export default meta

type Story = StoryObj<typeof AgentStatus>

export const Idle: Story = { args: { status: 'idle' } }
export const Running: Story = { args: { status: 'running' } }
export const Done: Story = { args: { status: 'done' } }
export const Error: Story = { args: { status: 'error' } }
export const CustomLabel: Story = { args: { status: 'running', label: 'Processing...' } }
