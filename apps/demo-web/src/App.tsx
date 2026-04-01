import React from 'react'
import { Box, Flex, Heading, Text, VStack } from '@agentic-ds/core'
import {
  AgentStatus,
  MessageBubble,
  MessageThread,
  ProgressSteps,
  StreamingText,
  ThinkingIndicator,
  ToolCallCard,
} from '@agentic-ds/agents'

const steps = [
  { id: '1', label: 'Parse request', status: 'complete' as const },
  { id: '2', label: 'Query knowledge base', status: 'complete' as const },
  {
    id: '3',
    label: 'Generate response',
    status: 'active' as const,
    description: 'Using claude-sonnet-4-6...',
  },
  { id: '4', label: 'Post-process output', status: 'pending' as const },
]

export default function App() {
  return (
    <Box minH="100vh" bg="bg.base">
      <Box maxW="1200px" mx="auto" p={6}>
        <Heading fontSize="xl" color="text.primary" mb={1} fontFamily="mono">
          Agentic Design System
        </Heading>
        <Text fontSize="sm" color="text.muted" mb={8}>
          Component showcase — demo-web
        </Text>

        <Flex gap={6} align="flex-start">
          {/* Left: Message Thread */}
          <Box
            flex={2}
            bg="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="lg"
          >
            <Box px={4} py={3} borderBottom="1px solid" borderColor="border.subtle">
              <Flex gap={2} alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="text.muted" fontFamily="mono">
                  conversation
                </Text>
                <AgentStatus status="running" />
              </Flex>
            </Box>

            <MessageThread maxHeight="400px">
              <MessageBubble
                role="user"
                content="Summarize the key findings from the latest research papers on diffusion models."
                timestamp="2:34 PM"
              />
              <MessageBubble
                role="tool"
                label="search_papers"
                content={
                  <ToolCallCard
                    toolName="search_papers"
                    input={{ query: 'diffusion models 2024', limit: 10 }}
                    output={'Found 10 papers. Top result: "Consistency Models" (2024)...'}
                    status="done"
                    defaultOpen
                  />
                }
              />
              <MessageBubble
                role="assistant"
                content={
                  <StreamingText
                    text="Based on the search results, here are the key findings from recent diffusion model research..."
                    isStreaming
                  />
                }
              />
            </MessageThread>

            <Box px={4} py={3} borderTop="1px solid" borderColor="border.subtle">
              <ThinkingIndicator label="Generating response" />
            </Box>
          </Box>

          {/* Right: Progress + Tool calls */}
          <VStack flex={1} gap={4} align="stretch">
            <Box
              bg="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="lg"
              p={4}
            >
              <Text
                fontSize="xs"
                color="text.muted"
                fontFamily="mono"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Steps
              </Text>
              <ProgressSteps steps={steps} />
            </Box>

            <Box
              bg="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="lg"
              p={4}
            >
              <Text
                fontSize="xs"
                color="text.muted"
                fontFamily="mono"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Recent Calls
              </Text>
              <VStack gap={2} align="stretch">
                <ToolCallCard
                  toolName="search_papers"
                  input={{ query: 'diffusion models 2024', limit: 10 }}
                  output="Found 10 papers."
                  status="done"
                />
                <ToolCallCard
                  toolName="fetch_abstract"
                  input={{ paper_id: 'arxiv:2402.00123' }}
                  status="running"
                />
              </VStack>
            </Box>
          </VStack>
        </Flex>
      </Box>
    </Box>
  )
}
