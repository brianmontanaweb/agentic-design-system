// Auto-generated from tokens.resolver.json + tokens/*.json — do not edit directly
// Run `npm run tokens:generate` to regenerate

export const colorModes = Object.freeze({
  'color.agent.status.idle': {
    dark: '#8888aa',
    light: '#6666aa',
    $type: 'color',
    $description: 'MCP idle — not started',
  },
  'color.agent.status.running': {
    dark: '#4d9fff',
    light: '#2563eb',
    $type: 'color',
    $description: 'MCP running — actively processing',
  },
  'color.agent.status.waiting': {
    dark: '#f59e0b',
    light: '#d97706',
    $type: 'color',
    $description: 'MCP input_required — paused for user input',
  },
  'color.agent.status.done': {
    dark: '#3dd68c',
    light: '#16a34a',
    $type: 'color',
    $description: 'MCP completed — successfully finished',
  },
  'color.agent.status.error': {
    dark: '#f87171',
    light: '#dc2626',
    $type: 'color',
    $description: 'MCP failed — terminal error',
  },
  'color.agent.status.cancelled': {
    dark: '#8888aa',
    light: '#6666aa',
    $type: 'color',
    $description: 'MCP cancelled — explicitly stopped',
  },
  'color.tool.status.pending': {
    dark: '#8888aa',
    light: '#6666aa',
    $type: 'color',
    $description: 'Tool call not yet dispatched',
  },
  'color.tool.status.running': {
    dark: '#4d9fff',
    light: '#2563eb',
    $type: 'color',
    $description: 'Tool call in progress',
  },
  'color.tool.status.done': {
    dark: '#3dd68c',
    light: '#16a34a',
    $type: 'color',
    $description: 'Tool call completed successfully',
  },
  'color.tool.status.error': {
    dark: '#f87171',
    light: '#dc2626',
    $type: 'color',
    $description: 'Tool call failed',
  },
  'color.stream.cursor': {
    dark: '#4d9fff',
    light: '#2563eb',
    $type: 'color',
    $description: 'StreamingText blinking cursor color',
  },
  'color.message.user.bg': {
    dark: '#1c1c26',
    light: '#f0f0f5',
    $type: 'color',
    $description: 'User message bubble background',
  },
  'color.message.assistant.bg': {
    dark: '#13131a',
    light: '#ffffff',
    $type: 'color',
    $description: 'Assistant message bubble background',
  },
  'color.message.tool.bg': {
    dark: '#1c1c26',
    light: '#f0f0f5',
    $type: 'color',
    $description: 'Tool result bubble background',
  },
  'color.message.tool.border': {
    dark: '#2a2a38',
    light: '#e2e2e8',
    $type: 'color',
    $description: 'Tool result bubble border',
  },
  'color.surface.base': {
    dark: '#0a0a0f',
    light: '#f8f9fa',
    $type: 'color',
    $description: 'Darkest background layer',
  },
  'color.surface.default': {
    dark: '#13131a',
    light: '#ffffff',
    $type: 'color',
    $description: 'Default surface',
  },
  'color.surface.elevated': {
    dark: '#1c1c26',
    light: '#f0f0f5',
    $type: 'color',
    $description: 'Elevated surface — cards, popovers',
  },
  'color.surface.step.active': {
    dark: '#4d9fff22',
    light: '#2563eb22',
    $type: 'color',
    $description: 'Active step background tint — alpha 0x22 ≈ 13% over the step circle background',
  },
  'color.surface.step.complete': {
    dark: '#3dd68c22',
    light: '#16a34a22',
    $type: 'color',
    $description: 'Complete step background tint',
  },
  'color.surface.step.waiting': {
    dark: '#f59e0b22',
    light: '#d9770622',
    $type: 'color',
    $description: 'Waiting step background tint',
  },
  'color.border.subtle': {
    dark: '#2a2a38',
    light: '#e2e2e8',
    $type: 'color',
    $description: 'Low-contrast divider and border',
  },
  'color.text.primary': {
    dark: '#f0f0f5',
    light: '#0a0a0f',
    $type: 'color',
    $description: 'High-contrast body text',
  },
  'color.text.muted': {
    dark: '#8888aa',
    light: '#6666aa',
    $type: 'color',
    $description: 'De-emphasized or secondary text',
  },
  'color.text.on.accent': {
    dark: '#0a0a0f',
    light: '#ffffff',
    $type: 'color',
    $description:
      'Text on accent backgrounds. Dark mode accents are light pastels — white text fails WCAG AA (≈2.7:1), so use near-black (surface.base) for >7:1 contrast',
  },
  'color.accent.interactive': {
    dark: '#4d9fff',
    light: '#2563eb',
    $type: 'color',
    $description: 'Primary interactive accent',
  },
  'color.accent.success': {
    dark: '#3dd68c',
    light: '#16a34a',
    $type: 'color',
    $description: 'Success and done state',
  },
  'color.accent.warning': {
    dark: '#f59e0b',
    light: '#d97706',
    $type: 'color',
    $description: 'Warning and waiting state',
  },
  'color.accent.danger': {
    dark: '#f87171',
    light: '#dc2626',
    $type: 'color',
    $description: 'Error and danger state',
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
  normal: { $value: 400, $type: 'fontWeight' },
  medium: { $value: 500, $type: 'fontWeight' },
  semibold: { $value: 600, $type: 'fontWeight' },
  bold: { $value: 700, $type: 'fontWeight' },
})
export const durations = Object.freeze({
  fast: {
    $value: '100ms',
    $type: 'duration',
    $description: 'Micro-interactions and hover state transitions',
  },
  normal: { $value: '200ms', $type: 'duration', $description: 'Standard UI transitions' },
  slow: { $value: '400ms', $type: 'duration', $description: 'Deliberate or complex transitions' },
  pulse: {
    $value: '1500ms',
    $type: 'duration',
    $description: 'Status indicator pulse cycle (AgentStatus dot, ToolCallCard running state)',
  },
  instant: {
    $value: '0.01ms',
    $type: 'duration',
    $description: 'Effectively-zero duration for prefers-reduced-motion overrides',
  },
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
  tight: { $value: 1.25, $type: 'number', $description: 'Compact line spacing for headings' },
  base: { $value: 1.5, $type: 'number', $description: 'Body text line spacing' },
  relaxed: {
    $value: 1.75,
    $type: 'number',
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

export const tokens = Object.freeze({
  colorModes,
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
