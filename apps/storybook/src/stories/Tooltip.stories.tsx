import type { Meta, StoryObj } from '@storybook/react'
import { Button, HStack, VStack, Tooltip } from '@agentic-ds/core'

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Tooltip content' },
  argTypes: {
    label: { control: 'text' },
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    isDisabled: { control: 'boolean' },
    children: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
}

export const PlacementTop: Story = {
  render: () => (
    <Tooltip label="Top placement" placement="top">
      <Button>Top</Button>
    </Tooltip>
  ),
}

export const PlacementBottom: Story = {
  render: () => (
    <Tooltip label="Bottom placement" placement="bottom">
      <Button>Bottom</Button>
    </Tooltip>
  ),
}

export const PlacementLeft: Story = {
  render: () => (
    <Tooltip label="Left placement" placement="left">
      <Button>Left</Button>
    </Tooltip>
  ),
}

export const PlacementRight: Story = {
  render: () => (
    <Tooltip label="Right placement" placement="right">
      <Button>Right</Button>
    </Tooltip>
  ),
}

export const AllPlacements: Story = {
  render: () => (
    <VStack gap={8} align="center">
      <Tooltip label="Top" placement="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <HStack gap={16}>
        <Tooltip label="Left" placement="left">
          <Button variant="outline">Left</Button>
        </Tooltip>
        <Tooltip label="Right" placement="right">
          <Button variant="outline">Right</Button>
        </Tooltip>
      </HStack>
      <Tooltip label="Bottom" placement="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
    </VStack>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: '120px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Disabled: Story = {
  render: () => (
    <Tooltip label="This tooltip is disabled" isDisabled>
      <Button variant="outline">No tooltip</Button>
    </Tooltip>
  ),
}

export const WithLongLabel: Story = {
  render: () => (
    <Tooltip label="This is a longer tooltip with more contextual information">
      <Button variant="outline">Hover for details</Button>
    </Tooltip>
  ),
}

export const IconOnlyButton: Story = {
  render: () => (
    <Tooltip label="Close panel">
      <Button variant="ghost" aria-label="Close panel">✕</Button>
    </Tooltip>
  ),
}

export const GhostVariant: Story = {
  render: () => (
    <HStack gap={4}>
      <Tooltip label="Save file">
        <Button variant="ghost">Save</Button>
      </Tooltip>
      <Tooltip label="Undo last action">
        <Button variant="ghost">Undo</Button>
      </Tooltip>
      <Tooltip label="Redo last undone action">
        <Button variant="ghost">Redo</Button>
      </Tooltip>
    </HStack>
  ),
}
