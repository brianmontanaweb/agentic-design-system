import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  AgenticProvider,
  Button,
  CodeBlock,
  defineAgenticTheme,
  HStack,
  Text,
  VStack,
} from '@agentic-ds/core'
import { AgentStatus } from '@agentic-ds/agents'

// Themes are created once at module scope (the defineAgenticTheme contract).
// Each carries a name so its CSS variables are scoped to its own provider —
// required wherever differently-branded stories could share a page (docs view).
const orangeTheme = defineAgenticTheme({
  name: 'brand-orange',
  accent: '#e8590c',
})

const warmTheme = defineAgenticTheme({
  name: 'brand-warm',
  accent: '#9c36b5',
  neutralWarmth: 1,
})

const coolTheme = defineAgenticTheme({
  name: 'brand-cool',
  neutralWarmth: -1,
})

const meta: Meta<typeof AgenticProvider> = {
  title: 'Core/AgenticProvider',
  component: AgenticProvider,
}
export default meta

type Story = StoryObj<typeof AgenticProvider>

// Representative sweep: accent-driven pieces (solid button, focus ring),
// derived on-accent text, plus tokens a theme must NOT touch (status colors).
function ThemeSampler(): React.ReactElement {
  return (
    <VStack gap={4} align="flex-start">
      <HStack gap={2}>
        <Button variant="solid">Primary action</Button>
        <Button variant="outline">Secondary</Button>
        <Button variant="ghost">Tertiary</Button>
        <Button variant="danger">Delete</Button>
      </HStack>
      <HStack gap={4}>
        <AgentStatus status="running" />
        <AgentStatus status="done" />
        <AgentStatus status="error" />
      </HStack>
      <CodeBlock language="ts">{`const theme = defineAgenticTheme({ accent: '#e8590c' })`}</CodeBlock>
      <Text color="color.text.muted">Muted text on the themed neutral surface.</Text>
    </VStack>
  )
}

export const Default: Story = {
  render: () => <ThemeSampler />,
}

export const BrandedAccent: Story = {
  parameters: { agenticTheme: orangeTheme },
  render: () => <ThemeSampler />,
}

export const WarmNeutrals: Story = {
  parameters: { agenticTheme: warmTheme },
  render: () => <ThemeSampler />,
}

export const CoolNeutrals: Story = {
  parameters: { agenticTheme: coolTheme },
  render: () => <ThemeSampler />,
}
