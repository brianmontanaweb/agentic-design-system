import { useState, useId, useRef, useEffect, cloneElement } from 'react'
import type { ReactElement, KeyboardEvent } from 'react'
import { Box } from '@chakra-ui/react'
import { duration } from '@agentic-ds/tokens'

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  label: string
  placement?: TooltipPlacement
  children: ReactElement
  isDisabled?: boolean
}

interface PlacementStyle {
  bottom?: string
  top?: string
  left?: string
  right?: string
  transform: string
}

const placementStyles: Record<TooltipPlacement, PlacementStyle> = {
  top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
  right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
}

export function Tooltip({ label, placement = 'top', children, isDisabled = false }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  function show() {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setVisible(true)
  }

  function hide() {
    hideTimer.current = setTimeout(() => setVisible(false), 100)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === 'Escape') setVisible(false)
  }

  // ReactElement<unknown> won't accept ARIA props via Partial<unknown>;
  // double-cast to a known ARIA-compatible shape so cloneElement is type-safe.
  const trigger = cloneElement(
    children as unknown as ReactElement<{ 'aria-describedby'?: string }>,
    { 'aria-describedby': !isDisabled ? id : undefined }
  )

  return (
    <Box
      as="span"
      position="relative"
      display="inline-flex"
      onMouseEnter={!isDisabled ? show : undefined}
      onMouseLeave={!isDisabled ? hide : undefined}
      onFocus={!isDisabled ? show : undefined}
      onBlur={!isDisabled ? hide : undefined}
      onKeyDown={!isDisabled ? handleKeyDown : undefined}
    >
      {trigger}
      {!isDisabled && (
        <Box
          id={id}
          role="tooltip"
          position="absolute"
          {...placementStyles[placement]}
          visibility={visible ? 'visible' : 'hidden'}
          opacity={visible ? 1 : 0}
          transition={`opacity ${duration.fast.$value}, visibility ${duration.fast.$value}`}
          bg="bg.elevated"
          color="text.primary"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="md"
          px={2}
          py={1}
          fontSize="xs"
          fontFamily="body"
          whiteSpace="nowrap"
          zIndex={1000}
          pointerEvents="none"
        >
          {label}
        </Box>
      )}
    </Box>
  )
}
