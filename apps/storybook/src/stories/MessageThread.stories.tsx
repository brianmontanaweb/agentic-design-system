import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MessageThread, MessageBubble, StreamingText } from '@agentic-ds/agents'

const meta: Meta<typeof MessageThread> = {
  title: 'Agents/MessageThread',
  component: MessageThread,
}
export default meta

type Story = StoryObj<typeof MessageThread>

export const Default: Story = {
  render: (args) => (
    <MessageThread {...args}>
      <MessageBubble sender="user" content="What are the latest trends in AI?" timestamp="2:30 PM" />
      <MessageBubble
        sender="assistant"
        content={<StreamingText text="Here are the key trends in AI for 2024..." />}
        timestamp="2:31 PM"
      />
      <MessageBubble
        sender="user"
        content="Can you elaborate on diffusion models?"
        timestamp="2:32 PM"
      />
      <MessageBubble
        sender="assistant"
        content={
          <StreamingText
            text="Diffusion models have become the dominant paradigm for image generation..."
            isStreaming
          />
        }
      />
    </MessageThread>
  ),
  args: { maxHeight: '400px' },
}
