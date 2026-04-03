// Design tokens — W3C DTCG 2025.10 format
// Each token: { $value, $type, $description? }
// Semantic aliases use {group.key} DTCG reference notation; values are
// pre-resolved in packages/core/src/theme.ts for Chakra's semantic token system.

// ---- DTCG token type interfaces ----

interface ColorToken {
  readonly $value: string
  readonly $type: 'color'
  readonly $description?: string
}
interface DimensionToken {
  readonly $value: string
  readonly $type: 'dimension'
  readonly $description?: string
}
interface FontFamilyToken {
  readonly $value: string
  readonly $type: 'fontFamily'
  readonly $description?: string
}
interface FontWeightToken {
  readonly $value: string
  readonly $type: 'fontWeight'
  readonly $description?: string
}
interface DurationToken {
  readonly $value: string
  readonly $type: 'duration'
  readonly $description?: string
}

// ---- Primitive color tokens ----
// Source of truth for all raw color values.
// Components MUST NOT reference these directly — use semantic aliases below.
export const colors = Object.freeze({
  bgBase:       { $value: '#0a0a0f', $type: 'color', $description: 'Darkest background layer' }           satisfies ColorToken,
  bgSurface:    { $value: '#13131a', $type: 'color', $description: 'Default surface' }                    satisfies ColorToken,
  bgElevated:   { $value: '#1c1c26', $type: 'color', $description: 'Elevated surface — cards, popovers' } satisfies ColorToken,
  borderSubtle: { $value: '#2a2a38', $type: 'color', $description: 'Low-contrast divider and border' }    satisfies ColorToken,
  textPrimary:  { $value: '#f0f0f5', $type: 'color', $description: 'High-contrast body text' }            satisfies ColorToken,
  textMuted:    { $value: '#8888aa', $type: 'color', $description: 'De-emphasized or secondary text' }    satisfies ColorToken,
  accentBlue:   { $value: '#4d9fff', $type: 'color', $description: 'Primary interactive accent' }         satisfies ColorToken,
  accentGreen:  { $value: '#3dd68c', $type: 'color', $description: 'Success and done state' }             satisfies ColorToken,
  accentAmber:  { $value: '#f59e0b', $type: 'color', $description: 'Warning and waiting state' }          satisfies ColorToken,
  accentRed:    { $value: '#f87171', $type: 'color', $description: 'Error and danger state' }             satisfies ColorToken,
})

// ---- Semantic alias tier ----
// Maps MCP lifecycle states and component-level intent to primitive references.
// Components MUST reference these via Chakra semantic tokens (e.g. bg="color.agent.status.running").
// The {colors.*} syntax is DTCG alias notation — resolved to concrete values in theme.ts.
export const semanticColors = Object.freeze({
  agent: {
    status: {
      idle:      { $value: '{colors.textMuted}',   $type: 'color', $description: 'MCP idle — not started' }                         satisfies ColorToken,
      running:   { $value: '{colors.accentBlue}',  $type: 'color', $description: 'MCP running — actively processing' }              satisfies ColorToken,
      waiting:   { $value: '{colors.accentAmber}', $type: 'color', $description: 'MCP input_required — paused for user input' }     satisfies ColorToken,
      done:      { $value: '{colors.accentGreen}', $type: 'color', $description: 'MCP completed — successfully finished' }          satisfies ColorToken,
      error:     { $value: '{colors.accentRed}',   $type: 'color', $description: 'MCP failed — terminal error' }                    satisfies ColorToken,
      cancelled: { $value: '{colors.textMuted}',   $type: 'color', $description: 'MCP cancelled — explicitly stopped' }             satisfies ColorToken,
    },
  },
  tool: {
    status: {
      pending: { $value: '{colors.textMuted}',   $type: 'color', $description: 'Tool call not yet dispatched' }      satisfies ColorToken,
      running: { $value: '{colors.accentBlue}',  $type: 'color', $description: 'Tool call in progress' }             satisfies ColorToken,
      done:    { $value: '{colors.accentGreen}', $type: 'color', $description: 'Tool call completed successfully' }  satisfies ColorToken,
      error:   { $value: '{colors.accentRed}',   $type: 'color', $description: 'Tool call failed' }                  satisfies ColorToken,
    },
  },
  message: {
    user:      { bg: { $value: '{colors.bgElevated}',   $type: 'color', $description: 'User message bubble background' }      satisfies ColorToken },
    assistant: { bg: { $value: '{colors.bgSurface}',    $type: 'color', $description: 'Assistant message bubble background' } satisfies ColorToken },
    tool: {
      bg:     { $value: '{colors.bgElevated}',   $type: 'color', $description: 'Tool result bubble background' } satisfies ColorToken,
      border: { $value: '{colors.borderSubtle}', $type: 'color', $description: 'Tool result bubble border' }     satisfies ColorToken,
    },
  },
})

