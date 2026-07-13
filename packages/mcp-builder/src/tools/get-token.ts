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
import type { TextToolResult } from './get-component.js'

interface TokenEntry {
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

// Color tokens carry both mode values in one entry (paths like
// "color.accent.interactive"); every other group is mode-independent.
const colorEntries: TokenEntry[] = Object.entries(colorModes).map(([path, token]) => ({
  path,
  value: `${token.dark} (dark) / ${token.light} (light)`,
  type: token.$type,
  description: token.$description,
}))

const allTokens: TokenEntry[] = [
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

export function handleGetToken(args: { name: string }): TextToolResult {
  const query = args.name.toLowerCase().trim()
  const results = allTokens.filter((t) => t.path.toLowerCase().includes(query))

  if (results.length === 0) {
    const categories = [
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
    ]
    return {
      content: [
        {
          type: 'text' as const,
          text: [
            `No tokens found matching "${args.name}".`,
            ``,
            `Available categories: ${categories.join(', ')}`,
            ``,
            `Examples: "accent.interactive", "agent.status", "spacing.4", "durations.fast"`,
          ].join('\n'),
        },
      ],
    }
  }

  const lines = results.map((t) => {
    const desc = t.description ? `  // ${t.description}` : ''
    return `${t.path}: ${t.value} (${t.type})${desc}`
  })

  return {
    content: [
      {
        type: 'text' as const,
        text: [
          `Found ${results.length} token${results.length === 1 ? '' : 's'} matching "${args.name}":`,
          ``,
          ...lines,
        ].join('\n'),
      },
    ],
  }
}
