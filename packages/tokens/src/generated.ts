// Auto-generated from tokens.dtcg.json — do not edit directly
// Run `npm run tokens:generate` to regenerate

export const colors = Object.freeze({
  bgBase: { $value: '#0a0a0f', $type: 'color', $description: 'Darkest background layer' },
  bgSurface: { $value: '#13131a', $type: 'color', $description: 'Default surface' },
  bgElevated: {
    $value: '#1c1c26',
    $type: 'color',
    $description: 'Elevated surface — cards, popovers',
  },
  borderSubtle: {
    $value: '#2a2a38',
    $type: 'color',
    $description: 'Low-contrast divider and border',
  },
  textPrimary: { $value: '#f0f0f5', $type: 'color', $description: 'High-contrast body text' },
  textMuted: { $value: '#8888aa', $type: 'color', $description: 'De-emphasized or secondary text' },
  accentBlue: { $value: '#4d9fff', $type: 'color', $description: 'Primary interactive accent' },
  accentGreen: { $value: '#3dd68c', $type: 'color', $description: 'Success and done state' },
  accentAmber: { $value: '#f59e0b', $type: 'color', $description: 'Warning and waiting state' },
  accentRed: { $value: '#f87171', $type: 'color', $description: 'Error and danger state' },
})
export const lightColors = Object.freeze({
  bgBase: {
    $value: '#f8f9fa',
    $type: 'color',
    $description: 'Light mode darkest background layer',
  },
  bgSurface: { $value: '#ffffff', $type: 'color', $description: 'Light mode default surface' },
  bgElevated: {
    $value: '#f0f0f5',
    $type: 'color',
    $description: 'Light mode elevated surface — cards, popovers',
  },
  borderSubtle: {
    $value: '#e2e2e8',
    $type: 'color',
    $description: 'Light mode low-contrast divider and border',
  },
  textPrimary: {
    $value: '#0a0a0f',
    $type: 'color',
    $description: 'Light mode high-contrast body text',
  },
  textMuted: {
    $value: '#6666aa',
    $type: 'color',
    $description: 'Light mode de-emphasized or secondary text',
  },
  accentBlue: {
    $value: '#2563eb',
    $type: 'color',
    $description: 'Light mode primary interactive accent',
  },
  accentGreen: {
    $value: '#16a34a',
    $type: 'color',
    $description: 'Light mode success and done state',
  },
  accentAmber: {
    $value: '#d97706',
    $type: 'color',
    $description: 'Light mode warning and waiting state',
  },
  accentRed: {
    $value: '#dc2626',
    $type: 'color',
    $description: 'Light mode error and danger state',
  },
  onAccent: {
    $value: '#ffffff',
    $type: 'color',
    $description: 'Light mode: white text on dark accent backgrounds',
  },
})
export const stepTints = Object.freeze({
  active: {
    dark: {
      $value: '#4d9fff22',
      $type: 'color',
      $description: 'Dark mode active step background tint',
    },
    light: {
      $value: '#2563eb22',
      $type: 'color',
      $description: 'Light mode active step background tint',
    },
  },
  complete: {
    dark: {
      $value: '#3dd68c22',
      $type: 'color',
      $description: 'Dark mode complete step background tint',
    },
    light: {
      $value: '#16a34a22',
      $type: 'color',
      $description: 'Light mode complete step background tint',
    },
  },
  waiting: {
    dark: {
      $value: '#f59e0b22',
      $type: 'color',
      $description: 'Dark mode waiting step background tint',
    },
    light: {
      $value: '#d9770622',
      $type: 'color',
      $description: 'Light mode waiting step background tint',
    },
  },
})
export const semanticColors = Object.freeze({
  agent: {
    status: {
      idle: {
        $value: '{colors.textMuted}',
        $type: 'color',
        $description: 'MCP idle — not started',
      },
      running: {
        $value: '{colors.accentBlue}',
        $type: 'color',
        $description: 'MCP running — actively processing',
      },
      waiting: {
        $value: '{colors.accentAmber}',
        $type: 'color',
        $description: 'MCP input_required — paused for user input',
      },
      done: {
        $value: '{colors.accentGreen}',
        $type: 'color',
        $description: 'MCP completed — successfully finished',
      },
      error: {
        $value: '{colors.accentRed}',
        $type: 'color',
        $description: 'MCP failed — terminal error',
      },
      cancelled: {
        $value: '{colors.textMuted}',
        $type: 'color',
        $description: 'MCP cancelled — explicitly stopped',
      },
    },
  },
  tool: {
    status: {
      pending: {
        $value: '{colors.textMuted}',
        $type: 'color',
        $description: 'Tool call not yet dispatched',
      },
      running: {
        $value: '{colors.accentBlue}',
        $type: 'color',
        $description: 'Tool call in progress',
      },
      done: {
        $value: '{colors.accentGreen}',
        $type: 'color',
        $description: 'Tool call completed successfully',
      },
      error: { $value: '{colors.accentRed}', $type: 'color', $description: 'Tool call failed' },
    },
  },
  stream: {
    cursor: {
      $value: '{colors.accentBlue}',
      $type: 'color',
      $description: 'StreamingText blinking cursor color',
    },
  },
  message: {
    user: {
      bg: {
        $value: '{colors.bgElevated}',
        $type: 'color',
        $description: 'User message bubble background',
      },
    },
    assistant: {
      bg: {
        $value: '{colors.bgSurface}',
        $type: 'color',
        $description: 'Assistant message bubble background',
      },
    },
    tool: {
      bg: {
        $value: '{colors.bgElevated}',
        $type: 'color',
        $description: 'Tool result bubble background',
      },
      border: {
        $value: '{colors.borderSubtle}',
        $type: 'color',
        $description: 'Tool result bubble border',
      },
    },
  },
})
export const spacing = Object.freeze({
  '1': { $value: '4px', $type: 'dimension' },
  '2': { $value: '8px', $type: 'dimension' },
  '3': { $value: '12px', $type: 'dimension' },
  '4': { $value: '16px', $type: 'dimension' },
  '5': { $value: '20px', $type: 'dimension' },
  '6': { $value: '24px', $type: 'dimension' },
  '8': { $value: '32px', $type: 'dimension' },
  '10': { $value: '40px', $type: 'dimension' },
  '12': { $value: '48px', $type: 'dimension' },
  '16': { $value: '64px', $type: 'dimension' },
})
export const fonts = Object.freeze({
  mono: {
    $value: '"JetBrains Mono", "Fira Code", Menlo, monospace',
    $type: 'fontFamily',
    $description: 'Monospaced font for code and technical content',
  },
  sans: {
    $value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    $type: 'fontFamily',
    $description: 'System sans-serif for body and UI text',
  },
  heading: {
    $value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    $type: 'fontFamily',
    $description: 'Font for headings (alias to sans)',
  },
  body: {
    $value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    $type: 'fontFamily',
    $description: 'Font for body text (alias to sans)',
  },
})
export const fontSizes = Object.freeze({
  xs: { $value: '0.75rem', $type: 'dimension' },
  sm: { $value: '0.875rem', $type: 'dimension' },
  md: { $value: '1rem', $type: 'dimension' },
  lg: { $value: '1.125rem', $type: 'dimension' },
  xl: { $value: '1.25rem', $type: 'dimension' },
  '2xl': { $value: '1.5rem', $type: 'dimension' },
})
export const fontWeights = Object.freeze({
  normal: { $value: '400', $type: 'fontWeight' },
  medium: { $value: '500', $type: 'fontWeight' },
  semibold: { $value: '600', $type: 'fontWeight' },
  bold: { $value: '700', $type: 'fontWeight' },
})
export const durations = Object.freeze({
  fast: {
    $value: '100ms',
    $type: 'duration',
    $description: 'Micro-interactions and hover state transitions',
  },
  normal: { $value: '200ms', $type: 'duration', $description: 'Standard UI transitions' },
  slow: { $value: '400ms', $type: 'duration', $description: 'Deliberate or complex transitions' },
  stream: {
    blink: {
      $value: '1000ms',
      $type: 'duration',
      $description: 'StreamingText cursor blink cycle',
    },
    thinking: {
      $value: '1200ms',
      $type: 'duration',
      $description: 'ThinkingIndicator dot pulse cycle',
    },
  },
})
export const lineHeights = Object.freeze({
  tight: { $value: '1.25', $type: 'dimension', $description: 'Compact line spacing for headings' },
  base: { $value: '1.5', $type: 'dimension', $description: 'Body text line spacing' },
  relaxed: {
    $value: '1.75',
    $type: 'dimension',
    $description: 'Loose spacing for readability-heavy content',
  },
})
export const radii = Object.freeze({
  sm: { $value: '4px', $type: 'dimension' },
  md: { $value: '8px', $type: 'dimension' },
  lg: { $value: '12px', $type: 'dimension' },
  full: {
    $value: '9999px',
    $type: 'dimension',
    $description: 'Pill / fully-rounded shape — badges, chips',
  },
})
export const shadows = Object.freeze({
  sm: {
    $value: '0 1px 3px rgba(0, 0, 0, 0.4)',
    $type: 'shadow',
    $description: 'Subtle elevation — tooltips, chips',
  },
  md: {
    $value: '0 4px 12px rgba(0, 0, 0, 0.5)',
    $type: 'shadow',
    $description: 'Standard elevation — cards, dropdowns',
  },
  lg: {
    $value: '0 8px 24px rgba(0, 0, 0, 0.6)',
    $type: 'shadow',
    $description: 'High elevation — modals, drawers',
  },
})
export const zIndex = Object.freeze({
  dropdown: { $value: 1000, $type: 'number', $description: 'Dropdown menus' },
  sticky: {
    $value: 1100,
    $type: 'number',
    $description: 'Sticky headers and position:sticky elements',
  },
  overlay: { $value: 1200, $type: 'number', $description: 'Overlay backdrops' },
  modal: { $value: 1300, $type: 'number', $description: 'Modal dialogs' },
  tooltip: { $value: 1400, $type: 'number', $description: 'Tooltips — must appear above modals' },
})

