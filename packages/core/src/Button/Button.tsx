import type { ReactElement, ReactNode, MouseEventHandler } from 'react'
import { Box, chakra, useRecipe } from '@chakra-ui/react'
import { buttonRecipe } from '../theme'

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: ReactElement
  rightIcon?: ReactElement
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler
  children?: ReactNode
  'aria-label'?: string
}

// chakra('button') creates a <button> element that accepts both HTML button
// attributes (type, disabled) and Chakra's full style prop system (_hover,
// _focusVisible, semantic tokens, etc.). Box as="button" lacks proper typing
// for button-specific attributes.
const ButtonEl = chakra('button')

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
  const recipe = useRecipe({ recipe: buttonRecipe })
  const styles = recipe({ variant, size })

  return (
    <ButtonEl
      type={type}
      disabled={disabled}
      aria-busy={loading}
      aria-label={loading && loadingText ? loadingText : ariaLabel}
      pointerEvents={loading ? 'none' : undefined}
      width={fullWidth ? '100%' : undefined}
      onClick={!loading ? onClick : undefined}
      {...styles}
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
