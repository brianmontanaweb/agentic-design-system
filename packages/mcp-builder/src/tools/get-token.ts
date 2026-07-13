import { allTokens, tokenCategories } from '../metadata/tokens.js'
import type { TextToolResult } from './get-component.js'

export function handleGetToken(args: { name: string; dense?: boolean }): TextToolResult {
  const query = args.name.toLowerCase().trim()
  const results = allTokens.filter((t) => t.path.toLowerCase().includes(query))

  if (results.length === 0) {
    return {
      content: [
        {
          type: 'text' as const,
          text: [
            `No tokens found matching "${args.name}".`,
            ``,
            `Available categories: ${tokenCategories.join(', ')}`,
            ``,
            `Examples: "accent.interactive", "agent.status", "spacing.4", "durations.fast"`,
          ].join('\n'),
        },
      ],
    }
  }

  if (args.dense) {
    return {
      content: [
        {
          type: 'text' as const,
          text: results.map((t) => `${t.path}: ${t.value}`).join('\n'),
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
