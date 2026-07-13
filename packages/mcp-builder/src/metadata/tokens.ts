// Flattened token index shared by get_token and search. Built once at module
// load from @agentic-ds/tokens exports; color tokens carry both mode values
// in one entry (paths like "color.accent.interactive"), every other group is
// mode-independent.

import {
  colorModes,
  spacing,
  fonts,
  fontSizes,
  fontWeights,
  durations,
  radii,
  lineHeights,
  shadows,
  zIndex,
} from '@agentic-ds/tokens'

export interface TokenEntry {
  path: string
  value: string
  type: string
  description?: string
}

interface TokenLike {
  $value: string | number
  $type: string
  $description?: string
}

function isTokenLike(obj: unknown): obj is TokenLike {
  return typeof obj === 'object' && obj !== null && '$value' in obj && '$type' in obj
}

function flattenTokens(obj: Record<string, unknown>, prefix: string): TokenEntry[] {
  const entries: TokenEntry[] = []
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (isTokenLike(val)) {
      entries.push({
        path,
        value: String(val.$value),
        type: val.$type,
        description: val.$description,
      })
    } else if (typeof val === 'object' && val !== null) {
      entries.push(...flattenTokens(val as Record<string, unknown>, path))
    }
  }
  return entries
}

const colorEntries: TokenEntry[] = Object.entries(colorModes).map(([path, token]) => ({
  path,
  value: `${token.dark} (dark) / ${token.light} (light)`,
  type: token.$type,
  description: token.$description,
}))

export const tokenCategories = [
  'color',
  'spacing',
  'fonts',
  'fontSizes',
  'fontWeights',
  'durations',
  'radii',
  'lineHeights',
  'shadows',
  'zIndex',
] as const

export const allTokens: TokenEntry[] = [
  ...colorEntries,
  ...flattenTokens(spacing as unknown as Record<string, unknown>, 'spacing'),
  ...flattenTokens(fonts as unknown as Record<string, unknown>, 'fonts'),
  ...flattenTokens(fontSizes as unknown as Record<string, unknown>, 'fontSizes'),
  ...flattenTokens(fontWeights as unknown as Record<string, unknown>, 'fontWeights'),
  ...flattenTokens(durations as unknown as Record<string, unknown>, 'durations'),
  ...flattenTokens(radii as unknown as Record<string, unknown>, 'radii'),
  ...flattenTokens(lineHeights as unknown as Record<string, unknown>, 'lineHeights'),
  ...flattenTokens(shadows as unknown as Record<string, unknown>, 'shadows'),
  ...flattenTokens(zIndex as unknown as Record<string, unknown>, 'zIndex'),
]
