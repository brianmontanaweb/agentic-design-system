import React from 'react'
import { Box, Text } from '@chakra-ui/react'

export interface StreamingTextProps {
  text: string
  isStreaming?: boolean
  fontSize?: string
  color?: string
}

export function StreamingText({
  text,
  isStreaming = false,
  fontSize = 'sm',
  color = 'text.primary',
}: StreamingTextProps) {
  return (
    <Box as="span" display="inline">
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
