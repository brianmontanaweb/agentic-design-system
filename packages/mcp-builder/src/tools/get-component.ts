import { components } from '../metadata/components.js'

export function handleGetComponent(args: { name: string }) {
  if (args.name === '*') {
    const list = components
      .map((c) => `${c.name} (${c.package}) — ${c.description}`)
      .join('\n')
    return {
      content: [
        {
          type: 'text' as const,
          text: [`Available components (${components.length} total):`, ``, list].join('\n'),
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

  const lines: string[] = [
    `## ${component.name}`,
    `Package: \`${component.package}\``,
    ``,
    component.description,
    ``,
    `### Props`,
  ]

  for (const [propName, def] of Object.entries(component.props)) {
    const req = def.required
      ? 'required'
      : `optional${def.default ? `, default: ${def.default}` : ''}`
    const desc = def.description ? ` — ${def.description}` : ''
    lines.push(`- **${propName}**: \`${def.type}\` (${req})${desc}`)
  }

  if (component.types && Object.keys(component.types).length > 0) {
    lines.push(``, `### Types`)
    for (const [typeName, def] of Object.entries(component.types)) {
      const vals = def.values.map((v) => `'${v}'`).join(' | ')
      const desc = def.description ? ` — ${def.description}` : ''
      lines.push(`- **${typeName}**: ${vals}${desc}`)
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
