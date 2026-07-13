import React from 'react'
import type { Preview } from 'storybook/internal/types'
import { AgenticProvider, type AgenticTheme } from '@agentic-ds/core'

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
      // Branded-theme stories set parameters.agenticTheme (a defineAgenticTheme
      // result) instead of nesting a second AgenticProvider, which the provider
      // contract forbids.
      const theme = context.parameters['agenticTheme'] as AgenticTheme | undefined
      // The preview page is a host app, so page-level color-scheme is its
      // call (the provider only scopes color-scheme to its own wrapper).
      // Keeping the canvas in sync matters for the visual baselines: the
      // captured story margins show the UA canvas color.
      React.useEffect(() => {
        document.documentElement.style.colorScheme = scheme
      }, [scheme])
      return (
        <AgenticProvider colorScheme={scheme} theme={theme}>
          <div style={{ padding: '2rem', minWidth: '400px', backgroundColor: bg }}>
            <Story />
          </div>
        </AgenticProvider>
      )
    },
  ],
}

export default preview
