import {
  colors,
  lightColors,
  semanticColors,
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

interface TokenEntry {
  path: string
  value: string
  type: string
  description?: string
}

interface TokenLike {
  $value: string
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
        value: val.$value,
        type: val.$type,
        description: val.$description,
      })
    } else if (typeof val === 'object' && val !== null) {
      entries.push(...flattenTokens(val as Record<string, unknown>, path))
    }
  }
  return entries
}

const allTokens: TokenEntry[] = [
  ...flattenTokens(colors as unknown as Record<string, unknown>, 'colors'),
  ...flattenTokens(lightColors as unknown as Record<string, unknown>, 'lightColors'),
  ...flattenTokens(semanticColors as unknown as Record<string, unknown>, 'semanticColors'),
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

export function handleGetToken(args: { name: string }) {
  const query = args.name.toLowerCase().trim()
  const results = allTokens.filter((t) => t.path.toLowerCase().includes(query))

  if (results.length === 0) {
    const categories = [
      'colors',
      'lightColors',
      'semanticColors',
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
            `Examples: "accentBlue", "agent.status", "spacing.4", "durations.fast"`,
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
