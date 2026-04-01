import React, { useEffect, useRef } from 'react'
import { Box, VStack } from '@chakra-ui/react'

export interface MessageThreadProps {
  children: React.ReactNode
  maxHeight?: string
  autoScroll?: boolean
}

export function MessageThread({
  children,
  maxHeight = '600px',
  autoScroll = true,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  })

  return (
    <Box
      overflowY="auto"
      maxH={maxHeight}
      px={4}
      py={3}
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'var(--ds-border-subtle, #2a2a38)' },
      }}
    >
      <VStack gap={3} align="stretch">
        {children}
      </VStack>
      <div ref={bottomRef} />
    </Box>
  )
}
