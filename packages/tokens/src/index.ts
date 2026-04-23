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
interface ShadowToken {
  readonly $value: string
  readonly $type: 'shadow'
  readonly $description?: string
}
interface NumberToken {
  readonly $value: number
  readonly $type: 'number'
  readonly $description?: string
}

// ---- Primitive color tokens ----
// Source of truth for all raw color values.
// Components MUST NOT reference these directly — use semantic aliases below.
export const colors = Object.freeze({
  bgBase: {
    $value: '#0a0a0f',
    $type: 'color',
    $description: 'Darkest background layer',
  } satisfies ColorToken,
  bgSurface: {
    $value: '#13131a',
    $type: 'color',
    $description: 'Default surface',
  } satisfies ColorToken,
  bgElevated: {
    $value: '#1c1c26',
    $type: 'color',
    $description: 'Elevated surface — cards, popovers',
  } satisfies ColorToken,
  borderSubtle: {
    $value: '#2a2a38',
    $type: 'color',
    $description: 'Low-contrast divider and border',
  } satisfies ColorToken,
  textPrimary: {
    $value: '#f0f0f5',
    $type: 'color',
    $description: 'High-contrast body text',
  } satisfies ColorToken,
  textMuted: {
    $value: '#8888aa',
    $type: 'color',
    $description: 'De-emphasized or secondary text',
  } satisfies ColorToken,
  accentBlue: {
    $value: '#4d9fff',
    $type: 'color',
    $description: 'Primary interactive accent',
  } satisfies ColorToken,
  accentGreen: {
    $value: '#3dd68c',
    $type: 'color',
    $description: 'Success and done state',
  } satisfies ColorToken,
  accentAmber: {
    $value: '#f59e0b',
    $type: 'color',
    $description: 'Warning and waiting state',
  } satisfies ColorToken,
  accentRed: {
    $value: '#f87171',
    $type: 'color',
    $description: 'Error and danger state',
  } satisfies ColorToken,
})

// ---- Light-mode primitive color tokens ----
// Parallel to `colors` above; provides explicit light-mode values so theme.ts
// can reference them by name rather than embedding raw hex literals.
export const lightColors = Object.freeze({
  bgBase: {
    $value: '#f8f9fa',
    $type: 'color',
    $description: 'Light mode darkest background layer',
  } satisfies ColorToken,
  bgSurface: {
    $value: '#ffffff',
    $type: 'color',
    $description: 'Light mode default surface',
  } satisfies ColorToken,
  bgElevated: {
    $value: '#f0f0f5',
    $type: 'color',
    $description: 'Light mode elevated surface — cards, popovers',
  } satisfies ColorToken,
  borderSubtle: {
    $value: '#e2e2e8',
    $type: 'color',
    $description: 'Light mode low-contrast divider and border',
  } satisfies ColorToken,
  textPrimary: {
    $value: '#0a0a0f',
    $type: 'color',
    $description: 'Light mode high-contrast body text',
  } satisfies ColorToken,
  textMuted: {
    $value: '#6666aa',
    $type: 'color',
    $description: 'Light mode de-emphasized or secondary text',
  } satisfies ColorToken,
  accentBlue: {
    $value: '#2563eb',
    $type: 'color',
    $description: 'Light mode primary interactive accent',
  } satisfies ColorToken,
  accentGreen: {
    $value: '#16a34a',
    $type: 'color',
    $description: 'Light mode success and done state',
  } satisfies ColorToken,
  accentAmber: {
    $value: '#d97706',
    $type: 'color',
    $description: 'Light mode warning and waiting state',
  } satisfies ColorToken,
  accentRed: {
    $value: '#dc2626',
    $type: 'color',
    $description: 'Light mode error and danger state',
  } satisfies ColorToken,
  onAccent: {
    $value: '#ffffff',
    $type: 'color',
    $description: 'Light mode: white text on dark accent backgrounds',
  } satisfies ColorToken,
})

