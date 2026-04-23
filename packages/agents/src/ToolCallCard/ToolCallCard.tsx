import React, { useId, useState } from 'react'
import { Box, Button, Code, Text, VStack } from '@chakra-ui/react'
import { useReducedMotion } from '@agentic-ds/core'

export type ToolCallStatus = 'pending' | 'running' | 'done' | 'error'

export interface ToolCallCardProps {
  toolName: string
  input?: Record<string, unknown>
  output?: string
  status?: ToolCallStatus
  defaultOpen?: boolean
}

const statusColors: Record<ToolCallStatus, string> = {
  pending: 'color.tool.status.pending',
  running: 'color.tool.status.running',
  done: 'color.tool.status.done',
  error: 'color.tool.status.error',
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
  const reducedMotion = useReducedMotion()

  return (
    <Box
      bg="color.surface.default"
      border="1px solid"
      borderColor="color.border.subtle"
      borderRadius="md"
      overflow="hidden"
    >
      <Button
        variant="ghost"
        w="100%"
        h="auto"
        display="flex"
        px={3}
        py={2}
        gap={2}
        justifyContent="flex-start"
        alignItems="center"
        borderRadius={0}
        fontWeight="normal"
        transition="background 100ms"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: 'color.surface.elevated' }}
        _active={{ bg: 'color.surface.elevated' }}
        aria-expanded={open}
        aria-controls={contentId}
        aria-label={`${toolName} details`}
      >
        <Box
          w="6px"
          h="6px"
          borderRadius="full"
          bg={statusColors[status]}
          flexShrink={0}
          animation={
            status === 'running' && !reducedMotion
              ? 'ds-pulse 1.5s ease-in-out infinite'
              : undefined
          }
        />
        <Text fontSize="sm" fontFamily="mono" color="color.text.primary" flex={1} textAlign="left">
          {toolName}
        </Text>
        <Text fontSize="xs" color="color.text.muted" userSelect="none" aria-hidden="true">
          {open ? '▾' : '▸'}
        </Text>
      </Button>

      {open && (
        <VStack
          id={contentId}
          gap={0}
          align="stretch"
          borderTop="1px solid"
          borderColor="color.border.subtle"
        >
          {input !== undefined && (
            <Box
              px={3}
              py={2}
              borderBottom={output !== undefined ? '1px solid' : undefined}
              borderColor="color.border.subtle"
            >
              <Text
                fontSize="xs"
                color="color.text.muted"
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
                color="color.text.primary"
              >
                {JSON.stringify(input, null, 2)}
              </Code>
            </Box>
          )}
          {output !== undefined && (
            <Box px={3} py={2}>
              <Text
                fontSize="xs"
                color="color.text.muted"
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
                color={status === 'error' ? 'color.accent.danger' : 'color.accent.success'}
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
