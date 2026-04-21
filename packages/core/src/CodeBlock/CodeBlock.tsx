import React from 'react'
import { Box, Code } from '@chakra-ui/react'

export interface CodeBlockProps {
  children: React.ReactNode
  language?: string
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  return (
    <Box
      bg="bg.elevated"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="md"
      p={4}
      overflow="auto"
    >
      {language && (
        <Box
          as="span"
          fontSize="xs"
          color="text.muted"
          fontFamily="mono"
          display="block"
          mb={2}
        >
          {language}
        </Box>
      )}
      <Code
        display="block"
        fontFamily="mono"
        fontSize="sm"
        color="text.primary"
        whiteSpace="pre"
        bg="transparent"
      >
        {children}
      </Code>
    </Box>
  )
}
