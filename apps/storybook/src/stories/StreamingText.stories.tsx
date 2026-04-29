import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, waitFor, within } from 'storybook/test'
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

const STREAM_TOKENS = ['Analyzing', ' the', ' codebase', '...', ' Found', ' 3', ' issues', '.']

export const StreamingSequence: Story = {
  render: function StreamingSequenceStory() {
    const [text, setText] = useState('')
    const [isStreaming, setIsStreaming] = useState(true)

    useEffect(() => {
      let idx = 0
      const id = setInterval(() => {
        const token = STREAM_TOKENS[idx]
        idx++
        if (idx >= STREAM_TOKENS.length) {
          clearInterval(id)
          setIsStreaming(false)
        }
        setText((prev) => prev + token)
      }, 80)
      return () => clearInterval(id)
    }, [])

    return <StreamingText text={text} isStreaming={isStreaming} />
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const log = canvas.getByRole('log')

    await step('cursor is visible while streaming', async () => {
      await waitFor(() => expect(log.querySelector('[aria-hidden="true"]')).toBeInTheDocument())
    })

    await step('text accumulates token by token', async () => {
      await waitFor(() => expect(log).toHaveTextContent('Analyzing the codebase'), {
        timeout: 1500,
      })
      await waitFor(
        () => expect(log).toHaveTextContent('Analyzing the codebase... Found 3 issues.'),
        { timeout: 2000 }
      )
    })

    await step('cursor disappears when streaming completes', async () => {
      await waitFor(
        () => expect(log.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument(),
        { timeout: 1500 }
      )
    })
  },
}
