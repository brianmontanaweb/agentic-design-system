import React from 'react'
import { Badge, Box, HStack } from '@chakra-ui/react'
import { useReducedMotion } from '@agentic-ds/core'

export type AgentStatusValue = 'idle' | 'running' | 'waiting' | 'done' | 'error' | 'cancelled'

export interface AgentStatusProps {
  status: AgentStatusValue
  label?: string
}

const statusConfig: Record<AgentStatusValue, { color: string; label: string }> = {
  idle: { color: 'text.muted', label: 'Idle' },
  running: { color: 'accent.blue', label: 'Running' },
  waiting: { color: 'accent.amber', label: 'Waiting' },
  done: { color: 'accent.green', label: 'Done' },
  error: { color: 'accent.red', label: 'Error' },
  cancelled: { color: 'text.muted', label: 'Cancelled' },
}

export function AgentStatus({ status, label }: AgentStatusProps) {
  const reducedMotion = useReducedMotion()
  const config = statusConfig[status]
  const displayLabel = label ?? config.label
  return (
    <HStack
      gap={2}
      display="inline-flex"
      alignItems="center"
      position="relative"
      role="status"
      aria-live="polite"
    >
      {/* Visually-hidden full phrase for screen readers */}
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
        Agent status: {displayLabel}
      </Box>
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg={config.color}
        flexShrink={0}
        animation={status === 'running' && !reducedMotion ? 'ds-pulse 1.5s ease-in-out infinite' : undefined}
      />
      <Badge variant="plain" fontSize="xs" fontFamily="mono" color={config.color} px={0} aria-hidden="true">
        {displayLabel}
      </Badge>
    </HStack>
  )
}
