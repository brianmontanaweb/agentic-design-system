import React from 'react'
import { Box, Text } from '@chakra-ui/react'

export interface StreamingTextProps {
  text: string
  isStreaming?: boolean
  fontSize?: string
  color?: string
  'aria-label'?: string
}

export function StreamingText({
  text,
  isStreaming = false,
  fontSize = 'sm',
  color = 'text.primary',
  'aria-label': ariaLabel = 'Streaming output',
}: StreamingTextProps) {
  return (
    <Box role="log" aria-live="polite" aria-atomic="false" aria-label={ariaLabel}>
      <Text as="span" fontSize={fontSize} color={color} whiteSpace="pre-wrap">
        {text}
      </Text>
      {isStreaming && (
        <Box
          as="span"
          display="inline-block"
          w="2px"
          h="1em"
          bg="accent.blue"
          ml="1px"
          verticalAlign="text-bottom"
          animation="ds-blink 1s step-end infinite"
        />
      )}
    </Box>
  )
}
