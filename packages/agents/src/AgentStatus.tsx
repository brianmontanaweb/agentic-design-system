import React from 'react'
import { Badge, Box, HStack } from '@chakra-ui/react'

export type AgentStatusValue = 'idle' | 'running' | 'done' | 'error'

export interface AgentStatusProps {
  status: AgentStatusValue
  label?: string
}

const statusConfig: Record<AgentStatusValue, { color: string; label: string }> = {
  idle: { color: '#8888aa', label: 'Idle' },
  running: { color: '#4d9fff', label: 'Running' },
  done: { color: '#3dd68c', label: 'Done' },
  error: { color: '#f87171', label: 'Error' },
}

export function AgentStatus({ status, label }: AgentStatusProps) {
  const config = statusConfig[status]
  return (
    <HStack gap={2} display="inline-flex" alignItems="center">
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg={config.color}
        flexShrink={0}
        animation={status === 'running' ? 'ds-pulse 1.5s ease-in-out infinite' : undefined}
      />
      <Badge variant="plain" fontSize="xs" fontFamily="mono" color={config.color} px={0}>
        {label ?? config.label}
      </Badge>
    </HStack>
  )
}
