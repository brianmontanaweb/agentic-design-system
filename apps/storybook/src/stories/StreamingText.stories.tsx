import type { Meta, StoryObj } from '@storybook/react'
import { StreamingText } from '@agentic-ds/agents'

const meta: Meta<typeof StreamingText> = {
  title: 'Agents/StreamingText',
  component: StreamingText,
}
export default meta

type Story = StoryObj<typeof StreamingText>

export const Streaming: Story = {
  args: {
    text: 'Based on the research, diffusion models have shown remarkable progress in 2024...',
    isStreaming: true,
  },
}

export const Complete: Story = {
  args: {
    text: 'The response has finished generating.',
    isStreaming: false,
  },
}

export const Multiline: Story = {
  args: {
    text: 'Line one of the response.\nLine two with more detail.\nLine three concluding thoughts.',
    isStreaming: true,
  },
}
