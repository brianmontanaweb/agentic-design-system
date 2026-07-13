import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js'
import { components } from '../metadata/components.js'

// Narrows content to text blocks so callers can read `.text` without casts,
// while inheriting CallToolResult's index signature (required for
// assignability to the SDK's handler result union).
export interface TextToolResult extends CallToolResult {
  content: TextContent[]
}

export function handleGetComponent(args: { name: string; dense?: boolean }): TextToolResult {
  if (args.name === '*') {
    const list = args.dense
      ? components.map((c) => `${c.name} (${c.package})`).join('\n')
      : components.map((c) => `${c.name} (${c.package}) — ${c.description}`).join('\n')
    return {
      content: [
        {
          type: 'text' as const,
          text: args.dense
            ? list
            : [`Available components (${components.length} total):`, ``, list].join('\n'),
        },
      ],
    }
  }

  const query = args.name.toLowerCase()
  const component = components.find((c) => c.name.toLowerCase() === query)

  if (!component) {
    const names = components.map((c) => c.name).join(', ')
    return {
      content: [
        {
          type: 'text' as const,
          text: [
            `Component "${args.name}" not found.`,
            ``,
            `Available: ${names}`,
            ``,
            `Pass "*" to list all components with descriptions.`,
          ].join('\n'),
        },
      ],
    }
  }

  if (args.dense) {
    const lines: string[] = [`${component.name} ${component.package} ${component.category}`]
    const propEntries = Object.entries(component.props)
    if (propEntries.length > 0) {
      const props = propEntries
        .map(([propName, def]) => {
          const opt = def.required ? '' : '?'
          const dflt = def.default ? `=${def.default}` : ''
          return `${propName}${opt}:${def.type}${dflt}`
        })
        .join('; ')
      lines.push(`props: ${props}`)
    }
    if (component.types && Object.keys(component.types).length > 0) {
      const types = Object.entries(component.types)
        .map(([typeName, def]) => `${typeName}=${def.values.join('|')}`)
        .join('; ')
      lines.push(`types: ${types}`)
    }
    return {
      content: [
        {
          type: 'text' as const,
          text: lines.join('\n'),
        },
      ],
    }
  }

  const lines: string[] = [
    `## ${component.name}`,
    `Package: \`${component.package}\` · Category: ${component.category} · WCAG: ${component.wcag}`,
  ]
  if (component.ariaPattern) {
    lines.push(`ARIA pattern: ${component.ariaPattern}`)
  }
  lines.push(``, component.description)

  if (Object.keys(component.props).length > 0) {
    lines.push(``, `### Props`)
    for (const [propName, def] of Object.entries(component.props)) {
      const req = def.required
        ? 'required'
        : `optional${def.default ? `, default: ${def.default}` : ''}`
      const desc = def.description ? ` — ${def.description}` : ''
      lines.push(`- **${propName}**: \`${def.type}\` (${req})${desc}`)
    }
  }

  if (component.types && Object.keys(component.types).length > 0) {
    lines.push(``, `### Types`)
    for (const [typeName, def] of Object.entries(component.types)) {
      const vals = def.values.map((v) => `'${v}'`).join(' | ')
      const desc = def.description ? ` — ${def.description}` : ''
      lines.push(`- **${typeName}**: ${vals}${desc}`)
    }
  }

  if (component.tokens) {
    lines.push(``, `### Tokens`)
    if (component.tokens === 'all') {
      lines.push(`All semantic tokens — this component is the token resolution root.`)
    } else {
      for (const [group, names] of Object.entries(component.tokens)) {
        lines.push(`- **${group}**: ${names.join(', ')}`)
      }
    }
  }

  if (component.ariaNotes) {
    lines.push(``, `### Accessibility`, component.ariaNotes)
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: lines.join('\n'),
      },
    ],
  }
}
