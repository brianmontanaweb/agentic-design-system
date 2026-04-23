import React from 'react'
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

const stepColors: Record<StepStatus, { dot: string; label: string }> = {
  pending: { dot: 'color.border.subtle', label: 'color.text.muted' },
  active: { dot: 'color.accent.interactive', label: 'color.text.primary' },
  complete: { dot: 'color.accent.success', label: 'color.text.muted' },
  waiting: { dot: 'color.accent.warning', label: 'color.text.primary' },
  cancelled: { dot: 'color.text.muted', label: 'color.text.muted' },
}

function stepBg(status: StepStatus): string {
  switch (status) {
    case 'complete':
      return 'color.surface.step.complete'
    case 'active':
      return 'color.surface.step.active'
    case 'waiting':
      return 'color.surface.step.waiting'
    default:
      return 'color.surface.elevated'
  }
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <VStack gap={2} align="stretch" role="list">
      {steps.map((step, index) => {
        const colors = stepColors[step.status]
        return (
          <HStack
            key={step.id}
            gap={3}
            alignItems="flex-start"
            role="listitem"
            aria-current={step.status === 'active' ? 'step' : undefined}
          >
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              bg={stepBg(step.status)}
              border="1px solid"
              borderColor={colors.dot}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              mt="1px"
            >
              {step.status === 'complete' ? (
                <Text fontSize="xs" color="color.accent.success" fontWeight="bold" lineHeight={1}>
                  ✓
                </Text>
              ) : step.status === 'cancelled' ? (
                <Text fontSize="xs" color="color.text.muted" fontWeight="bold" lineHeight={1}>
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
