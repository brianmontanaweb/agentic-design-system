import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'

export interface ThinkingIndicatorProps {
  label?: string
}

export function ThinkingIndicator({ label = 'Thinking' }: ThinkingIndicatorProps) {
  return (
    <HStack gap={2} alignItems="center">
      <HStack gap="3px" alignItems="center">
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            w="6px"
            h="6px"
            borderRadius="full"
            bg="accent.blue"
            animation={`ds-pulse 1.2s ease-in-out ${i * 0.2}s infinite`}
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
