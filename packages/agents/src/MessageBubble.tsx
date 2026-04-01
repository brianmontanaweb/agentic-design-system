import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'

export type MessageRole = 'user' | 'assistant' | 'tool'

export interface MessageBubbleProps {
  role: MessageRole
  content: React.ReactNode
  label?: string
  timestamp?: string
}

const roleConfig: Record<MessageRole, { label: string; labelColor: string }> = {
  user: { label: 'You', labelColor: '#8888aa' },
  assistant: { label: 'Assistant', labelColor: '#4d9fff' },
  tool: { label: 'Tool', labelColor: '#3dd68c' },
}

export function MessageBubble({ role, content, label, timestamp }: MessageBubbleProps) {
  const config = roleConfig[role]
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="md"
      px={3}
      py={2}
    >
      <HStack gap={2} mb={1} justifyContent="space-between">
        <Text fontSize="xs" fontFamily="mono" color={config.labelColor} fontWeight="medium">
          {label ?? config.label}
        </Text>
        {timestamp && (
          <Text fontSize="xs" color="text.muted">
            {timestamp}
          </Text>
        )}
      </HStack>
      <Box fontSize="sm" color="text.primary">
        {content}
      </Box>
    </Box>
  )
}
