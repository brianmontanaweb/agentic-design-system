import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const log = canvas.getByRole('log')

    await expect(log).toHaveAttribute('aria-live', 'polite')
    await expect(log).toHaveAttribute('aria-atomic', 'false')
    await expect(log).toHaveTextContent('Based on the research')
  },
}

export const Complete: Story = {
  args: {
    text: 'The response has finished generating.',
    isStreaming: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const log = canvas.getByRole('log')

    await expect(log).toHaveAttribute('aria-live', 'polite')
    await expect(log).toHaveTextContent('The response has finished generating.')
  },
}

export const Multiline: Story = {
  args: {
    text: 'Line one of the response.\nLine two with more detail.\nLine three concluding thoughts.',
    isStreaming: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const log = canvas.getByRole('log')

    await expect(log).toHaveTextContent('Line one of the response.')
    await expect(log).toHaveTextContent('Line three concluding thoughts.')
  },
}
