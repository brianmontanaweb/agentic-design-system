import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { useReducedMotion } from '@agentic-ds/core'
import { duration } from '@agentic-ds/tokens'

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
  const reducedMotion = useReducedMotion()
  return (
    <Box role="log" aria-live="polite" aria-atomic="false" aria-label={ariaLabel}>
      <Text as="span" fontSize={fontSize} color={color} whiteSpace="pre-wrap">
        {text}
      </Text>
      {isStreaming && (
        <Box
          as="span"
          aria-hidden="true"
          display="inline-block"
          w="2px"
          h="1em"
          bg="color.stream.cursor"
          ml="1px"
          verticalAlign="text-bottom"
          animation={reducedMotion ? undefined : `ds-blink ${duration.stream.blink.$value} step-end infinite`}
        />
      )}
    </Box>
  )
}
