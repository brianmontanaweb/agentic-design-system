import type { ComponentDoc } from '@agentic-ds/component-doc'

// Fixture with intentional spec drift for update-component evals — do not fix.
export const doc: ComponentDoc = {
  name: 'AgentStatus',
  package: '@agentic-ds/agents',
  category: 'feedback',
  status: 'implemented',
  wcag: 'AA',
  tokens: {}, // SPEC DRIFT: empty — should list color.agent.status.* etc.
  description:
    'Displays the current lifecycle state of an agent — an indicator dot paired with a text badge.',
  props: {
    status: {
      type: '"idle" | "running" | "done" | "error"',
      required: true,
      description: 'Current agent lifecycle state',
    },
    label: {
      type: 'string',
      required: false,
      description: 'Override the default state label',
    },
  },
  types: {
    // SPEC DRIFT: this enumeration is short two members vs. the real MCP lifecycle set
    AgentStatusValue: { values: ['idle', 'running', 'done', 'error'] },
  },
  // SPEC DRIFT: the real component's live-region and text-alternative ARIA
  // contract is undocumented here
  ariaNotes: 'The indicator dot uses color to convey state.',
}
