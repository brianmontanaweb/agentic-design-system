export const colors = {
  bgBase: '#0a0a0f',
  bgSurface: '#13131a',
  bgElevated: '#1c1c26',
  borderSubtle: '#2a2a38',
  textPrimary: '#f0f0f5',
  textMuted: '#8888aa',
  accentBlue: '#4d9fff',
  accentGreen: '#3dd68c',
  accentAmber: '#f59e0b',
  accentRed: '#f87171',
} as const

export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

export const fonts = {
  mono: '"JetBrains Mono", "Fira Code", Menlo, monospace',
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
} as const

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const duration = {
  fast: '100ms',
  normal: '200ms',
  slow: '400ms',
} as const

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
} as const

export function getCSSVariables(): string {
  return [
    ':root {',
    `  --ds-bg-base: ${colors.bgBase};`,
    `  --ds-bg-surface: ${colors.bgSurface};`,
    `  --ds-bg-elevated: ${colors.bgElevated};`,
    `  --ds-border-subtle: ${colors.borderSubtle};`,
    `  --ds-text-primary: ${colors.textPrimary};`,
    `  --ds-text-muted: ${colors.textMuted};`,
    `  --ds-accent-blue: ${colors.accentBlue};`,
    `  --ds-accent-green: ${colors.accentGreen};`,
    `  --ds-accent-amber: ${colors.accentAmber};`,
    `  --ds-accent-red: ${colors.accentRed};`,
    `  --ds-font-mono: ${fonts.mono};`,
    `  --ds-font-sans: ${fonts.sans};`,
    `  --ds-duration-fast: ${duration.fast};`,
    `  --ds-duration-normal: ${duration.normal};`,
    `  --ds-duration-slow: ${duration.slow};`,
    `  --ds-radius-sm: ${radius.sm};`,
    `  --ds-radius-md: ${radius.md};`,
    `  --ds-radius-lg: ${radius.lg};`,
    '}',
  ].join('\n')
}

export const tokens = { colors, space, fonts, fontSizes, fontWeights, duration, radius }
export default tokens
