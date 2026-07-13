// Auto-generated from docs/components/*.md — do not edit directly
// Run `npm run metadata:generate` (packages/mcp-builder) to regenerate

import type { ComponentDef } from './schema.js'

export type { ComponentDef, PropDef, TypeDef, TokensUsage } from './schema.js'

export const components: ComponentDef[] = [
  {
    name: 'AgentStatus',
    package: '@agentic-ds/agents',
    category: 'feedback',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#status',
    tokens: {
      colors: [
        'color.agent.status.idle',
        'color.agent.status.running',
        'color.agent.status.waiting',
        'color.agent.status.done',
        'color.agent.status.error',
        'color.agent.status.cancelled',
      ],
    },
    description:
      'Displays the current lifecycle state of an MCP agent as a colored dot paired with a text badge. Announces state changes to screen readers via a visually-hidden phrase.',
    props: {
      status: {
        type: 'AgentStatusValue',
        required: true,
        description: 'Current MCP lifecycle state',
      },
      label: {
        type: 'string',
        required: false,
        description: 'Override display text; falls back to status name',
      },
    },
    types: {
      AgentStatusValue: {
        values: ['idle', 'running', 'waiting', 'done', 'error', 'cancelled'],
        description:
          'All 6 MCP task lifecycle states must be supported. Do not add states outside this set. `waiting` maps to the MCP `input_required` state.',
      },
    },
    ariaNotes:
      'MUST have `role="status"` + `aria-live="polite"` so transitions are announced without interrupting the user. _(WCAG SC 4.1.3)_\nA visually-hidden span MUST contain the full phrase `"Agent status: {label}"` — this is what screen readers announce.\nThe visible badge MUST have `aria-hidden="true"`. The visually-hidden text is the sole SR announcement.\nColor MUST NOT be the only differentiator between states. _(WCAG SC 1.4.1)_ — the visually-hidden text fulfills this requirement for non-visual users; sighted users get the dot + badge label together.\nThe `running` animation MUST respect `prefers-reduced-motion`.',
  },
  {
    name: 'AgenticProvider',
    package: '@agentic-ds/core',
    category: 'provider',
    status: 'implemented',
    wcag: 'AA',
    tokens: 'all',
    description:
      'The root provider for the design system. Every application using `@agentic-ds/core` or `@agentic-ds/agents` MUST render `AgenticProvider` at the top of the component tree.',
    props: {
      children: {
        type: 'ReactNode',
        required: true,
        description: 'Application content to render inside the provider.',
      },
      colorScheme: {
        type: '"dark" | "light" | "system"',
        required: false,
        default: '"dark"',
        description:
          'Controlled color scheme. `"dark"`/`"light"` pin the mode; `"system"` follows the OS `prefers-color-scheme` and live-updates. Hosts toggle by re-rendering the prop.',
      },
      theme: {
        type: 'AgenticTheme',
        required: false,
        default: 'stock theme',
        description:
          'Branded theme created by `defineAgenticTheme()`. Create it once at module scope — never inside render.',
      },
    },
    ariaNotes:
      '`AgenticProvider` MUST be present for all ARIA live regions, semantic tokens, and keyboard focus indicators to function correctly. Do not render agent components outside a provider. _(WCAG SC 1.3.1, 4.1.2)_\n`prefers-reduced-motion` MUST be respected globally — AgenticProvider handles this automatically via the injected `<style>` block. Do not override `animation-duration` or `transition-duration` with `!important` inside components. _(WCAG SC 2.3.3)_\nColor mode MUST NOT be changed without user intent. The `colorScheme` prop is controlled — hold it in host state and update it only from a user-initiated toggle (or pass `"system"` to follow the OS preference the user already expressed).',
  },
  {
    name: 'Button',
    package: '@agentic-ds/core',
    category: 'action',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
    tokens: {
      colors: [
        'accent.blue',
        'accent.red',
        'text.primary',
        'text.muted',
        'bg.elevated',
        'border.subtle',
      ],
      radius: ['radius.md'],
      duration: ['duration.fast', 'duration.normal'],
      fonts: ['font.sans'],
    },
    description:
      'A clickable element that triggers an action or submits a form. The Button is the primary interactive primitive in the design system.',
    props: {
      variant: {
        type: '"solid" | "outline" | "ghost" | "danger"',
        required: false,
        default: '"solid"',
        description: 'Visual style',
      },
      size: {
        type: '"sm" | "md" | "lg"',
        required: false,
        default: '"md"',
        description: 'Height and padding scale',
      },
      disabled: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Prevents interaction; applies disabled state styles',
      },
      loading: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Shows loading indicator; prevents interaction',
      },
      loadingText: {
        type: 'string',
        required: false,
        description: 'SR-only text announced while loading',
      },
      leftIcon: {
        type: 'React.ReactElement',
        required: false,
        description: 'Icon rendered before label; 8px gap',
      },
      rightIcon: {
        type: 'React.ReactElement',
        required: false,
        description: 'Icon rendered after label; 8px gap',
      },
      fullWidth: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Stretches to fill container width',
      },
      type: {
        type: '"button" | "submit" | "reset"',
        required: false,
        default: '"button"',
        description: 'HTML button type',
      },
      onClick: {
        type: 'React.MouseEventHandler',
        required: false,
        description: 'Click handler',
      },
      children: {
        type: 'React.ReactNode',
        required: false,
        description: 'Button label — MUST be present or `aria-label` set',
      },
      'aria-label': {
        type: 'string',
        required: false,
        description: 'Accessible name; required for icon-only buttons',
      },
    },
    ariaNotes:
      'Button MUST have an accessible name from either `children` text content or `aria-label`. An icon-only button with no text MUST have `aria-label`. _(WCAG SC 4.1.2)_\nContrast ratio of label text against background MUST be ≥ 4.5:1 for normal text. _(WCAG SC 1.4.3)_\nFocus indicator MUST have a contrast ratio ≥ 3:1 against adjacent colors. _(WCAG SC 1.4.11, 2.4.11)_\n`Space` and `Enter` MUST both activate the button. _(WAI-ARIA APG Button Pattern)_\nLoading state MUST set `aria-busy="true"` and announce `loadingText` to screen readers via `aria-label` swap or visually-hidden span.\nDo NOT use `role="button"` on a `<div>`. Use `<button>` exclusively.',
  },
  {
    name: 'CodeBlock',
    package: '@agentic-ds/core',
    category: 'content',
    status: 'implemented',
    wcag: 'AA',
    tokens: {
      colors: ['bg.elevated', 'border.subtle', 'text.primary', 'text.muted'],
      radius: ['radius.md'],
      fonts: ['font.mono'],
    },
    description:
      'A styled container for displaying pre-formatted code. Renders an optional language label above a monospaced `<code>` element. CodeBlock is a display primitive — it does not provide syntax highlighting, line numbers, or copy functionality.',
    props: {
      children: {
        type: 'ReactNode',
        required: true,
        description: 'The code content; preserves whitespace via `white-space: pre`.',
      },
      language: {
        type: 'string',
        required: false,
        description:
          'Optional language label rendered above the code block (e.g. `"typescript"`). Not syntax-aware — display only.',
      },
    },
    ariaNotes:
      'Code content is rendered inside a `<code>` element, which carries the implicit ARIA `code` role. This is the correct semantic element for code samples. _(HTML spec)_\nThe language label is rendered as plain text above the code and is readable by assistive technology. It MUST NOT be `aria-hidden` — it provides useful context.\nIf CodeBlock is used to display output that updates dynamically (e.g., streaming tool output), the parent component MUST wrap it in a live region (`role="log"` for sequential content). CodeBlock itself does not provide a live region. _(WCAG SC 4.1.3)_\nColor contrast of code text (`text.primary`) against background (`bg.elevated`) MUST meet ≥ 4.5:1. _(WCAG SC 1.4.3)_',
  },
  {
    name: 'MessageBubble',
    package: '@agentic-ds/agents',
    category: 'display',
    status: 'implemented',
    wcag: 'AA',
    tokens: {
      colors: [
        'color.message.user.bg',
        'color.message.assistant.bg',
        'color.message.tool.bg',
        'color.text.primary',
        'color.text.muted',
        'color.accent.interactive',
        'color.accent.success',
        'color.border.subtle',
      ],
    },
    description:
      'A single message card within a conversation thread. Background color, label color, and default label text vary by sender role.',
    props: {
      sender: {
        type: 'MessageRole',
        required: true,
        description: 'Determines visual treatment',
      },
      content: {
        type: 'React.ReactNode',
        required: true,
        description: 'Message body — text, `<StreamingText>`, `<CodeBlock>`, etc.',
      },
      label: {
        type: 'string',
        required: false,
        description: 'Override sender label; falls back to role default',
      },
      timestamp: {
        type: 'string',
        required: false,
        description: 'Optional timestamp shown in the header row',
      },
    },
    types: {
      MessageRole: {
        values: ['user', 'assistant', 'tool'],
      },
    },
    ariaNotes:
      'The label and timestamp are in the DOM above the content — screen readers encounter them in natural reading order.\nRole differentiation is conveyed by both label text and background color. Color alone is not the sole signal. _(WCAG SC 1.4.1)_\nDo not set `aria-label` on the bubble itself — `MessageThread` (the parent `role="log"`) handles the region label.\nWhen nesting `<StreamingText>` as `content`, do not add an additional `aria-live` region on the bubble — the `StreamingText`\'s own region is sufficient.',
  },
  {
    name: 'MessageThread',
    package: '@agentic-ds/agents',
    category: 'layout',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#log',
    tokens: {
      colors: ['color.border.subtle'],
    },
    description:
      'A scrollable container for a conversation between a user and an agent. New messages are announced to screen readers as they arrive. Optionally auto-scrolls to the latest message.',
    props: {
      children: {
        type: 'React.ReactNode',
        required: true,
        description: 'Sequence of `<MessageBubble>` components',
      },
      maxHeight: {
        type: 'string',
        required: false,
        default: '"600px"',
        description: 'CSS max-height of the scroll container',
      },
      autoScroll: {
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Scrolls to bottom whenever `children` changes',
      },
      'aria-label': {
        type: 'string',
        required: false,
        default: '"Message thread"',
        description: 'Label for the `role="log"` region',
      },
    },
    ariaNotes:
      'MUST have `role="log"` + `aria-live="polite"` + `aria-atomic="false"` so new messages are announced incrementally. _(WCAG SC 4.1.3)_\n`aria-label` MUST be set to a meaningful phrase. Override the default `"Message thread"` when the context is more specific (e.g., `"Agent conversation"`, `"Support chat"`).\n`aria-atomic="false"` ensures screen readers announce only the newly added message rather than reading the entire thread.\nThe scrollable container is the live region; do not wrap children in an additional live region.',
  },
  {
    name: 'ProgressSteps',
    package: '@agentic-ds/agents',
    category: 'navigation',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
    tokens: {
      colors: [
        'color.accent.interactive',
        'color.accent.success',
        'color.accent.warning',
        'color.text.muted',
        'color.text.primary',
        'color.border.subtle',
        'color.surface.step.active',
        'color.surface.step.complete',
        'color.surface.step.waiting',
        'color.surface.elevated',
      ],
    },
    description:
      'A vertical ordered list of steps showing the progress of a multi-stage agent task. Each step reflects one of five statuses that map to MCP lifecycle states.',
    props: {
      steps: {
        type: 'Step[]',
        required: true,
        description: 'Ordered list of steps',
      },
    },
    types: {
      Step: {
        values: ['{ id: string; label: string; status: StepStatus; description?: string }'],
      },
      StepStatus: {
        values: ['pending', 'active', 'complete', 'waiting', 'cancelled'],
      },
    },
    ariaNotes:
      'The outer `VStack` MUST have `role="list"` and each step `role="listitem"`. _(WAI-ARIA list pattern)_\nThe active step MUST have `aria-current="step"`. _(WCAG SC 1.3.1)_\nColor MUST NOT be the only differentiator between states. _(WCAG SC 1.4.1)_ — the step indicator (number, ✓, —) provides a secondary visual signal.\nStep numbers and symbols are rendered inside the dot container; they MUST have sufficient contrast against `bg.step.*` tint backgrounds.',
  },
  {
    name: 'StreamingText',
    package: '@agentic-ds/agents',
    category: 'display',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#log',
    tokens: {
      colors: ['color.text.primary', 'color.stream.cursor'],
      duration: ['duration.stream.blink'],
    },
    description:
      'Renders a growing block of text that is being streamed token-by-token from an agent. A blinking cursor indicates the stream is active. New text is announced incrementally to screen readers.',
    props: {
      text: {
        type: 'string',
        required: true,
        description: 'The full text accumulated so far',
      },
      isStreaming: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Shows blinking cursor when `true`',
      },
      fontSize: {
        type: 'string',
        required: false,
        default: '"sm"',
        description: 'Chakra font size token',
      },
      color: {
        type: 'string',
        required: false,
        default: '"color.text.primary"',
        description: 'Chakra color token for the text',
      },
      'aria-label': {
        type: 'string',
        required: false,
        default: '"Streaming output"',
        description: 'Label for the live region',
      },
    },
    ariaNotes:
      'MUST have `role="log"` + `aria-live="polite"` + `aria-atomic="false"` so screen readers announce only newly appended text, not the full buffer each time. _(WCAG SC 4.1.3)_\nThe blinking cursor MUST have `aria-hidden="true"` — it is decorative and must not be read aloud. _(WCAG SC 1.3.3)_\nCursor animation MUST respect `prefers-reduced-motion`. When active, `animation` is set to `undefined` (cursor remains visible but static).\n`aria-label` MUST describe the region purpose — consumers should override `"Streaming output"` if the context is more specific (e.g., `"Agent reasoning"`).',
  },
  {
    name: 'ThinkingIndicator',
    package: '@agentic-ds/agents',
    category: 'feedback',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/TR/wai-aria-1.2/#status',
    tokens: {
      colors: ['color.accent.interactive', 'color.text.muted'],
      duration: ['duration.stream.thinking'],
    },
    description:
      'Three pulsing dots that indicate an agent is processing. Announces a text label to screen readers; the dots themselves are decorative and hidden from assistive technology.',
    props: {
      label: {
        type: 'string',
        required: false,
        default: '"Thinking"',
        description: 'Text shown alongside dots; announced to SRs',
      },
    },
    ariaNotes:
      'MUST have `role="status"` + `aria-live="polite"` so the label is announced when the component appears. _(WCAG SC 4.1.3)_\nThe inner dot container MUST have `aria-hidden="true"` — dots are decorative and must not be read individually by screen readers.\nThe visible label text is the SR announcement. Do not use a separate visually-hidden span unless the visible label differs from what should be announced.\nAll dot animations MUST respect `prefers-reduced-motion`. When reduced motion is active, `animation` is set to `undefined` and the dots render as static circles.',
  },
  {
    name: 'ToolCallCard',
    package: '@agentic-ds/agents',
    category: 'display',
    status: 'implemented',
    wcag: 'AA',
    ariaPattern: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    tokens: {
      colors: [
        'color.tool.status.pending',
        'color.tool.status.running',
        'color.tool.status.done',
        'color.tool.status.error',
        'color.accent.success',
        'color.accent.danger',
        'color.text.primary',
        'color.text.muted',
        'color.surface.default',
        'color.surface.elevated',
        'color.border.subtle',
      ],
      duration: ['duration.fast', 'duration.pulse'],
    },
    description:
      'Collapsible card that shows a single MCP tool invocation — its name, input payload, and output. The header is a button that toggles the detail panel open or closed.',
    props: {
      toolName: {
        type: 'string',
        required: true,
        description: 'Name of the tool as invoked',
      },
      input: {
        type: 'Record<string, unknown>',
        required: false,
        description: 'Input payload; rendered as formatted JSON',
      },
      output: {
        type: 'string',
        required: false,
        description: 'Tool response string',
      },
      status: {
        type: 'ToolCallStatus',
        required: false,
        default: '"done"',
        description: 'Current invocation state',
      },
      defaultOpen: {
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Initial open state',
      },
    },
    types: {
      ToolCallStatus: {
        values: ['pending', 'running', 'done', 'error'],
      },
    },
    ariaNotes:
      'The expand/collapse trigger MUST be a `<button>` element. _(WAI-ARIA Disclosure Pattern)_\nThe button MUST have `aria-expanded` reflecting the current open state.\nThe button MUST have `aria-controls` pointing to the detail panel\'s `id`.\nThe button MUST have an `aria-label` of `"${toolName} details"` — the visible tool name alone is sufficient but the label scopes the action for screen readers.\nThe chevron character (`▾` / `▸`) MUST have `aria-hidden="true"` — it is a decorative direction indicator.\nThe status dot MUST have `aria-hidden="true"` — it is an animated decorative element.\nVisually-hidden text (`<VisuallyHidden>Status: {label}</VisuallyHidden>`) MUST name the current status so the dot color is never the only state indicator. _(WCAG SC 1.4.1 Use of Color)_\nThe output outcome MUST be named in visually-hidden text (`Tool call failed` / `Tool call succeeded`) — the danger/success text color is never the only outcome indicator. _(WCAG SC 1.4.1 Use of Color)_\nCode blocks (input/output) do not need additional ARIA; `<code>` is semantically sufficient.',
  },
  {
    name: 'useReducedMotion',
    package: '@agentic-ds/core',
    category: 'hook',
    status: 'implemented',
    wcag: 'AA',
    description:
      'A React hook that returns `true` when the user has enabled the "reduce motion" accessibility preference (`prefers-reduced-motion: reduce`). Updates reactively when the OS preference changes at runtime.',
    props: {},
    ariaNotes:
      'When `useReducedMotion()` returns `true`, components MUST NOT play animations that involve motion (translation, scale, rotation). Fades are generally acceptable but SHOULD also be suppressed or shortened. _(WCAG SC 2.3.3)_\nDo NOT use this hook as a substitute for the AgenticProvider CSS rule. Always let the CSS rule suppress CSS animations; reserve this hook for JS-driven motion.\nThis hook returns `false` during SSR. If rendering server-side with animations, ensure hydration does not cause a flash of animated content — prefer CSS-based suppression for SSR scenarios.',
  },
]