export const space = Object.freeze({
  1:  { $value: '4px',  $type: 'dimension' } satisfies DimensionToken,
  2:  { $value: '8px',  $type: 'dimension' } satisfies DimensionToken,
  3:  { $value: '12px', $type: 'dimension' } satisfies DimensionToken,
  4:  { $value: '16px', $type: 'dimension' } satisfies DimensionToken,
  5:  { $value: '20px', $type: 'dimension' } satisfies DimensionToken,
  6:  { $value: '24px', $type: 'dimension' } satisfies DimensionToken,
  8:  { $value: '32px', $type: 'dimension' } satisfies DimensionToken,
  10: { $value: '40px', $type: 'dimension' } satisfies DimensionToken,
  12: { $value: '48px', $type: 'dimension' } satisfies DimensionToken,
  16: { $value: '64px', $type: 'dimension' } satisfies DimensionToken,
})

export const fonts = Object.freeze({
  mono: { $value: '"JetBrains Mono", "Fira Code", Menlo, monospace',                        $type: 'fontFamily', $description: 'Monospaced font for code and technical content' } satisfies FontFamilyToken,
  sans: { $value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',       $type: 'fontFamily', $description: 'System sans-serif for body and UI text' }         satisfies FontFamilyToken,
})

export const fontSizes = Object.freeze({
  xs:   { $value: '0.75rem',  $type: 'dimension' } satisfies DimensionToken,
  sm:   { $value: '0.875rem', $type: 'dimension' } satisfies DimensionToken,
  md:   { $value: '1rem',     $type: 'dimension' } satisfies DimensionToken,
  lg:   { $value: '1.125rem', $type: 'dimension' } satisfies DimensionToken,
  xl:   { $value: '1.25rem',  $type: 'dimension' } satisfies DimensionToken,
  '2xl': { $value: '1.5rem', $type: 'dimension' } satisfies DimensionToken,
})

export const fontWeights = Object.freeze({
  normal:   { $value: '400', $type: 'fontWeight' } satisfies FontWeightToken,
  medium:   { $value: '500', $type: 'fontWeight' } satisfies FontWeightToken,
  semibold: { $value: '600', $type: 'fontWeight' } satisfies FontWeightToken,
  bold:     { $value: '700', $type: 'fontWeight' } satisfies FontWeightToken,
})

export const duration = Object.freeze({
  fast:   { $value: '100ms', $type: 'duration', $description: 'Micro-interactions and hover state transitions' } satisfies DurationToken,
  normal: { $value: '200ms', $type: 'duration', $description: 'Standard UI transitions' }                        satisfies DurationToken,
  slow:   { $value: '400ms', $type: 'duration', $description: 'Deliberate or complex transitions' }              satisfies DurationToken,
})

export const radius = Object.freeze({
  sm: { $value: '4px',  $type: 'dimension' } satisfies DimensionToken,
  md: { $value: '8px',  $type: 'dimension' } satisfies DimensionToken,
  lg: { $value: '12px', $type: 'dimension' } satisfies DimensionToken,
})

export function getCSSVariables(): string {
  return [
    '[data-agentic-ds] {',
    `  --ds-bg-base: ${colors.bgBase.$value};`,
    `  --ds-bg-surface: ${colors.bgSurface.$value};`,
    `  --ds-bg-elevated: ${colors.bgElevated.$value};`,
    `  --ds-border-subtle: ${colors.borderSubtle.$value};`,
    `  --ds-text-primary: ${colors.textPrimary.$value};`,
    `  --ds-text-muted: ${colors.textMuted.$value};`,
    `  --ds-accent-blue: ${colors.accentBlue.$value};`,
    `  --ds-accent-green: ${colors.accentGreen.$value};`,
    `  --ds-accent-amber: ${colors.accentAmber.$value};`,
    `  --ds-accent-red: ${colors.accentRed.$value};`,
    `  --ds-font-mono: ${fonts.mono.$value};`,
    `  --ds-font-sans: ${fonts.sans.$value};`,
    `  --ds-duration-fast: ${duration.fast.$value};`,
    `  --ds-duration-normal: ${duration.normal.$value};`,
    `  --ds-duration-slow: ${duration.slow.$value};`,
    `  --ds-radius-sm: ${radius.sm.$value};`,
    `  --ds-radius-md: ${radius.md.$value};`,
    `  --ds-radius-lg: ${radius.lg.$value};`,
    '}',
  ].join('\n')
}

export const tokens = Object.freeze({ colors, semanticColors, space, fonts, fontSizes, fontWeights, duration, radius })
export default tokens
