import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'
import { useReducedMotion } from '@agentic-ds/core'
import { duration } from '@agentic-ds/tokens'

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
            bg="color.accent.interactive"
            animation={
              reducedMotion
                ? undefined
                : `ds-pulse ${duration.stream.thinking.$value} ease-in-out ${i * 0.2}s infinite`
            }
          />
        ))}
      </HStack>
      {label && (
        <Text fontSize="sm" color="color.text.muted" fontFamily="mono">
          {label}
        </Text>
      )}
    </HStack>
  )
}