export function getCSSVariables(): string {
  return [
    '[data-agentic-ds] {',
    // Colors and surfaces
    `  --ds-color-surface-base: ${colors.bgBase.$value};  `,
    `  --ds-color-surface-default: ${colors.bgSurface.$value};  `,
    `  --ds-color-surface-elevated: ${colors.bgElevated.$value};  `,
    `  --ds-color-border-subtle: ${colors.borderSubtle.$value};  `,
    `  --ds-color-text-primary: ${colors.textPrimary.$value};  `,
    `  --ds-color-text-muted: ${colors.textMuted.$value};  `,
    `  --ds-color-accent-interactive: ${colors.accentBlue.$value};  `,
    `  --ds-color-accent-success: ${colors.accentGreen.$value};  `,
    `  --ds-color-accent-warning: ${colors.accentAmber.$value};  `,
    `  --ds-color-accent-danger: ${colors.accentRed.$value};  `,
    `  --ds-color-text-on-accent: ${colors.bgBase.$value};  `,
    // Agent lifecycle states
    `  --ds-color-agent-status-idle: ${colors.textMuted.$value};  `,
    `  --ds-color-agent-status-running: ${colors.accentBlue.$value};  `,
    `  --ds-color-agent-status-waiting: ${colors.accentAmber.$value};  `,
    `  --ds-color-agent-status-done: ${colors.accentGreen.$value};  `,
    `  --ds-color-agent-status-error: ${colors.accentRed.$value};  `,
    `  --ds-color-agent-status-cancelled: ${colors.textMuted.$value};  `,
    // Tool call states
    `  --ds-color-tool-status-pending: ${colors.textMuted.$value};  `,
    `  --ds-color-tool-status-running: ${colors.accentBlue.$value};  `,
    `  --ds-color-tool-status-done: ${colors.accentGreen.$value};  `,
    `  --ds-color-tool-status-error: ${colors.accentRed.$value};  `,
    // Streaming
    `  --ds-color-stream-cursor: ${colors.accentBlue.$value};  `,
    // Message roles
    `  --ds-color-message-user-bg: ${colors.bgElevated.$value};  `,
    `  --ds-color-message-assistant-bg: ${colors.bgSurface.$value};  `,
    `  --ds-color-message-tool-bg: ${colors.bgElevated.$value};  `,
    `  --ds-color-message-tool-border: ${colors.borderSubtle.$value};  `,
    // Step tints
    `  --ds-color-surface-step-active: ${stepTints.active.dark.$value};  `,
    `  --ds-color-surface-step-complete: ${stepTints.complete.dark.$value};  `,
    `  --ds-color-surface-step-waiting: ${stepTints.waiting.dark.$value};  `,
    // Spacing
    `  --ds-space-1: ${spacing[1].$value};  `,
    `  --ds-space-2: ${spacing[2].$value};  `,
    `  --ds-space-3: ${spacing[3].$value};  `,
    `  --ds-space-4: ${spacing[4].$value};  `,
    `  --ds-space-5: ${spacing[5].$value};  `,
    `  --ds-space-6: ${spacing[6].$value};  `,
    `  --ds-space-8: ${spacing[8].$value};  `,
    `  --ds-space-10: ${spacing[10].$value};  `,
    `  --ds-space-12: ${spacing[12].$value};  `,
    `  --ds-space-16: ${spacing[16].$value};  `,
    // Typography
    `  --ds-font-mono: ${fonts.mono.$value};  `,
    `  --ds-font-sans: ${fonts.sans.$value};  `,
    `  --ds-font-size-xs: ${fontSizes.xs.$value};  `,
    `  --ds-font-size-sm: ${fontSizes.sm.$value};  `,
    `  --ds-font-size-md: ${fontSizes.md.$value};  `,
    `  --ds-font-size-lg: ${fontSizes.lg.$value};  `,
    `  --ds-font-size-xl: ${fontSizes.xl.$value};  `,
    `  --ds-font-size-2xl: ${fontSizes['2xl'].$value};  `,
    `  --ds-font-weight-normal: ${fontWeights.normal.$value};  `,
    `  --ds-font-weight-medium: ${fontWeights.medium.$value};  `,
    `  --ds-font-weight-semibold: ${fontWeights.semibold.$value};  `,
    `  --ds-font-weight-bold: ${fontWeights.bold.$value};  `,
    `  --ds-line-height-tight: ${lineHeights.tight.$value};  `,
    `  --ds-line-height-base: ${lineHeights.base.$value};  `,
    `  --ds-line-height-relaxed: ${lineHeights.relaxed.$value};  `,
    // Motion
    `  --ds-duration-fast: ${durations.fast.$value};  `,
    `  --ds-duration-normal: ${durations.normal.$value};  `,
    `  --ds-duration-slow: ${durations.slow.$value};  `,
    `  --ds-duration-stream-blink: ${durations.stream.blink.$value};  `,
    `  --ds-duration-stream-thinking: ${durations.stream.thinking.$value};  `,
    // Radius
    `  --ds-radius-sm: ${radii.sm.$value};  `,
    `  --ds-radius-md: ${radii.md.$value};  `,
    `  --ds-radius-lg: ${radii.lg.$value};  `,
    `  --ds-radius-full: ${radii.full.$value};  `,
    // Shadows
    `  --ds-shadow-sm: ${shadows.sm.$value};  `,
    `  --ds-shadow-md: ${shadows.md.$value};  `,
    `  --ds-shadow-lg: ${shadows.lg.$value};  `,
    // Z-index
    `  --ds-z-index-dropdown: ${zIndex.dropdown.$value};  `,
    `  --ds-z-index-sticky: ${zIndex.sticky.$value};  `,
    `  --ds-z-index-overlay: ${zIndex.overlay.$value};  `,
    `  --ds-z-index-modal: ${zIndex.modal.$value};  `,
    `  --ds-z-index-tooltip: ${zIndex.tooltip.$value};  `,
    '}',
    '',
    '@media (prefers-color-scheme: light) {',
    '  [data-agentic-ds] {',
    `    --ds-color-surface-base: ${lightColors.bgBase.$value};  `,
    `    --ds-color-surface-default: ${lightColors.bgSurface.$value};  `,
    `    --ds-color-surface-elevated: ${lightColors.bgElevated.$value};  `,
    `    --ds-color-border-subtle: ${lightColors.borderSubtle.$value};  `,
    `    --ds-color-text-primary: ${lightColors.textPrimary.$value};  `,
    `    --ds-color-text-muted: ${lightColors.textMuted.$value};  `,
    `    --ds-color-accent-interactive: ${lightColors.accentBlue.$value};  `,
    `    --ds-color-accent-success: ${lightColors.accentGreen.$value};  `,
    `    --ds-color-accent-warning: ${lightColors.accentAmber.$value};  `,
    `    --ds-color-accent-danger: ${lightColors.accentRed.$value};  `,
    `    --ds-color-text-on-accent: ${lightColors.onAccent.$value};  `,
    `    --ds-color-agent-status-idle: ${lightColors.textMuted.$value};  `,
    `    --ds-color-agent-status-running: ${lightColors.accentBlue.$value};  `,
    `    --ds-color-agent-status-waiting: ${lightColors.accentAmber.$value};  `,
    `    --ds-color-agent-status-done: ${lightColors.accentGreen.$value};  `,
    `    --ds-color-agent-status-error: ${lightColors.accentRed.$value};  `,
    `    --ds-color-agent-status-cancelled: ${lightColors.textMuted.$value};  `,
    `    --ds-color-tool-status-pending: ${lightColors.textMuted.$value};  `,
    `    --ds-color-tool-status-running: ${lightColors.accentBlue.$value};  `,
    `    --ds-color-tool-status-done: ${lightColors.accentGreen.$value};  `,
    `    --ds-color-tool-status-error: ${lightColors.accentRed.$value};  `,
    `    --ds-color-stream-cursor: ${lightColors.accentBlue.$value};  `,
    `    --ds-color-message-user-bg: ${lightColors.bgElevated.$value};  `,
    `    --ds-color-message-assistant-bg: ${lightColors.bgSurface.$value};  `,
    `    --ds-color-message-tool-bg: ${lightColors.bgElevated.$value};  `,
    `    --ds-color-message-tool-border: ${lightColors.borderSubtle.$value};  `,
    `    --ds-color-surface-step-active: ${stepTints.active.light.$value};  `,
    `    --ds-color-surface-step-complete: ${stepTints.complete.light.$value};  `,
    `    --ds-color-surface-step-waiting: ${stepTints.waiting.light.$value};  `,
    '  }',
    '}',
  ].join('\n')
}

export const tokens = Object.freeze({
  colors,
  lightColors,
  stepTints,
  semanticColors,
  spacing,
  fonts,
  fontSizes,
  fontWeights,
  durations,
  lineHeights,
  radii,
  shadows,
  zIndex,
})
export default tokens
