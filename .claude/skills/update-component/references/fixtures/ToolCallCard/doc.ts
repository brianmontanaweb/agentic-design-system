import type { ComponentDoc } from '@agentic-ds/component-doc'

// Fixture with intentional spec drift for update-component evals — do not fix.
export const doc: ComponentDoc = {
  name: 'ToolCallCard',
  package: '@agentic-ds/agents',
  category: 'display',
  status: 'implemented',
  wcag: 'AA',
  // SPEC DRIFT (intentional, for update-component evals): tokens undocumented
  tokens: {},
  description:
    'A collapsible card that displays a single MCP tool call — its name, input, output, and execution status.',
  props: {
    // SPEC DRIFT: one real prop is undocumented here
    toolName: {
      type: 'string',
      required: true,
      description: 'Name of the tool being called',
    },
    input: {
      // SPEC DRIFT: type is looser than the real prop
      type: 'object',
      required: false,
      description: 'Tool input arguments',
    },
    output: {
      type: 'string',
      required: false,
      description: 'Tool output or result',
    },
    status: {
      type: '"pending" | "running" | "done" | "error"',
      required: false,
      default: '"done"',
      description: 'Current execution status',
    },
  },
  types: {
    // SPEC DRIFT: this enumeration is short one member vs. the real status set
    ToolCallStatus: { values: ['running', 'done', 'error'] },
  },
  // SPEC DRIFT: the real component's disclosure-pattern ARIA contract is undocumented here
  ariaNotes: 'Uses a clickable row to expand/collapse the input/output details.',
}