// ---- Step background tint tokens ----
// 8-digit hex (RRGGBBAA) — ~13 % opacity tint used for ProgressSteps circle backgrounds.
// Dark and light values are kept together so callers can read intent from the structure.
export const stepTints = Object.freeze({
  active: {
    dark: {
      $value: '#4d9fff22',
      $type: 'color',
      $description: 'Dark mode active step background tint',
    } satisfies ColorToken,
    light: {
      $value: '#2563eb22',
      $type: 'color',
      $description: 'Light mode active step background tint',
    } satisfies ColorToken,
  },
  complete: {
    dark: {
      $value: '#3dd68c22',
      $type: 'color',
      $description: 'Dark mode complete step background tint',
    } satisfies ColorToken,
    light: {
      $value: '#16a34a22',
      $type: 'color',
      $description: 'Light mode complete step background tint',
    } satisfies ColorToken,
  },
  waiting: {
    dark: {
      $value: '#f59e0b22',
      $type: 'color',
      $description: 'Dark mode waiting step background tint',
    } satisfies ColorToken,
    light: {
      $value: '#d9770622',
      $type: 'color',
      $description: 'Light mode waiting step background tint',
    } satisfies ColorToken,
  },
})

// ---- Semantic alias tier ----
// Maps MCP lifecycle states and component-level intent to primitive references.
// Components MUST reference these via Chakra semantic tokens (e.g. bg="color.agent.status.running").
// The {colors.*} syntax is DTCG alias notation — resolved to concrete values in theme.ts.
export const semanticColors = Object.freeze({
  agent: {
    status: {
      idle: {
        $value: '{colors.textMuted}',
        $type: 'color',
        $description: 'MCP idle — not started',
      } satisfies ColorToken,
      running: {
        $value: '{colors.accentBlue}',
        $type: 'color',
        $description: 'MCP running — actively processing',
      } satisfies ColorToken,
      waiting: {
        $value: '{colors.accentAmber}',
        $type: 'color',
        $description: 'MCP input_required — paused for user input',
      } satisfies ColorToken,
      done: {
        $value: '{colors.accentGreen}',
        $type: 'color',
        $description: 'MCP completed — successfully finished',
      } satisfies ColorToken,
      error: {
        $value: '{colors.accentRed}',
        $type: 'color',
        $description: 'MCP failed — terminal error',
      } satisfies ColorToken,
      cancelled: {
        $value: '{colors.textMuted}',
        $type: 'color',
        $description: 'MCP cancelled — explicitly stopped',
      } satisfies ColorToken,
    },
  },
  tool: {
    status: {
      pending: {
        $value: '{colors.textMuted}',
        $type: 'color',
        $description: 'Tool call not yet dispatched',
      } satisfies ColorToken,
      running: {
        $value: '{colors.accentBlue}',
        $type: 'color',
        $description: 'Tool call in progress',
      } satisfies ColorToken,
      done: {
        $value: '{colors.accentGreen}',
        $type: 'color',
        $description: 'Tool call completed successfully',
      } satisfies ColorToken,
      error: {
        $value: '{colors.accentRed}',
        $type: 'color',
        $description: 'Tool call failed',
      } satisfies ColorToken,
    },
  },
  stream: {
    cursor: {
      $value: '{colors.accentBlue}',
      $type: 'color',
      $description: 'StreamingText blinking cursor color',
    } satisfies ColorToken,
  },
  message: {
    user: {
      bg: {
        $value: '{colors.bgElevated}',
        $type: 'color',
        $description: 'User message bubble background',
      } satisfies ColorToken,
    },
    assistant: {
      bg: {
        $value: '{colors.bgSurface}',
        $type: 'color',
        $description: 'Assistant message bubble background',
      } satisfies ColorToken,
    },
    tool: {
      bg: {
        $value: '{colors.bgElevated}',
        $type: 'color',
        $description: 'Tool result bubble background',
      } satisfies ColorToken,
      border: {
        $value: '{colors.borderSubtle}',
        $type: 'color',
        $description: 'Tool result bubble border',
      } satisfies ColorToken,
    },
  },
})

export const space = Object.freeze({
  1: { $value: '4px', $type: 'dimension' } satisfies DimensionToken,
  2: { $value: '8px', $type: 'dimension' } satisfies DimensionToken,
  3: { $value: '12px', $type: 'dimension' } satisfies DimensionToken,
  4: { $value: '16px', $type: 'dimension' } satisfies DimensionToken,
  5: { $value: '20px', $type: 'dimension' } satisfies DimensionToken,
  6: { $value: '24px', $type: 'dimension' } satisfies DimensionToken,
  8: { $value: '32px', $type: 'dimension' } satisfies DimensionToken,
  10: { $value: '40px', $type: 'dimension' } satisfies DimensionToken,
  12: { $value: '48px', $type: 'dimension' } satisfies DimensionToken,
  16: { $value: '64px', $type: 'dimension' } satisfies DimensionToken,
})

