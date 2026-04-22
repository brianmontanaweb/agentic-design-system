import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { handleGetToken } from './tools/get-token.js'
import { handleGetComponent } from './tools/get-component.js'

const server = new Server({ name: 'agentic-ds', version: '0.1.0' }, { capabilities: { tools: {} } })

server.setRequestHandler(ListToolsRequestSchema, async () => ({
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
        },
        required: ['name'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (!args || typeof args !== 'object') {
    throw new Error('Missing arguments')
  }

  switch (name) {
    case 'get_token':
      return handleGetToken(args as { name: string })
    case 'get_component':
      return handleGetComponent(args as { name: string })
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
