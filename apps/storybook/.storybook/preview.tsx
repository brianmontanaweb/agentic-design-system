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
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <AgenticProvider>
        <div style={{ padding: '2rem', minWidth: '400px' }}>
          <Story />
        </div>
      </AgenticProvider>
    ),
  ],
}

export default preview
