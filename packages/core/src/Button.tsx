import React from 'react'
import { Box, chakra } from '@chakra-ui/react'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: React.MouseEvent) => void
  children?: React.ReactNode
  'aria-label'?: string
}

// chakra('button') creates a <button> element that accepts both HTML button
// attributes (type, disabled) and Chakra's full style prop system (_hover,
// _focusVisible, semantic tokens, etc.). Box as="button" lacks proper typing
// for button-specific attributes.
const ButtonEl = chakra('button')

const baseStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative' as const,
  fontFamily: 'body',
  fontWeight: 'medium',
  borderRadius: 'md',
  border: 'none',
  cursor: 'pointer',
  userSelect: 'none' as const,
  whiteSpace: 'nowrap' as const,
  transition: 'all 100ms',
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'accent.blue',
    outlineOffset: '2px',
  },
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
}

const variantStyles: Record<ButtonVariant, object> = {
  solid: {
    bg: 'accent.blue',
    color: 'color.on.accent',
    _hover: { opacity: 0.85 },
    _active: { transform: 'scale(0.97)', opacity: 0.75 },
  },
  outline: {
    bg: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'border.subtle',
    color: 'text.primary',
    _hover: { bg: 'bg.elevated' },
    _active: { bg: 'bg.elevated', transform: 'scale(0.97)' },
  },
  ghost: {
    bg: 'transparent',
    color: 'text.muted',
    _hover: { bg: 'bg.elevated', color: 'text.primary' },
    _active: { bg: 'bg.elevated', transform: 'scale(0.97)' },
  },
  danger: {
    bg: 'accent.red',
    color: 'color.on.accent',
    _hover: { opacity: 0.85 },
    _active: { transform: 'scale(0.97)', opacity: 0.75 },
  },
}

const sizeStyles: Record<ButtonSize, object> = {
  sm: { h: '28px', px: 3, fontSize: 'xs', gap: 1 },
  md: { h: '36px', px: 4, fontSize: 'sm', gap: 2 },
  lg: { h: '44px', px: 5, fontSize: 'md', gap: 2 },
}

// Three-dot pulse reuses the ds-pulse keyframe injected by AgenticProvider.
// currentColor inherits the button's text color so dots work across all variants.
function LoadingDots() {
  return (
    <Box as="span" display="inline-flex" alignItems="center" gap="3px" aria-hidden>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          as="span"
          w="4px"
          h="4px"
          borderRadius="full"
          bg="currentColor"
          opacity={0.8}
          animation={`ds-pulse 1.2s ease-in-out ${i * 0.2}s infinite`}
        />
      ))}
    </Box>
  )
}

export function Button({
  variant = 'solid',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <ButtonEl
      type={type}
      aria-disabled={disabled ? true : undefined}
      tabIndex={disabled ? 0 : undefined}
      aria-busy={loading || undefined}
      aria-label={loading && loadingText ? loadingText : ariaLabel}
      pointerEvents={loading ? 'none' : undefined}
      width={fullWidth ? '100%' : undefined}
      onClick={!disabled && !loading ? onClick : undefined}
      {...baseStyles}
      {...variantStyles[variant]}
      {...sizeStyles[size]}
    >
      {/* Absolutely positioned overlay preserves button width during loading */}
      {loading && (
        <Box
          as="span"
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <LoadingDots />
        </Box>
      )}

      {/* Belt-and-suspenders: visually hidden text for SRs that read content
          instead of aria-label */}
      {loading && loadingText && (
        <Box
          as="span"
          position="absolute"
          w="1px"
          h="1px"
          overflow="hidden"
          style={{ clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        >
          {loadingText}
        </Box>
      )}

      {/* Label — hidden visually when loading but stays in DOM to hold width */}
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        gap="inherit"
        opacity={loading ? 0 : 1}
      >
        {leftIcon && (
          <Box as="span" display="inline-flex" flexShrink={0} aria-hidden>
            {leftIcon}
          </Box>
        )}
        {children}
        {rightIcon && (
          <Box as="span" display="inline-flex" flexShrink={0} aria-hidden>
            {rightIcon}
          </Box>
        )}
      </Box>
    </ButtonEl>
  )
}
