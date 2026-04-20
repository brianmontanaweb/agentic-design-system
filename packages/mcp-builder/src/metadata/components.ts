export interface PropDef {
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface TypeDef {
  values: string[]
  description?: string
}

export interface ComponentDef {
  name: string
  package: '@agentic-ds/core' | '@agentic-ds/agents'
  description: string
  props: Record<string, PropDef>
  types?: Record<string, TypeDef>
  ariaNotes?: string
}

export const components: ComponentDef[] = [
  {
    name: 'Button',
    package: '@agentic-ds/core',
    description: 'General-purpose action button with multiple variants and sizes.',
    props: {
      variant: {
        type: 'ButtonVariant',
        required: false,
        default: "'solid'",
        description: 'Visual style of the button',
      },
      size: {
        type: 'ButtonSize',
        required: false,
        default: "'md'",
        description: 'Size of the button',
      },
      disabled: { type: 'boolean', required: false, default: 'false' },
      loading: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Shows a loading spinner and disables interaction',
      },
      loadingText: { type: 'string', required: false, description: 'Text shown while loading' },
      leftIcon: { type: 'React.ReactElement', required: false },
      rightIcon: { type: 'React.ReactElement', required: false },
      fullWidth: { type: 'boolean', required: false, default: 'false' },
      type: {
        type: "'button' | 'submit' | 'reset'",
        required: false,
        default: "'button'",
      },
      onClick: { type: '(event: React.MouseEvent) => void', required: false },
      children: { type: 'React.ReactNode', required: false },
      'aria-label': { type: 'string', required: false },
    },
    types: {
      ButtonVariant: { values: ['solid', 'outline', 'ghost', 'danger'] },
      ButtonSize: { values: ['sm', 'md', 'lg'] },
    },
  },
  {
    name: 'CodeBlock',
    package: '@agentic-ds/core',
    description: 'Monospace code display block with optional language label.',
    props: {
      children: { type: 'React.ReactNode', required: true },
      language: {
        type: 'string',
        required: false,
        description: 'Optional language label displayed above the code',
      },
    },
  },
  {
    name: 'AgentStatus',
    package: '@agentic-ds/agents',
    description:
      'Status indicator for MCP agent lifecycle states. Supports all 6 MCP task states.',
    props: {
      status: {
        type: 'AgentStatusValue',
        required: true,
        description: 'Current MCP agent state',
      },
      label: {
        type: 'string',
        required: false,
        description: 'Overrides the default status label',
      },
    },
    types: {
      AgentStatusValue: {
        values: ['idle', 'running', 'waiting', 'done', 'error', 'cancelled'],
        description: 'All 6 MCP task lifecycle states. "waiting" maps to input_required.',
      },
    },
    ariaNotes: 'role="status" aria-live="polite". Announces state changes to screen readers.',
  },
  {
    name: 'ThinkingIndicator',
    package: '@agentic-ds/agents',
    description: 'Animated three-dot pulse indicator shown while the agent is processing.',
    props: {
      label: {
        type: 'string',
        required: false,
        default: "'Thinking'",
        description: 'Accessible label and visible text next to the dots',
      },
    },
    ariaNotes: 'role="status" aria-live="polite".',
  },
  {
    name: 'ProgressSteps',
    package: '@agentic-ds/agents',
    description: 'Ordered list of steps showing MCP task progress.',
    props: {
      steps: {
        type: 'Step[]',
        required: true,
        description: 'Array of step objects defining labels and statuses',
      },
    },
    types: {
      Step: {
        values: ['{ id: string; label: string; status: StepStatus; description?: string }'],
        description: 'Individual step definition',
      },
      StepStatus: { values: ['pending', 'active', 'complete', 'waiting', 'cancelled'] },
    },
    ariaNotes: 'role="list". Active step has aria-current="step".',
  },
  {
    name: 'ToolCallCard',
    package: '@agentic-ds/agents',
    description:
      'Collapsible card showing an MCP tool call — name, input JSON, output, and status.',
    props: {
      toolName: {
        type: 'string',
        required: true,
        description: 'Name of the tool that was called',
      },
      input: {
        type: 'Record<string, unknown>',
        required: false,
        description: 'Tool input parameters, rendered as JSON',
      },
      output: { type: 'string', required: false, description: 'Tool output text' },
      status: { type: 'ToolCallStatus', required: false, default: "'done'" },
      defaultOpen: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Whether the card is expanded by default',
      },
    },
    types: {
      ToolCallStatus: { values: ['pending', 'running', 'done', 'error'] },
    },
    ariaNotes:
      'Expand/collapse trigger must be a <button> with aria-expanded and aria-controls.',
  },
  {
    name: 'StreamingText',
    package: '@agentic-ds/agents',
    description: 'Live text display for streaming LLM output with an optional blinking cursor.',
    props: {
      text: { type: 'string', required: true, description: 'The text content to display' },
      isStreaming: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Shows a blinking cursor when true',
      },
      fontSize: { type: 'string', required: false, default: "'sm'" },
      color: { type: 'string', required: false, default: "'text.primary'" },
      'aria-label': { type: 'string', required: false, default: "'Streaming output'" },
    },
    ariaNotes: 'role="log" aria-live="polite" aria-atomic="false".',
  },
  {
    name: 'MessageThread',
    package: '@agentic-ds/agents',
    description:
      'Scrollable container for a sequence of MessageBubble components. Auto-scrolls to the latest message.',
    props: {
      children: {
        type: 'React.ReactNode',
        required: true,
        description: 'MessageBubble components',
      },
      maxHeight: { type: 'string', required: false, default: "'600px'" },
      autoScroll: {
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Automatically scrolls to new messages',
      },
      'aria-label': { type: 'string', required: false, default: "'Message thread'" },
    },
    ariaNotes: 'role="log" with aria-label.',
  },
  {
    name: 'MessageBubble',
    package: '@agentic-ds/agents',
    description: 'Individual message bubble for user, assistant, or tool messages in a thread.',
    props: {
      sender: { type: 'MessageRole', required: true, description: 'Who sent the message' },
      content: { type: 'React.ReactNode', required: true },
      label: {
        type: 'string',
        required: false,
        description: 'Overrides the default role label (User / Assistant / Tool)',
      },
      timestamp: { type: 'string', required: false },
    },
    types: {
      MessageRole: { values: ['user', 'assistant', 'tool'] },
    },
  },
]
