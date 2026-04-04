import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) => {
    if (process.env.GITHUB_PAGES === 'true') {
      viteConfig.base = '/agentic-design-system/'
    }
    return viteConfig
  },
}

export default config
