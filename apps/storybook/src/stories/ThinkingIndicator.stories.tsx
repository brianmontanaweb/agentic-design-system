import type { Meta, StoryObj } from '@storybook/react'
import { ThinkingIndicator } from '@agentic-ds/agents'

const meta: Meta<typeof ThinkingIndicator> = {
  title: 'Agents/ThinkingIndicator',
  component: ThinkingIndicator,
}
export default meta

type Story = StoryObj<typeof ThinkingIndicator>

export const Default: Story = {}
export const CustomLabel: Story = { args: { label: 'Processing tools...' } }
export const NoLabel: Story = { args: { label: '' } }
