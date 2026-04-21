import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'
import { useReducedMotion } from '@agentic-ds/core'

export interface ThinkingIndicatorProps {
  label?: string
}

export function ThinkingIndicator({ label = 'Thinking' }: ThinkingIndicatorProps) {
  const reducedMotion = useReducedMotion()
  return (
    <HStack gap={2} alignItems="center" role="status" aria-live="polite">
      <HStack gap="3px" alignItems="center" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            w="6px"
            h="6px"
            borderRadius="full"
            bg="accent.blue"
            animation={reducedMotion ? undefined : `ds-pulse 1.2s ease-in-out ${i * 0.2}s infinite`}
          />
        ))}
      </HStack>
      {label && (
        <Text fontSize="sm" color="text.muted" fontFamily="mono">
          {label}
        </Text>
      )}
    </HStack>
  )
}