export const fonts = Object.freeze({
  mono: {
    $value: '"JetBrains Mono", "Fira Code", Menlo, monospace',
    $type: 'fontFamily',
    $description: 'Monospaced font for code and technical content',
  } satisfies FontFamilyToken,
  sans: {
    $value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    $type: 'fontFamily',
    $description: 'System sans-serif for body and UI text',
  } satisfies FontFamilyToken,
})

export const fontSizes = Object.freeze({
  xs: { $value: '0.75rem', $type: 'dimension' } satisfies DimensionToken,
  sm: { $value: '0.875rem', $type: 'dimension' } satisfies DimensionToken,
  md: { $value: '1rem', $type: 'dimension' } satisfies DimensionToken,
  lg: { $value: '1.125rem', $type: 'dimension' } satisfies DimensionToken,
  xl: { $value: '1.25rem', $type: 'dimension' } satisfies DimensionToken,
  '2xl': { $value: '1.5rem', $type: 'dimension' } satisfies DimensionToken,
})

export const fontWeights = Object.freeze({
  normal: { $value: '400', $type: 'fontWeight' } satisfies FontWeightToken,
  medium: { $value: '500', $type: 'fontWeight' } satisfies FontWeightToken,
  semibold: { $value: '600', $type: 'fontWeight' } satisfies FontWeightToken,
  bold: { $value: '700', $type: 'fontWeight' } satisfies FontWeightToken,
})

export const duration = Object.freeze({
  fast: {
    $value: '100ms',
    $type: 'duration',
    $description: 'Micro-interactions and hover state transitions',
  } satisfies DurationToken,
  normal: {
    $value: '200ms',
    $type: 'duration',
    $description: 'Standard UI transitions',
  } satisfies DurationToken,
  slow: {
    $value: '400ms',
    $type: 'duration',
    $description: 'Deliberate or complex transitions',
  } satisfies DurationToken,
  stream: {
    blink: {
      $value: '1000ms',
      $type: 'duration',
      $description: 'StreamingText cursor blink cycle',
    } satisfies DurationToken,
    thinking: {
      $value: '1200ms',
      $type: 'duration',
      $description: 'ThinkingIndicator dot pulse cycle',
    } satisfies DurationToken,
  },
})

export const lineHeights = Object.freeze({
  tight: {
    $value: '1.25',
    $type: 'dimension',
    $description: 'Compact line spacing for headings',
  } satisfies DimensionToken,
  base: {
    $value: '1.5',
    $type: 'dimension',
    $description: 'Body text line spacing',
  } satisfies DimensionToken,
  relaxed: {
    $value: '1.75',
    $type: 'dimension',
    $description: 'Loose spacing for readability-heavy content',
  } satisfies DimensionToken,
})

export const radius = Object.freeze({
  sm: { $value: '4px', $type: 'dimension' } satisfies DimensionToken,
  md: { $value: '8px', $type: 'dimension' } satisfies DimensionToken,
  lg: { $value: '12px', $type: 'dimension' } satisfies DimensionToken,
  full: {
    $value: '9999px',
    $type: 'dimension',
    $description: 'Pill / fully-rounded shape — badges, chips',
  } satisfies DimensionToken,
})

export const shadows = Object.freeze({
  sm: {
    $value: '0 1px 3px rgba(0, 0, 0, 0.4)',
    $type: 'shadow',
    $description: 'Subtle elevation — tooltips, chips',
  } satisfies ShadowToken,
  md: {
    $value: '0 4px 12px rgba(0, 0, 0, 0.5)',
    $type: 'shadow',
    $description: 'Standard elevation — cards, dropdowns',
  } satisfies ShadowToken,
  lg: {
    $value: '0 8px 24px rgba(0, 0, 0, 0.6)',
    $type: 'shadow',
    $description: 'High elevation — modals, drawers',
  } satisfies ShadowToken,
})

export const zIndex = Object.freeze({
  dropdown: {
    $value: 1000,
    $type: 'number',
    $description: 'Dropdown menus',
  } satisfies NumberToken,
  sticky: {
    $value: 1100,
    $type: 'number',
    $description: 'Sticky headers and position:sticky elements',
  } satisfies NumberToken,
  overlay: {
    $value: 1200,
    $type: 'number',
    $description: 'Overlay backdrops',
  } satisfies NumberToken,
  modal: {
    $value: 1300,
    $type: 'number',
    $description: 'Modal dialogs',
  } satisfies NumberToken,
  tooltip: {
    $value: 1400,
    $type: 'number',
    $description: 'Tooltips — must appear above modals',
  } satisfies NumberToken,
})

