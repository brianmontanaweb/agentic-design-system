// VIOLATION: React default import unused with jsx-runtime transform
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { HStack, VStack, Text } from '@agentic-ds/core'
import { Button } from '@agentic-ds/core'

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingText: { control: 'text' },
    fullWidth: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Button>

// --- Single states ---

export const Solid: Story = { args: { variant: 'solid', children: 'Save changes' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Cancel' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Learn more' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Delete project' } }

export const Small: Story = { args: { size: 'sm', children: 'Small' } }
export const Medium: Story = { args: { size: 'md', children: 'Medium' } }
export const Large: Story = { args: { size: 'lg', children: 'Large' } }

export const Disabled: Story = {
  args: { variant: 'solid', disabled: true, children: 'Save changes' },
}

export const Loading: Story = {
  args: { variant: 'solid', loading: true, loadingText: 'Saving…', children: 'Save changes' },
}

export const FullWidth: Story = {
  args: { variant: 'solid', fullWidth: true, children: 'Submit' },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
}

// --- All variants at once ---

export const AllVariants: Story = {
  render: () => (
    <HStack gap={3} flexWrap="wrap">
      <Button variant="solid">Save changes</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Learn more</Button>
      <Button variant="danger">Delete project</Button>
    </HStack>
  ),
}

// --- All sizes at once ---

export const AllSizes: Story = {
  render: () => (
    <HStack gap={3} alignItems="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </HStack>
  ),
}

// --- Loading across variants ---

export const LoadingStates: Story = {
  render: () => (
    <HStack gap={3}>
      <Button variant="solid" loading loadingText="Saving…">
        Save changes
      </Button>
      <Button variant="outline" loading loadingText="Loading…">
        Load data
      </Button>
      <Button variant="ghost" loading>
        Processing
      </Button>
      <Button variant="danger" loading loadingText="Deleting…">
        Delete project
      </Button>
    </HStack>
  ),
}

// --- Width preservation during loading ---
// The button width must not change between default and loading states.

export const LoadingWidthPreservation: Story = {
  render: () => (
    <VStack gap={3} align="flex-start">
      <Text fontSize="xs" color="text.muted" fontFamily="mono">
        Both buttons should be the same width:
      </Text>
      <Button variant="solid">Save changes</Button>
      <Button variant="solid" loading loadingText="Saving…">
        Save changes
      </Button>
    </VStack>
  ),
}
