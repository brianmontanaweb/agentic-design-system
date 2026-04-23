import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'

export type MessageRole = 'user' | 'assistant' | 'tool'

export interface MessageBubbleProps {
  sender: MessageRole
  content: React.ReactNode
  label?: string
  timestamp?: string
}

const roleConfig: Record<MessageRole, { label: string; labelColor: string; bg: string }> = {
  user: { label: 'You', labelColor: 'color.text.muted', bg: 'color.message.user.bg' },
  assistant: {
    label: 'Assistant',
    labelColor: 'color.accent.interactive',
    bg: 'color.message.assistant.bg',
  },
  tool: { label: 'Tool', labelColor: 'color.accent.success', bg: 'color.message.tool.bg' },
}

export function MessageBubble({ sender, content, label, timestamp }: MessageBubbleProps) {
  const config = roleConfig[sender]
  return (
    <Box
      bg={config.bg}
      border="1px solid"
      borderColor="color.border.subtle"
      borderRadius="md"
      px={3}
      py={2}
    >
      <HStack gap={2} mb={1} justifyContent="space-between">
        <Text fontSize="xs" fontFamily="mono" color={config.labelColor} fontWeight="medium">
          {label ?? config.label}
        </Text>
        {timestamp && (
          <Text fontSize="xs" color="color.text.muted">
            {timestamp}
          </Text>
        )}
      </HStack>
      <Box fontSize="sm" color="color.text.primary">
        {content}
      </Box>
    </Box>
  )
}
