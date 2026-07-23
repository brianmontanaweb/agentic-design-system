import React, { type ReactElement } from 'react'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'

export type StepStatus = 'pending' | 'active' | 'complete' | 'waiting' | 'cancelled'

export interface Step {
  id: string
  label: string
  status: StepStatus
  description?: string
}

export interface ProgressStepsProps {
  steps: Step[]
}

const stepColors: Record<StepStatus, { dot: string; label: string; bg: string }> = {
  pending: {
    dot: 'color.step.pending.dot',
    label: 'color.step.pending.label',
    bg: 'color.step.pending.bg',
  },
  active: {
    dot: 'color.step.active.dot',
    label: 'color.step.active.label',
    bg: 'color.step.active.bg',
  },
  complete: {
    dot: 'color.step.complete.dot',
    label: 'color.step.complete.label',
    bg: 'color.step.complete.bg',
  },
  waiting: {
    dot: 'color.step.waiting.dot',
    label: 'color.step.waiting.label',
    bg: 'color.step.waiting.bg',
  },
  cancelled: {
    dot: 'color.step.cancelled.dot',
    label: 'color.step.cancelled.label',
    bg: 'color.step.cancelled.bg',
  },
}

export function ProgressSteps({ steps }: ProgressStepsProps): ReactElement {
  return (
    <VStack gap={2} align="stretch" role="list">
      {steps.map((step, index) => {
        const colors = stepColors[step.status]
        return (
          <HStack
            key={step.id}
            data-status={step.status}
            gap={3}
            alignItems="flex-start"
            role="listitem"
            aria-current={step.status === 'active' ? 'step' : undefined}
          >
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              bg={colors.bg}
              border="1px solid"
              borderColor={colors.dot}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              mt="1px"
            >
              {step.status === 'complete' ? (
                <Text fontSize="xs" color={colors.dot} fontWeight="bold" lineHeight={1}>
                  ✓
                </Text>
              ) : step.status === 'cancelled' ? (
                <Text fontSize="xs" color={colors.dot} fontWeight="bold" lineHeight={1}>
                  —
                </Text>
              ) : (
                <Text
                  fontSize="xs"
                  color={colors.dot}
                  fontFamily="mono"
                  fontWeight="medium"
                  lineHeight={1}
                >
                  {index + 1}
                </Text>
              )}
            </Box>
            <VStack gap={0} align="stretch" flex={1}>
              <Text
                fontSize="sm"
                color={colors.label}
                fontWeight={
                  step.status === 'active' || step.status === 'waiting' ? 'medium' : 'normal'
                }
                lineHeight="24px"
              >
                {step.label}
              </Text>
              {step.description && (
                <Text fontSize="xs" color="color.text.muted">
                  {step.description}
                </Text>
              )}
            </VStack>
          </HStack>
        )
      })}
    </VStack>
  )
}
