import { components } from '../metadata/components.js'
import { allTokens } from '../metadata/tokens.js'
import type { TextToolResult } from './get-component.js'

// The index signature keeps this comparable with the SDK's untyped
// `Record<string, unknown>` arguments, so index.ts can cast without a
// double assertion (same pattern as TextToolResult).
export interface SearchArgs {
  [key: string]: unknown
  query: string
  kind?: 'component' | 'token' | 'all'
  limit?: number
  dense?: boolean
}

interface SearchHit {
  kind: 'component' | 'token'
  name: string
  detail: string
  score: number
}

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

function terms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1)
}

/** First sentence, capped — search results are summaries, not the full record. */
function snippet(text: string): string {
  const firstSentence = /^.*?[.!?](?:\s|$)/.exec(text)?.[0] ?? text
  const trimmed = firstSentence.trim()
  return trimmed.length > 140 ? `${trimmed.slice(0, 139)}…` : trimmed
}

function scoreComponent(term: string, haystack: ReturnType<typeof componentHaystack>): number {
  let score = 0
  if (haystack.name === term) score += 5
  else if (haystack.name.includes(term)) score += 3
  if (haystack.category.includes(term)) score += 2
  if (haystack.description.includes(term)) score += 2
  if (haystack.propText.includes(term)) score += 1
  if (haystack.ariaNotes.includes(term)) score += 1
  return score
}

function componentHaystack(c: (typeof components)[number]) {
  return {
    name: c.name.toLowerCase(),
    category: c.category.toLowerCase(),
    description: c.description.toLowerCase(),
    propText: Object.entries(c.props)
      .map(([propName, def]) => `${propName} ${def.type} ${def.description ?? ''}`)
      .join(' ')
      .toLowerCase(),
    ariaNotes: (c.ariaNotes ?? '').toLowerCase(),
  }
}

function scoreToken(term: string, path: string, description: string): number {
  let score = 0
  const segments = path.split('.')
  if (segments[segments.length - 1] === term) score += 5
  else if (path.includes(term)) score += 3
  if (description.includes(term)) score += 2
  return score
}

export function handleSearch(args: SearchArgs): TextToolResult {
  const queryTerms = terms(args.query)
  const kind = args.kind ?? 'all'
  const limit = Math.min(Math.max(args.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT)

  const hits: SearchHit[] = []

  if (queryTerms.length > 0) {
    if (kind !== 'token') {
      for (const c of components) {
        const haystack = componentHaystack(c)
        const score = queryTerms.reduce((sum, t) => sum + scoreComponent(t, haystack), 0)
        if (score > 0) {
          hits.push({
            kind: 'component',
            name: `${c.name} (${c.package})`,
            detail: snippet(c.description),
            score,
          })
        }
      }
    }
    if (kind !== 'component') {
      for (const t of allTokens) {
        const path = t.path.toLowerCase()
        const description = (t.description ?? '').toLowerCase()
        const score = queryTerms.reduce((sum, q) => sum + scoreToken(q, path, description), 0)
        if (score > 0) {
          hits.push({
            kind: 'token',
            name: t.path,
            detail: t.description ? `${t.value} — ${snippet(t.description)}` : t.value,
            score,
          })
        }
      }
    }
  }

  hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
  const top = hits.slice(0, limit)

  if (top.length === 0) {
    return {
      content: [
        {
          type: 'text' as const,
          text: [
            `No components or tokens matched "${args.query}".`,
            ``,
            `Try broader terms (e.g. "status", "streaming", "spacing"), or use`,
            `get_component with "*" to list all components.`,
          ].join('\n'),
        },
      ],
    }
  }

  const lines = top.map((h) =>
    args.dense ? `[${h.kind}] ${h.name}` : `[${h.kind}] ${h.name} — ${h.detail}`
  )

  if (args.dense) {
    return {
      content: [{ type: 'text' as const, text: lines.join('\n') }],
    }
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: [
          `Top ${top.length} of ${hits.length} match${hits.length === 1 ? '' : 'es'} for "${args.query}":`,
          ``,
          ...lines,
          ``,
          `Use get_component or get_token for full details on any result.`,
        ].join('\n'),
      },
    ],
  }
}
