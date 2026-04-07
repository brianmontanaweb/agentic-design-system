import React from 'react'
import { Badge, Box, HStack } from '@chakra-ui/react'

// VIOLATION: missing 'waiting' and 'cancelled' — only 4 of 6 MCP lifecycle states
export type AgentStatusValue = 'idle' | 'running' | 'done' | 'error'

export interface AgentStatusProps {
  status: AgentStatusValue
  label?: string
}

// VIOLATION: hardcoded hex — should use semantic tokens from @agentic-ds/tokens
const statusConfig: Record<AgentStatusValue, { color: string; label: string }> = {
  idle:    { color: '#8888aa', label: 'Idle' },
  running: { color: '#4d9fff', label: 'Running' },
  done:    { color: '#3dd68c', label: 'Done' },
  error:   { color: '#f87171', label: 'Error' },
}

export function AgentStatus({ status, label }: AgentStatusProps) {
  const config = statusConfig[status]
  const displayLabel = label ?? config.label
  return (
    // VIOLATION: missing role="status" + aria-live="polite"
    // VIOLATION: no visually-hidden text — color is the only status indicator (SC 1.4.1)
    <HStack
      gap={2}
      display="inline-flex"
      alignItems="center"
    >
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg={config.color}
        flexShrink={0}
        animation={status === 'running' ? 'ds-pulse 1.5s ease-in-out infinite' : undefined}
      />
      <Badge variant="plain" fontSize="xs" fontFamily="mono" color={config.color} px={0}>
        {displayLabel}
      </Badge>
    </HStack>
  )
}
