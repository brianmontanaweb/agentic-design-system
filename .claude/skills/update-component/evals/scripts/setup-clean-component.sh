#!/usr/bin/env bash
set -euo pipefail

# Source — fully compliant: semantic tokens, named export, role=status + aria-live,
# visually-hidden text, no default React import, no hardcoded hex.
cat > packages/agents/src/EvalCleanComponent.tsx << 'ENDSOURCE'
import { Box, Text } from '@chakra-ui/react'

export type EvalCleanStatus = 'idle' | 'running' | 'done' | 'error'

export interface EvalCleanComponentProps {
  status: EvalCleanStatus
  label?: string
}

const statusColors: Record<EvalCleanStatus, string> = {
  idle:    'color.agent.status.idle',
  running: 'color.agent.status.running',
  done:    'color.agent.status.done',
  error:   'color.agent.status.error',
}

export function EvalCleanComponent({ status, label }: EvalCleanComponentProps) {
  const displayLabel = label ?? status
  return (
    <Box role="status" aria-live="polite" display="inline-flex" alignItems="center" gap={2}>
      <Box
        as="span"
        position="absolute"
        width="1px"
        height="1px"
        padding={0}
        margin="-1px"
        overflow="hidden"
        clipPath="inset(50%)"
        whiteSpace="nowrap"
        borderWidth={0}
      >
        {displayLabel}
      </Box>
      <Box w="8px" h="8px" borderRadius="full" bg={statusColors[status]} flexShrink={0} />
      <Text fontSize="xs" fontFamily="mono" color={statusColors[status]} aria-hidden="true">
        {displayLabel}
      </Text>
    </Box>
  )
}
ENDSOURCE

# Story — all 4 states, correct title, no default React import.
cat > apps/storybook/src/stories/EvalCleanComponent.stories.tsx << 'ENDSTORY'
import type { Meta, StoryObj } from '@storybook/react'
import { EvalCleanComponent } from '@agentic-ds/agents'

const meta: Meta<typeof EvalCleanComponent> = {
  title: 'Agents/EvalCleanComponent',
  component: EvalCleanComponent,
  argTypes: {
    status: { control: 'select', options: ['idle', 'running', 'done', 'error'] },
  },
}
export default meta

type Story = StoryObj<typeof EvalCleanComponent>

export const Idle:    Story = { args: { status: 'idle' } }
export const Running: Story = { args: { status: 'running' } }
export const Done:    Story = { args: { status: 'done' } }
export const Error:   Story = { args: { status: 'error' } }
ENDSTORY

# Spec doc — all sections complete, no missing props or tokens.
cat > docs/components/EvalCleanComponent.md << 'ENDSPEC'
---
title: EvalCleanComponent
package: "@agentic-ds/agents"
status: stable
mcp-states: [idle, running, done, error]
tokens:
  colors:
    - color.agent.status.idle
    - color.agent.status.running
    - color.agent.status.done
    - color.agent.status.error
---

# EvalCleanComponent

Minimal eval fixture component with no known violations. Used by the `already-compliant` eval to verify that `/update-component` produces a no-op plan on a clean component.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `'idle' \| 'running' \| 'done' \| 'error'` | — | Current status |
| `label` | `string` | — | Override display label; defaults to the status value |

## States

| State | Token |
|---|---|
| `idle` | `color.agent.status.idle` |
| `running` | `color.agent.status.running` |
| `done` | `color.agent.status.done` |
| `error` | `color.agent.status.error` |

## Accessibility

`role="status"` and `aria-live="polite"` on the container announce state changes to screen readers. A visually-hidden `<span>` provides the full label text. The visible badge is `aria-hidden="true"` to prevent duplication.
ENDSPEC

# Add to package index
printf '\nexport { EvalCleanComponent } from '"'"'./EvalCleanComponent'"'"'\nexport type { EvalCleanComponentProps, EvalCleanStatus } from '"'"'./EvalCleanComponent'"'"'\n' \
  >> packages/agents/src/index.ts
