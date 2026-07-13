import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { handleGetToken } from './tools/get-token.js'
import { handleGetComponent } from './tools/get-component.js'
import { handleSearch } from './tools/search.js'
import type { SearchArgs } from './tools/search.js'

const server = new Server({ name: 'agentic-ds', version: '0.1.0' }, { capabilities: { tools: {} } })

server.setRequestHandler(ListToolsRequestSchema, () => ({
  tools: [
    {
      name: 'get_token',
      description:
        'Look up design token values by name or path. Supports partial matching across colors, spacing, typography, and motion tokens.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description:
              'Token name or partial path to search for (e.g. "accentBlue", "agent.status", "space.4", "duration")',
          },
          dense: {
            type: 'boolean',
            description:
              'Compact "path: value" output with no header, type, or descriptions. Use when saving context tokens.',
          },
        },
        required: ['name'],
      },
    },
    {
      name: 'get_component',
      description:
        'Get props, types, and accessibility notes for components in the Agentic Design System.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description:
              'Component name (e.g. "Button", "AgentStatus", "ToolCallCard"). Pass "*" to list all components.',
          },
          dense: {
            type: 'boolean',
            description:
              'Compact signature-style output (props and union types only, no descriptions or accessibility notes). Use when saving context tokens.',
          },
        },
        required: ['name'],
      },
    },
    {
      name: 'search',
      description:
        'Natural-language search across component descriptions and design token descriptions. Returns ranked matches; follow up with get_component or get_token for full details.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'What you are looking for, in plain words (e.g. "show agent progress", "status colors", "monospace font")',
          },
          kind: {
            type: 'string',
            enum: ['component', 'token', 'all'],
            description: 'Restrict results to components or tokens. Defaults to "all".',
          },
          limit: {
            type: 'number',
            description: 'Maximum results to return (1–50, default 10).',
          },
          dense: {
            type: 'boolean',
            description: 'Names only, no descriptions. Use when saving context tokens.',
          },
        },
        required: ['query'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, (request) => {
  const { name, arguments: args } = request.params

  if (!args || typeof args !== 'object') {
    throw new Error('Missing arguments')
  }

  switch (name) {
    case 'get_token':
      return handleGetToken(args as { name: string; dense?: boolean })
    case 'get_component':
      return handleGetComponent(args as { name: string; dense?: boolean })
    case 'search':
      return handleSearch(args as SearchArgs)
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
