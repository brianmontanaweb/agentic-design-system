import type { ReactNode } from 'react'
import { Box, Code } from '@chakra-ui/react'

export interface CodeBlockProps {
  children: ReactNode
  language?: string
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  return (
    <Box
      bg="color.surface.elevated"
      border="1px solid"
      borderColor="color.border.subtle"
      borderRadius="md"
      p={4}
      overflow="auto"
    >
      {language && (
        <Box as="span" fontSize="xs" color="color.text.muted" fontFamily="mono" display="block" mb={2}>
          {language}
        </Box>
      )}
      <Code
        display="block"
        fontFamily="mono"
        fontSize="sm"
        color="color.text.primary"
        whiteSpace="pre"
        bg="transparent"
      >
        {children}
      </Code>
    </Box>
  )
}
