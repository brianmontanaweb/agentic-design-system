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

/**
 * Formats `--ds-<path>` custom property lines for one color mode from any
 * path → { dark, light } map — the stock `colorModes`, or a themed variant
 * produced by `@agentic-ds/core`'s `resolveThemeColors()`. Exported so
 * per-theme static CSS extraction reuses this naming convention instead of
 * re-deriving it.
 */
export function colorModeVariables(
  map: Record<string, { dark: string; light: string }>,
  mode: 'dark' | 'light'
): string[] {
  return Object.entries(map).map(
    ([path, token]) => `  --ds-${path.replaceAll('.', '-')}: ${token[mode]};`
  )
}

function staticVariables(): string[] {
  return Object.entries(GROUP_PREFIX).flatMap(([prefix, group]) => groupVariables(group, prefix))
}

/**
 * Formats the 4-block color-mode cascade (dark default, `prefers-color-scheme:
 * light` media query, explicit `data-color-mode="light"`, explicit
 * `data-color-mode="dark"`) for a path → { dark, light } map under an
 * arbitrary selector. Exported so per-theme static CSS extraction
 * (`@agentic-ds/core`'s `themeToCss()`) reuses the same cascade structure
 * `getCSSVariables()` uses for the stock theme, scoped to a themed selector
 * like `[data-agentic-ds][data-agentic-theme="acme"]` instead.
 */
export function colorSchemeCss(
  selector: string,
  map: Record<string, { dark: string; light: string }>,
  extraBaseLines: string[] = []
): string {
  const dark = colorModeVariables(map, 'dark')
  const light = colorModeVariables(map, 'light')
  return [
    `${selector} {`,
    ...dark,
    ...extraBaseLines,
    '}',
    '',
    '@media (prefers-color-scheme: light) {',
    `  ${selector}:not([data-color-mode="dark"]) {`,
    ...light.map((line) => `  ${line}`),
    '  }',
    '}',
    '',
    `${selector}[data-color-mode="light"] {`,
    ...light,
    '}',
    '',
    `${selector}[data-color-mode="dark"] {`,
    ...dark,
    '}',
  ].join('\n')
}

// Dark is the default scheme. Light applies via the OS preference unless the
// host pins a scheme with data-color-mode="light" | "dark", which always wins.
export function getCSSVariables(): string {
  return colorSchemeCss('[data-agentic-ds]', colorModes, staticVariables())
}