export function getCSSVariables(): string {
  return [
    '[data-agentic-ds] {',
    // ---- Surfaces (renamed from --ds-bg-* / --ds-accent-* / --ds-text-* / --ds-border-*) ----
    `  --ds-color-surface-base: ${colors.bgBase.$value};`,
    `  --ds-color-surface-default: ${colors.bgSurface.$value};`,
    `  --ds-color-surface-elevated: ${colors.bgElevated.$value};`,
    `  --ds-color-border-subtle: ${colors.borderSubtle.$value};`,
    `  --ds-color-text-primary: ${colors.textPrimary.$value};`,
    `  --ds-color-text-muted: ${colors.textMuted.$value};`,
    `  --ds-color-accent-interactive: ${colors.accentBlue.$value};`,
    `  --ds-color-accent-success: ${colors.accentGreen.$value};`,
    `  --ds-color-accent-warning: ${colors.accentAmber.$value};`,
    `  --ds-color-accent-danger: ${colors.accentRed.$value};`,
    `  --ds-color-text-on-accent: ${colors.bgBase.$value};`,
    // ---- Semantic: MCP agent lifecycle ----
    `  --ds-color-agent-status-idle: ${colors.textMuted.$value};`,
    `  --ds-color-agent-status-running: ${colors.accentBlue.$value};`,
    `  --ds-color-agent-status-waiting: ${colors.accentAmber.$value};`,
    `  --ds-color-agent-status-done: ${colors.accentGreen.$value};`,
    `  --ds-color-agent-status-error: ${colors.accentRed.$value};`,
    `  --ds-color-agent-status-cancelled: ${colors.textMuted.$value};`,
    // ---- Semantic: tool call lifecycle ----
    `  --ds-color-tool-status-pending: ${colors.textMuted.$value};`,
    `  --ds-color-tool-status-running: ${colors.accentBlue.$value};`,
    `  --ds-color-tool-status-done: ${colors.accentGreen.$value};`,
    `  --ds-color-tool-status-error: ${colors.accentRed.$value};`,
    // ---- Semantic: streaming ----
    `  --ds-color-stream-cursor: ${colors.accentBlue.$value};`,
    // ---- Semantic: message roles ----
    `  --ds-color-message-user-bg: ${colors.bgElevated.$value};`,
    `  --ds-color-message-assistant-bg: ${colors.bgSurface.$value};`,
    `  --ds-color-message-tool-bg: ${colors.bgElevated.$value};`,
    `  --ds-color-message-tool-border: ${colors.borderSubtle.$value};`,
    // ---- Semantic: step tints (renamed from --ds-bg-step-*) ----
    `  --ds-color-surface-step-active: ${stepTints.active.dark.$value};`,
    `  --ds-color-surface-step-complete: ${stepTints.complete.dark.$value};`,
    `  --ds-color-surface-step-waiting: ${stepTints.waiting.dark.$value};`,
    // ---- Space ----
    `  --ds-space-1: ${space[1].$value};`,
    `  --ds-space-2: ${space[2].$value};`,
    `  --ds-space-3: ${space[3].$value};`,
    `  --ds-space-4: ${space[4].$value};`,
    `  --ds-space-5: ${space[5].$value};`,
    `  --ds-space-6: ${space[6].$value};`,
    `  --ds-space-8: ${space[8].$value};`,
    `  --ds-space-10: ${space[10].$value};`,
    `  --ds-space-12: ${space[12].$value};`,
    `  --ds-space-16: ${space[16].$value};`,
    // ---- Typography ----
    `  --ds-font-mono: ${fonts.mono.$value};`,
    `  --ds-font-sans: ${fonts.sans.$value};`,
    `  --ds-font-size-xs: ${fontSizes.xs.$value};`,
    `  --ds-font-size-sm: ${fontSizes.sm.$value};`,
    `  --ds-font-size-md: ${fontSizes.md.$value};`,
    `  --ds-font-size-lg: ${fontSizes.lg.$value};`,
    `  --ds-font-size-xl: ${fontSizes.xl.$value};`,
    `  --ds-font-size-2xl: ${fontSizes['2xl'].$value};`,
    `  --ds-font-weight-normal: ${fontWeights.normal.$value};`,
    `  --ds-font-weight-medium: ${fontWeights.medium.$value};`,
    `  --ds-font-weight-semibold: ${fontWeights.semibold.$value};`,
    `  --ds-font-weight-bold: ${fontWeights.bold.$value};`,
    `  --ds-line-height-tight: ${lineHeights.tight.$value};`,
    `  --ds-line-height-base: ${lineHeights.base.$value};`,
    `  --ds-line-height-relaxed: ${lineHeights.relaxed.$value};`,
    // ---- Motion ----
    `  --ds-duration-fast: ${duration.fast.$value};`,
    `  --ds-duration-normal: ${duration.normal.$value};`,
    `  --ds-duration-slow: ${duration.slow.$value};`,
    `  --ds-duration-stream-blink: ${duration.stream.blink.$value};`,
    `  --ds-duration-stream-thinking: ${duration.stream.thinking.$value};`,
    // ---- Radius ----
    `  --ds-radius-sm: ${radius.sm.$value};`,
    `  --ds-radius-md: ${radius.md.$value};`,
    `  --ds-radius-lg: ${radius.lg.$value};`,
    `  --ds-radius-full: ${radius.full.$value};`,
    // ---- Shadows ----
    `  --ds-shadow-sm: ${shadows.sm.$value};`,
    `  --ds-shadow-md: ${shadows.md.$value};`,
    `  --ds-shadow-lg: ${shadows.lg.$value};`,
    // ---- Z-index ----
    `  --ds-z-index-dropdown: ${zIndex.dropdown.$value};`,
    `  --ds-z-index-sticky: ${zIndex.sticky.$value};`,
    `  --ds-z-index-overlay: ${zIndex.overlay.$value};`,
    `  --ds-z-index-modal: ${zIndex.modal.$value};`,
    `  --ds-z-index-tooltip: ${zIndex.tooltip.$value};`,
    '}',
    '',
    '@media (prefers-color-scheme: light) {',
    '  [data-agentic-ds] {',
    `    --ds-color-surface-base: ${lightColors.bgBase.$value};`,
    `    --ds-color-surface-default: ${lightColors.bgSurface.$value};`,
    `    --ds-color-surface-elevated: ${lightColors.bgElevated.$value};`,
    `    --ds-color-border-subtle: ${lightColors.borderSubtle.$value};`,
    `    --ds-color-text-primary: ${lightColors.textPrimary.$value};`,
    `    --ds-color-text-muted: ${lightColors.textMuted.$value};`,
    `    --ds-color-accent-interactive: ${lightColors.accentBlue.$value};`,
    `    --ds-color-accent-success: ${lightColors.accentGreen.$value};`,
    `    --ds-color-accent-warning: ${lightColors.accentAmber.$value};`,
    `    --ds-color-accent-danger: ${lightColors.accentRed.$value};`,
    `    --ds-color-text-on-accent: ${lightColors.onAccent.$value};`,
    `    --ds-color-agent-status-idle: ${lightColors.textMuted.$value};`,
    `    --ds-color-agent-status-running: ${lightColors.accentBlue.$value};`,
    `    --ds-color-agent-status-waiting: ${lightColors.accentAmber.$value};`,
    `    --ds-color-agent-status-done: ${lightColors.accentGreen.$value};`,
    `    --ds-color-agent-status-error: ${lightColors.accentRed.$value};`,
    `    --ds-color-agent-status-cancelled: ${lightColors.textMuted.$value};`,
    `    --ds-color-tool-status-pending: ${lightColors.textMuted.$value};`,
    `    --ds-color-tool-status-running: ${lightColors.accentBlue.$value};`,
    `    --ds-color-tool-status-done: ${lightColors.accentGreen.$value};`,
    `    --ds-color-tool-status-error: ${lightColors.accentRed.$value};`,
    `    --ds-color-stream-cursor: ${lightColors.accentBlue.$value};`,
    `    --ds-color-message-user-bg: ${lightColors.bgElevated.$value};`,
    `    --ds-color-message-assistant-bg: ${lightColors.bgSurface.$value};`,
    `    --ds-color-message-tool-bg: ${lightColors.bgElevated.$value};`,
    `    --ds-color-message-tool-border: ${lightColors.borderSubtle.$value};`,
    `    --ds-color-surface-step-active: ${stepTints.active.light.$value};`,
    `    --ds-color-surface-step-complete: ${stepTints.complete.light.$value};`,
    `    --ds-color-surface-step-waiting: ${stepTints.waiting.light.$value};`,
    '  }',
    '}',
  ].join('\n')
}

export const tokens = Object.freeze({
  colors,
  lightColors,
  stepTints,
  semanticColors,
  space,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  duration,
  radius,
  shadows,
  zIndex,
})
export default tokens
