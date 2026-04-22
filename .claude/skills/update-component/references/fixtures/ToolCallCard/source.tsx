import React, { useId, useState } from 'react'
import { Box, Code, Text, VStack } from '@chakra-ui/react'

export type ToolCallStatus = 'pending' | 'running' | 'done' | 'error'

export interface ToolCallCardProps {
  toolName: string
  input?: Record<string, unknown>
  output?: string
  status?: ToolCallStatus
  defaultOpen?: boolean
}

// VIOLATION: hardcoded hex — should use semantic tokens from @agentic-ds/tokens
const statusColors: Record<ToolCallStatus, string> = {
  pending: '#8888aa',
  running: '#4d9fff',
  done: '#3dd68c',
  error: '#f87171',
}

export function ToolCallCard({
  toolName,
  input,
  output,
  status = 'done',
  defaultOpen = false,
}: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="md"
      overflow="hidden"
    >
      {/* VIOLATION: div with onClick — must be <button> with aria-expanded + aria-controls */}
      <Box
        display="flex"
        px={3}
        py={2}
        gap={2}
        alignItems="center"
        cursor="pointer"
        transition="background 100ms"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: 'bg.elevated' }}
      >
        <Box
          w="6px"
          h="6px"
          borderRadius="full"
          bg={statusColors[status]}
          flexShrink={0}
          animation={status === 'running' ? 'ds-pulse 1.5s ease-in-out infinite' : undefined}
        />
        <Text fontSize="sm" fontFamily="mono" color="text.primary" flex={1} textAlign="left">
          {toolName}
        </Text>
        <Text fontSize="xs" color="text.muted" userSelect="none" aria-hidden="true">
          {open ? '▾' : '▸'}
        </Text>
      </Box>

      {open && (
        <VStack
          id={contentId}
          gap={0}
          align="stretch"
          borderTop="1px solid"
          borderColor="border.subtle"
        >
          {input !== undefined && (
            <Box
              px={3}
              py={2}
              borderBottom={output !== undefined ? '1px solid' : undefined}
              borderColor="border.subtle"
            >
              <Text
                fontSize="xs"
                color="text.muted"
                mb={1}
                fontFamily="mono"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Input
              </Text>
              <Code
                display="block"
                fontSize="xs"
                fontFamily="mono"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
                bg="transparent"
                color="text.primary"
              >
                {JSON.stringify(input, null, 2)}
              </Code>
            </Box>
          )}
          {output !== undefined && (
            <Box px={3} py={2}>
              <Text
                fontSize="xs"
                color="text.muted"
                mb={1}
                fontFamily="mono"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Output
              </Text>
              <Code
                display="block"
                fontSize="xs"
                fontFamily="mono"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
                bg="transparent"
                color="accent.green"
              >
                {output}
              </Code>
            </Box>
          )}
        </VStack>
      )}
    </Box>
  )
}
