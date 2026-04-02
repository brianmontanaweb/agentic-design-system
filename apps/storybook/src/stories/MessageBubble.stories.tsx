import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MessageBubble, ToolCallCard } from '@agentic-ds/agents'

const meta: Meta<typeof MessageBubble> = {
  title: 'Agents/MessageBubble',
  component: MessageBubble,
  argTypes: {
    sender: {
      control: 'select',
      options: ['user', 'assistant', 'tool'],
    },
  },
}
export default meta

type Story = StoryObj<typeof MessageBubble>

export const User: Story = {
  args: {
    sender: 'user',
    content: 'Can you analyze this dataset and find anomalies?',
    timestamp: '3:15 PM',
  },
}

export const Assistant: Story = {
  args: {
    sender: 'assistant',
    content: "I'll analyze the dataset using statistical methods to identify outliers.",
    timestamp: '3:16 PM',
  },
}

export const Tool: Story = {
  render: (args) => (
    <MessageBubble
      {...args}
      content={
        <ToolCallCard
          toolName="analyze_dataset"
          input={{ file: 'data.csv', method: 'zscore' }}
          output="Found 3 anomalies at rows 42, 107, 289."
          status="done"
          defaultOpen
        />
      }
    />
  ),
  args: {
    sender: 'tool',
    label: 'analyze_dataset',
  },
}
