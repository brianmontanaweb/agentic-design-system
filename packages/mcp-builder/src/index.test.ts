import { beforeAll, describe, expect, it, vi } from 'vitest'

type Handler = (req: { params: { name: string; arguments: unknown } }) => Promise<unknown>

// Use vi.hoisted so these values are available inside vi.mock factory closures
const capturedHandlers = vi.hoisted(() => new Map<string, Handler>())
const schemas = vi.hoisted(() => ({
  listTools: '__list_tools__',
  callTool: '__call_tool__',
}))

vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: vi.fn().mockImplementation(() => ({
    setRequestHandler: (schema: string, handler: Handler) => {
      capturedHandlers.set(schema, handler)
    },
    connect: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn().mockImplementation(() => ({})),
}))

vi.mock('@modelcontextprotocol/sdk/types.js', () => ({
  ListToolsRequestSchema: schemas.listTools,
  CallToolRequestSchema: schemas.callTool,
}))

function getHandler(key: string): Handler {
  const handler = capturedHandlers.get(key)
  if (!handler) throw new Error(`Handler for "${key}" was not registered`)
  return handler
}

beforeAll(async () => {
  await import('./index.js')
})

describe('ListTools handler', () => {
  it('returns exactly two tools', async () => {
    const result = (await getHandler(schemas.listTools)({ params: { name: '', arguments: {} } })) as {
      tools: unknown[]
    }
    expect(result.tools).toHaveLength(2)
  })

  it('exposes get_token and get_component by name', async () => {
    const result = (await getHandler(schemas.listTools)({ params: { name: '', arguments: {} } })) as {
      tools: { name: string }[]
    }
    const names = result.tools.map((t) => t.name)
    expect(names).toContain('get_token')
    expect(names).toContain('get_component')
  })

  it('each tool has name, description, and inputSchema', async () => {
    const result = (await getHandler(schemas.listTools)({ params: { name: '', arguments: {} } })) as {
      tools: Record<string, unknown>[]
    }
    for (const tool of result.tools) {
      expect(tool.name).toBeTruthy()
      expect(tool.description).toBeTruthy()
      expect(tool.inputSchema).toBeDefined()
    }
  })
})

describe('CallTool handler', () => {
  it('routes get_token and returns a content array', async () => {
    const result = (await getHandler(schemas.callTool)({
      params: { name: 'get_token', arguments: { name: 'space' } },
    })) as { content: { type: string; text: string }[] }
    expect(result.content).toHaveLength(1)
    expect(result.content[0].type).toBe('text')
  })

  it('routes get_component and returns a content array', async () => {
    const result = (await getHandler(schemas.callTool)({
      params: { name: 'get_component', arguments: { name: 'Button' } },
    })) as { content: { type: string; text: string }[] }
    expect(result.content).toHaveLength(1)
    expect(result.content[0].type).toBe('text')
  })

  it('throws for an unknown tool name', async () => {
    await expect(
      getHandler(schemas.callTool)({ params: { name: 'not_a_tool', arguments: {} } }),
    ).rejects.toThrow('Unknown tool: not_a_tool')
  })

  it('throws "Missing arguments" when arguments is null', async () => {
    await expect(
      getHandler(schemas.callTool)({ params: { name: 'get_token', arguments: null } }),
    ).rejects.toThrow('Missing arguments')
  })

  it('throws "Missing arguments" when arguments is a string', async () => {
    await expect(
      getHandler(schemas.callTool)({ params: { name: 'get_token', arguments: 'oops' } }),
    ).rejects.toThrow('Missing arguments')
  })
})
