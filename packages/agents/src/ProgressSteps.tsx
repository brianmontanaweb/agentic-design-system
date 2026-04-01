import React from 'react'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'

export type StepStatus = 'pending' | 'active' | 'complete'

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
  pending: { dot: '#2a2a38', label: '#8888aa' },
  active: { dot: '#4d9fff', label: '#f0f0f5' },
  complete: { dot: '#3dd68c', label: '#8888aa' },
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <VStack gap={2} align="stretch">
      {steps.map((step, index) => {
        const colors = stepColors[step.status]
        return (
          <HStack key={step.id} gap={3} alignItems="flex-start">
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              bg={
                step.status === 'complete'
                  ? '#3dd68c22'
                  : step.status === 'active'
                    ? '#4d9fff22'
                    : 'bg.elevated'
              }
              border="1px solid"
              borderColor={colors.dot}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              mt="1px"
            >
              {step.status === 'complete' ? (
                <Text fontSize="xs" color="#3dd68c" fontWeight="bold" lineHeight={1}>
                  ✓
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
                fontWeight={step.status === 'active' ? 'medium' : 'normal'}
                lineHeight="24px"
              >
                {step.label}
              </Text>
              {step.description && (
                <Text fontSize="xs" color="text.muted">
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
