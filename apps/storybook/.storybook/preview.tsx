import React from 'react'
import type { Preview } from 'storybook/internal/types'
import { AgenticProvider } from '@agentic-ds/core'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0f' },
        { name: 'surface', value: '#13131a' },
        { name: 'light', value: '#f8f9fa' },
      ],
    },
    layout: 'centered',
  },
  globalTypes: {
    colorScheme: {
      description: 'Color scheme for AgenticProvider',
      defaultValue: 'dark',
      toolbar: {
        title: 'Color scheme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const scheme = (context.globals['colorScheme'] ?? 'dark') as 'dark' | 'light'
      const bg = scheme === 'light' ? '#f8f9fa' : '#0a0a0f'
      return (
        <AgenticProvider defaultColorScheme={scheme}>
          <div style={{ padding: '2rem', minWidth: '400px', backgroundColor: bg }}>
            <Story />
          </div>
        </AgenticProvider>
      )
    },
  ],
}

export default preview
