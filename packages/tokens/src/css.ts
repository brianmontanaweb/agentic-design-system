// Derives the [data-agentic-ds]-scoped CSS custom property stylesheet from the
// generated token data. Variable names are mechanical: token paths kebab-joined
// under a per-group prefix, so a new token needs no edits here.

import {
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
} from './generated.js'

// Maps each token group to its CSS variable prefix (--ds-<prefix>-<path>).
const GROUP_PREFIX: Record<string, Record<string, unknown>> = {
  space: spacing,
  font: fonts,
  'font-size': fontSizes,
  'font-weight': fontWeights,
  duration: durations,
  'line-height': lineHeights,
  radius: radii,
  shadow: shadows,
  'z-index': zIndex,
}

function isLeafToken(v: unknown): v is { $value: string | number } {
  return typeof v === 'object' && v !== null && '$value' in v
}

function groupVariables(group: Record<string, unknown>, prefix: string): string[] {
  const lines: string[] = []
  for (const [key, value] of Object.entries(group)) {
    const name = `${prefix}-${key}`
    if (isLeafToken(value)) {
      lines.push(`  --ds-${name}: ${String(value.$value)};`)
    } else if (typeof value === 'object' && value !== null) {
      lines.push(...groupVariables(value as Record<string, unknown>, name))
    }
  }
  return lines
}

function colorVariables(mode: 'dark' | 'light'): string[] {
  return Object.entries(colorModes).map(
    ([path, token]) => `  --ds-${path.replaceAll('.', '-')}: ${token[mode]};`
  )
}

function staticVariables(): string[] {
  return Object.entries(GROUP_PREFIX).flatMap(([prefix, group]) => groupVariables(group, prefix))
}

// Dark is the default scheme. Light applies via the OS preference unless the
// host pins a scheme with data-color-mode="light" | "dark", which always wins.
export function getCSSVariables(): string {
  const dark = colorVariables('dark')
  const light = colorVariables('light')
  return [
    '[data-agentic-ds] {',
    ...dark,
    ...staticVariables(),
    '}',
    '',
    '@media (prefers-color-scheme: light) {',
    '  [data-agentic-ds]:not([data-color-mode="dark"]) {',
    ...light.map((line) => `  ${line}`),
    '  }',
    '}',
    '',
    '[data-agentic-ds][data-color-mode="light"] {',
    ...light,
    '}',
    '',
    '[data-agentic-ds][data-color-mode="dark"] {',
    ...dark,
    '}',
  ].join('\n')
}
