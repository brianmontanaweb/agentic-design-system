// Auto-generated from colocated *.doc.ts files — do not edit directly.
// Run `npm run metadata:generate` (packages/mcp-builder) to regenerate.

import type { ComponentDoc } from '@agentic-ds/component-doc'

export type { ComponentDoc, PropDoc, TypeDoc, TokensUsage } from '@agentic-ds/component-doc'

export const components: ComponentDoc[] = [
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
    bestPractices: [
      {
        guidance: false,
        description: 'Invent statuses outside the MCP lifecycle, e.g. a `"paused"` status.',
      },
      {
        guidance: false,
        description:
          'Override the status token colors inline, e.g. wrapping in `<Box color="red">`.',
      },
    ],
    notes:
      '## States\n\nAll 6 MCP task lifecycle states must be supported. Do not add states outside this set. `waiting` maps to the MCP `input_required` state.\n\n| Status      | Token                          | Meaning                      |\n| ----------- | ------------------------------- | ----------------------------- |\n| `idle`      | `color.agent.status.idle`      | Agent not running            |\n| `running`   | `color.agent.status.running`   | Agent actively processing    |\n| `waiting`   | `color.agent.status.waiting`   | Awaiting input from the user |\n| `done`      | `color.agent.status.done`      | Task completed successfully  |\n| `error`     | `color.agent.status.error`     | Task failed                  |\n| `cancelled` | `color.agent.status.cancelled` | Task stopped by user action  |\n\nThe `running` dot animates with `ds-pulse`. All other states are static. `useReducedMotion()` disables the animation.\n\n## Implementation notes\n\n- Use `color.agent.status.*` semantic tokens — not raw `accent.*` tokens — so the meaning survives palette changes.\n- The `ds-pulse` keyframe is injected by `AgenticProvider` and scoped to `[data-agentic-ds]`.\n- Visually-hidden technique uses `clipPath: inset(50%)` rather than `clip: rect(0,0,0,0)` (the latter is deprecated).\n- The `role="status"` element carries `data-status="<status>"` — a styling/testing hook for host CSS (e.g. Tailwind `data-[status=error]:`) and stable E2E/visual-regression selectors. It is not an ARIA attribute; the visually-hidden phrase remains the accessible source of truth.\n\n## Sources\n\n- [WAI-ARIA 1.2 — status role](https://www.w3.org/TR/wai-aria-1.2/#status)\n- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)\n- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)\n- [Inclusive Components — Live Regions](https://inclusive-components.design/live-regions/)\n',
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
    bestPractices: [
      {
        guidance: false,
        description: 'Hardcode a background color — use the role-driven token instead.',
      },
      {
        guidance: false,
        description: 'Wrap a bubble in its own live region — `MessageThread` already handles this.',
      },
    ],
    notes:
      '## Roles\n\n| Role        | Background token             | Label color                | Default label |\n| ----------- | ------------------------------ | ---------------------------- | ------------- |\n| `user`      | `color.message.user.bg`      | `color.text.muted`         | You           |\n| `assistant` | `color.message.assistant.bg` | `color.accent.interactive` | Assistant     |\n| `tool`      | `color.message.tool.bg`      | `color.accent.success`     | Tool          |\n\n## Implementation notes\n\n- Background and label colors are driven by `roleConfig` — add new roles there rather than conditioning inline.\n- The `content` prop accepts any `React.ReactNode`; compose `StreamingText`, `CodeBlock`, or plain text freely.\n- `timestamp` is not formatted by the component — pass a pre-formatted string (e.g., `"2:34 PM"`).\n\n## Sources\n\n- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)\n- [Inclusive Components — Cards](https://inclusive-components.design/cards/)\n',
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
    bestPractices: [
      {
        guidance: false,
        description: 'Wrap children in another live region — the thread container is already one.',
      },
      {
        guidance: false,
        description: 'Omit `aria-label` when multiple threads exist on the same page.',
      },
    ],
    notes:
      "## Auto-scroll behaviour\n\n`autoScroll` uses a sentinel `<div ref={bottomRef}>` at the end of the list and calls `scrollIntoView({ behavior: 'smooth' })` when `children` changes. Disable it (`autoScroll={false}`) when the user has scrolled up to read history, or wire your own scroll logic.\n\n## Implementation notes\n\n- The custom scrollbar is styled with `-webkit-scrollbar` CSS; the scrollbar thumb uses the `--ds-border-subtle` CSS variable with a hardcoded hex fallback for browsers that don't support CSS variables (acceptable: applies only to a cosmetic scrollbar).\n- `autoScroll` fires on every `children` change via `useEffect`; if children updates are very frequent, consider debouncing outside the component.\n\n## Sources\n\n- [WAI-ARIA 1.2 — log role](https://www.w3.org/TR/wai-aria-1.2/#log)\n- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)\n- [MDN — aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)\n",
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
        'color.step.pending.dot',
        'color.step.pending.label',
        'color.step.pending.bg',
        'color.step.active.dot',
        'color.step.active.label',
        'color.step.active.bg',
        'color.step.complete.dot',
        'color.step.complete.label',
        'color.step.complete.bg',
        'color.step.waiting.dot',
        'color.step.waiting.label',
        'color.step.waiting.bg',
        'color.step.cancelled.dot',
        'color.step.cancelled.label',
        'color.step.cancelled.bg',
        'color.text.muted',
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
    bestPractices: [
      {
        guidance: false,
        description: 'Use non-unique `id`s across steps — this breaks React reconciliation.',
      },
      {
        guidance: false,
        description: 'Mark more than one step as `active` at the same time.',
      },
    ],
    notes:
      '## Step statuses\n\nEach status maps to a `color.step.<status>.{dot,label,bg}` semantic token triple — the component never reaches for a primitive or a raw accent/surface token directly.\n\n| Status      | Dot border token          | Label token                  | Background token           | Indicator   | Label weight |\n| ----------- | -------------------------- | ----------------------------- | --------------------------- | ----------- | ------------ |\n| `pending`   | `color.step.pending.dot`   | `color.step.pending.label`   | `color.step.pending.bg`    | Step number | normal       |\n| `active`    | `color.step.active.dot`    | `color.step.active.label`    | `color.step.active.bg`     | Step number | medium       |\n| `complete`  | `color.step.complete.dot`  | `color.step.complete.label`  | `color.step.complete.bg`   | ✓ checkmark | normal       |\n| `waiting`   | `color.step.waiting.dot`   | `color.step.waiting.label`   | `color.step.waiting.bg`    | Step number | medium       |\n| `cancelled` | `color.step.cancelled.dot` | `color.step.cancelled.label` | `color.step.cancelled.bg`  | — em-dash   | normal       |\n\n## Implementation notes\n\n- `color.step.{active,complete,waiting}.bg` alias `color.surface.step.*`, which use 8-digit hex (`RRGGBBAA`) for a 13% opacity tint — do not replace with an rgba color function, which would break the semantic token contract.\n- Do not show a connector line between steps in the current implementation — layout relies on `VStack` gap only.\n- The `waiting` status signals `input_required` in the MCP protocol; it is visually distinct from `active` via `color.step.waiting.dot` (aliasing `color.accent.warning`).\n- Each `listitem` carries its own `data-status="<status>"` — a styling/testing hook for host CSS (e.g. Tailwind `data-[status=active]:`) and stable E2E/visual-regression selectors, independent of and in addition to `aria-current`.\n\n## Sources\n\n- [WAI-ARIA — list / listitem roles](https://www.w3.org/TR/wai-aria-1.2/#list)\n- [WCAG 2.2 SC 1.3.1 — Info and Relationships](https://www.w3.org/TR/WCAG22/#info-and-relationships)\n- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)\n- [MCP Protocol — Task Lifecycle States](https://modelcontextprotocol.io/docs/concepts/architecture)\n',
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
    bestPractices: [
      {
        guidance: false,
        description:
          'Wrap StreamingText in another live region — nested live regions behave unpredictably.',
      },
      {
        guidance: false,
        description: 'Pass a raw hex value for `color` — use a semantic token instead.',
      },
    ],
    notes:
      '## Why `aria-live="polite"` and `aria-atomic="false"`\n\n`aria-atomic="false"` instructs screen readers to announce only the DOM nodes that changed since the last render, not the entire region. This is correct for streaming: users hear each new chunk rather than the entire accumulated text repeated. `aria-live="polite"` avoids interrupting the user mid-sentence.\n\n## Implementation notes\n\n- The `text` prop should be the full accumulated string, not a delta. The component does not manage internal buffer state.\n- Cursor is an inline `<span>` colored `color.stream.cursor` with `ds-blink` keyframe (defined by `AgenticProvider`), `w="2px"`, `h="1em"`, `verticalAlign="text-bottom"`. Timing is `duration.stream.blink` — do not hardcode.\n- For very high-frequency streams (sub-frame token intervals), consider debouncing `text` updates in the parent to avoid excessive SR announcements.\n\n## Sources\n\n- [WAI-ARIA 1.2 — log role](https://www.w3.org/TR/wai-aria-1.2/#log)\n- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)\n- [Inclusive Components — Live Regions](https://inclusive-components.design/live-regions/)\n- [MDN — aria-atomic](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-atomic)\n',
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
    bestPractices: [
      {
        guidance: false,
        description:
          'Suppress the label with an empty string — screen readers lose the announcement entirely.',
      },
      {
        guidance: false,
        description:
          'Use ThinkingIndicator for non-agent loading states — prefer a spinner instead.',
      },
    ],
    notes:
      '## Implementation notes\n\n- Each dot staggers its start by an index-based delay multiplier (`i * <per-dot delay>`) using the `ds-pulse` keyframe from `AgenticProvider`.\n- `useReducedMotion()` from `@agentic-ds/core` gates the `animation` prop — when true, animation is `undefined`.\n- Dot color `color.accent.interactive` intentionally matches the `running` state of `AgentStatus` for visual consistency.\n\n## Sources\n\n- [WAI-ARIA 1.2 — status role](https://www.w3.org/TR/wai-aria-1.2/#status)\n- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)\n- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)\n',
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
    bestPractices: [
      {
        guidance: false,
        description:
          'Use a `<div>` with a click handler for the trigger — it must be a `<button>`.',
      },
      {
        guidance: false,
        description:
          'Hardcode a hex value for output color — use the status-driven token instead (`color.accent.danger` for `error`, `color.accent.success` otherwise).',
      },
    ],
    notes:
      "## Statuses\n\n| Status    | Dot color token             | Output text color      | Screen reader label |\n| --------- | ---------------------------- | ------------------------ | -------------------- |\n| `pending` | `color.tool.status.pending` | `color.accent.success` | `pending`           |\n| `running` | `color.tool.status.running` | `color.accent.success` | `running`           |\n| `done`    | `color.tool.status.done`    | `color.accent.success` | `completed`         |\n| `error`   | `color.tool.status.error`   | `color.accent.danger`  | `failed`            |\n\nThe screen reader label is rendered as visually-hidden text (`Status: <label>`) inside the card, alongside the dot — the dot's color is never the only state indicator.\n\nThe `running` status dot animates with `ds-pulse`. `useReducedMotion()` disables the animation.\n\n## Implementation notes\n\n- Content panel ID is generated with React's `useId()` — do not use a hand-written string, as it won't be collision-safe in multi-card views.\n- Input is serialized with `JSON.stringify(input, null, 2)` — the component does not validate or sanitize input structure.\n- Output color is driven by `status`: `error` → `color.accent.danger`, all others → `color.accent.success`.\n- The card's outer container carries `data-status=\"<status>\"` — a styling/testing hook for host CSS (e.g. Tailwind `data-[status=error]:`) and stable E2E/visual-regression selectors. It is not an ARIA attribute; the visually-hidden status text remains the accessible source of truth.\n\n## Sources\n\n- [WAI-ARIA APG — Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)\n- [WCAG 2.2 SC 4.1.2 — Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)\n- [MDN — `<details>` / `<summary>` vs. button disclosure](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)\n",
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
      injectStyles: {
        type: 'boolean',
        required: false,
        default: 'true',
        description:
          "Set `false` for CSP-strict documents (`style-src` without `unsafe-inline`) that link the built stylesheet (`@agentic-ds/mcp-builder/iife/css`) instead of relying on the provider's inline `<style>` keyframes.",
      },
    },
    ariaNotes:
      '`AgenticProvider` MUST be present for all ARIA live regions, semantic tokens, and keyboard focus indicators to function correctly. Do not render agent components outside a provider. _(WCAG SC 1.3.1, 4.1.2)_\n`prefers-reduced-motion` MUST be respected globally — AgenticProvider handles this automatically via the injected `<style>` block. Do not override `animation-duration` or `transition-duration` with `!important` inside components. _(WCAG SC 2.3.3)_\nColor mode MUST NOT be changed without user intent. The `colorScheme` prop is controlled — hold it in host state and update it only from a user-initiated toggle (or pass `"system"` to follow the OS preference the user already expressed).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Create themes with `defineAgenticTheme()` at module scope — calling it during render rebuilds the entire style system on every update.',
      },
      {
        guidance: true,
        description:
          'Override semantic status colors (`color.agent.status.*`, `color.tool.status.*`, `color.accent.success/warning/danger`) only via the `colors` option, and only with equivalent-meaning hues — `accent` and `neutralWarmth` deliberately leave them untouched because their hue carries meaning.',
      },
      {
        guidance: true,
        description:
          'Give each theme a `name` when providers with different themes coexist on one page — unnamed themes all scope to `[data-agentic-ds]` and collide.',
      },
      {
        guidance: true,
        description: 'Render exactly one `AgenticProvider` at the application root.',
      },
      {
        guidance: false,
        description:
          'Nest one `AgenticProvider` inside another — this produces duplicate token scopes and undefined token resolution behavior.',
      },
      {
        guidance: false,
        description:
          'Render design system components without a provider ancestor — their semantic tokens will not resolve.',
      },
      {
        guidance: false,
        description:
          'Import `ChakraProvider` from `@chakra-ui/react` or `system` from `@agentic-ds/core` directly — both are banned by the `no-restricted-imports` lint rule; use `AgenticProvider` and `defineAgenticTheme()` instead.',
      },
    ],
    notes:
      "## Theming — `defineAgenticTheme()`\n\n`defineAgenticTheme(options)` is the sanctioned branding extension point. It builds a complete Chakra system from the stock semantic tokens plus the requested adjustments, and returns an opaque `AgenticTheme` handle for the `theme` prop. Importing the Chakra `system` directly remains banned by lint.\n\n### Options\n\n| Option          | Type                                            | Effect                                                                                                                                                                                                                   |\n| --------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| `accent`        | `string \\| { dark?: string; light?: string }`   | Hex color for `color.accent.interactive` (buttons, focus rings, links). `color.text.on.accent` is re-derived per mode by WCAG contrast unless overridden.                                                                |\n| `neutralWarmth` | `number` (−1 … 1)                               | Parametric OKLCH tint of the neutral tokens (`color.surface.*`, `color.border.subtle`, `color.text.primary/muted`). Positive = warm amber cast, negative = cool blue. Lightness — and therefore contrast — is preserved. |\n| `colors`        | `Partial<Record<AgenticColorToken, ModeColor>>` | Per-token escape hatch, applied last. Keys are typed semantic token paths (e.g. `'color.stream.cursor'`).                                                                                                                |\n| `name`          | `string` (kebab-case)                           | Scopes the theme's CSS variables to `[data-agentic-ds][data-agentic-theme=\"<name>\"]`. Required only when providers with _different_ themes share a page.                                                                 |\n\nAll hex inputs are validated (`#rgb`/`#rrggbb`); invalid values, unknown token paths, out-of-range warmth, and malformed names throw at theme-creation time.\n\n## CSS scoping contract\n\nThe `[data-agentic-ds]` attribute is the CSS boundary for the entire design system. This attribute MUST NOT be placed on a descendant of another `[data-agentic-ds]` element — nesting two `AgenticProvider` instances produces undefined token resolution behavior.\n\nFor MCP App iframe embedding, the iframe document SHOULD render its own `AgenticProvider` as the outermost element, ensuring the iframe's token scope is fully self-contained.\n\n### CSP-strict embedding\n\nThe provider's default inline `<style>` keyframes are refused under a `style-src` policy without `unsafe-inline`. For those documents, link the built stylesheet (`@agentic-ds/mcp-builder/iife/css`) and pass `injectStyles={false}`.\n\nThe built stylesheet carries the same keyframes and reduced-motion rules plus all `--ds-*` custom properties (both color modes). Chakra's own component styles are unaffected by CSP: in the production IIFE bundle they are inserted via CSSOM `insertRule`, which `style-src` does not restrict. The artifact captures the stock theme only — for a branded CSP-strict embed, call `themeToCss()` (`@agentic-ds/core`) at your own build time with the same options object passed to `defineAgenticTheme()`, and link the result alongside the base stylesheet.\n\n## Animation keyframes\n\nTwo keyframes are injected globally (not scoped to `[data-agentic-ds]`, since `@keyframes` inside selectors requires CSS Nesting support). The `ds-` prefix prevents collisions with host application keyframe names.\n\n| Name       | Used by                                                                | Motion                |\n| ---------- | ------------------------------------------------------------------------ | ---------------------- |\n| `ds-pulse` | `ThinkingIndicator`, `Button` loading dots, `AgentStatus` running dot | Scale + opacity pulse |\n| `ds-blink` | `StreamingText` cursor                                                | Opacity blink         |\n\nComponents reference these by name via the `animation` CSS property, pairing the keyframe name with a duration token and easing, e.g. `ds-pulse ease-in-out infinite`.\n\n### Reduced-motion\n\nUnder `prefers-reduced-motion: reduce`:\n\n- `ds-pulse` and `ds-blink` are redefined as no-ops (static values, no movement).\n- All `animation-duration` and `transition-duration` inside `[data-agentic-ds]` are collapsed to a near-zero value with `!important`.\n\nThis satisfies WCAG 2.2 SC 2.3.3 (Animation from Interactions, AAA) and SC 2.3.1 (Three Flashes or Below Threshold, AA).\n\n## SSR note\n\nWith `colorScheme=\"system\"` during SSR, the first render resolves to dark (no `matchMedia` on the server) and corrects itself after hydration if the OS prefers light.\n\n## Sources\n\n- [Chakra UI v3 — createSystem](https://www.chakra-ui.com/docs/theming/overview)\n- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)\n- [CSS `cssVarsRoot` scoping](https://www.chakra-ui.com/docs/theming/token-reference)\n",
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
    bestPractices: [
      {
        guidance: true,
        description: 'Use the lowest-weight variant that still makes the action clear.',
      },
      {
        guidance: false,
        description: 'Include more than one `solid` button in the same action group in one view.',
      },
      {
        guidance: false,
        description: 'Use `danger` for anything other than irreversible or destructive actions.',
      },
      {
        guidance: false,
        description:
          'Use `ghost` as the sole button in a form — it lacks sufficient affordance on its own.',
      },
      {
        guidance: true,
        description: 'Use sentence case for labels: "Save changes", not "Save Changes" or "SAVE".',
      },
      {
        guidance: true,
        description:
          'Be specific: "Delete project" rather than "Delete" when context is ambiguous.',
      },
      {
        guidance: true,
        description: 'Lead labels with an action verb: "Save", "Send", "Add item".',
      },
      {
        guidance: true,
        description: 'Keep labels under 4 words where possible; never let one wrap to two lines.',
      },
      {
        guidance: false,
        description:
          'Use an ellipsis ("Save…") to imply a confirmation dialog — this is an outdated convention.',
      },
      {
        guidance: true,
        description:
          'Icons should visually reinforce the label, never contradict or replace it, unless `aria-label` is set.',
      },
      {
        guidance: true,
        description: 'Use `leftIcon` for directional actions, e.g. an upload arrow pointing up.',
      },
      {
        guidance: true,
        description:
          'Use `rightIcon` for navigation actions, e.g. a chevron pointing right for "Next".',
      },
      {
        guidance: false,
        description: 'Use both `leftIcon` and `rightIcon` on the same button.',
      },
      {
        guidance: true,
        description: 'Icon-only buttons must have `aria-label` and a tooltip.',
      },
      {
        guidance: false,
        description:
          'Render a `<div role="button">` for a clickable element — use `<button>` exclusively.',
      },
      {
        guidance: false,
        description:
          'Leave a `disabled` button unexplained — pair it with a tooltip or inline hint describing why.',
      },
    ],
    notes:
      '## Variants\n\n| Variant   | Use case                                         | Background    | Border          | Text             |\n| --------- | ------------------------------------------------ | ------------- | --------------- | ---------------- |\n| `solid`   | Primary action per context (one per view max)    | `accent.blue` | none            | white            |\n| `outline` | Secondary action alongside a `solid` button      | transparent   | `border.subtle` | `text.primary`   |\n| `ghost`   | Tertiary or toolbar actions; low visual priority | transparent   | none            | `text.muted`     |\n| `danger`  | Destructive actions (delete, revoke, reset)      | `accent.red`  | none            | `text.on.danger` |\n\n## Sizes\n\n| Size | Height | Padding (x) | Font size | Icon size |\n| ---- | ------ | ----------- | --------- | --------- |\n| `sm` | 28px   | 12px        | `xs`      | 14px      |\n| `md` | 36px   | 16px        | `sm`      | 16px      |\n| `lg` | 44px   | 20px        | `md`      | 18px      |\n\nDefault size: `md`. Touch targets MUST meet WCAG 2.2 SC 2.5.8 minimum of 24×24px (all sizes satisfy this).\n\n## States\n\n| State         | Visual treatment                                                                    |\n| ------------- | ------------------------------------------------------------------------------------ |\n| Default       | Base variant styles                                                                 |\n| Hover         | Lighten/darken background by 10% using opacity                                      |\n| Focus-visible | 2px solid `accent.blue` outline, 2px offset — keyboard only                         |\n| Active        | Scale `0.97`, darken background by 15%                                              |\n| Disabled      | `opacity: 0.4`, `cursor: not-allowed`, no pointer events                            |\n| Loading       | Replace content with `ThinkingIndicator`; preserve button width; `aria-busy="true"` |\n\nFocus ring MUST use `:focus-visible`, not `:focus`, to avoid showing the ring on mouse click.\n\nDisabled state MUST use `aria-disabled="true"` + `tabIndex={0}` rather than the HTML `disabled` attribute — this keeps the button in the tab order so keyboard and screen-reader users can discover it and learn why the action is unavailable.\n\n## Implementation notes\n\n- Extend Chakra UI\'s `Button` recipe via `defineRecipe` in `packages/core/src/theme.ts`. Do not create a new element — wrap Chakra\'s `Button`.\n- Animation timing for hover/active transitions: `duration.fast`.\n- The `loading` prop SHOULD preserve the button\'s current width to prevent layout shift. Achieve this by keeping the label in the DOM with `visibility: hidden` and overlaying the `ThinkingIndicator`.\n- `type="button"` default prevents accidental form submission when the button is inside a `<form>`.\n\n## Sources\n\n- [WAI-ARIA Authoring Practices Guide — Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — keyboard behavior and ARIA requirements\n- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/) — contrast, touch target, and focus indicator criteria\n- [Shopify Polaris — Button](https://polaris.shopify.com/components/actions/button) — variant and usage pattern reference\n- [Google Material Design 3 — Buttons](https://m3.material.io/components/buttons/guidelines) — hierarchy and weight conventions\n- [Radix UI Themes — Button](https://www.radix-ui.com/themes/docs/components/button) — loading and icon patterns\n- [llms.txt specification — Answer.AI / Jeremy Howard, 2024](https://llmstxt.org/) — markdown-first, token-efficient documentation structure\n- [Builder.io — AGENTS.md](https://www.builder.io/blog/agents-md) — agent-readable constraint documentation\n- [Anthropic — Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — structured, explicit specs for LLM consumption\n',
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
    bestPractices: [
      {
        guidance: false,
        description: 'Pass structured content (JSX) as children — use plain text or a string.',
      },
      {
        guidance: false,
        description:
          'Use CodeBlock for prose — use `<Text fontFamily="mono">` for inline code instead.',
      },
      {
        guidance: false,
        description:
          'Wrap live-updating content without a live region — wrap it in a `role="log" aria-live="polite"` container.',
      },
    ],
    notes:
      '## Implementation notes\n\n- The outer `Box` is a `<div>` — not a `<pre>`. The `white-space: pre` behavior comes from the Chakra `Code` component\'s `whiteSpace="pre"` prop rather than the `<pre>` element. For full semantic correctness, a future update MAY wrap the inner `Code` in a `<pre>` element.\n- `language` is display-only. Syntax highlighting SHOULD be added via a separate highlighter (e.g., `highlight.js`, `shiki`) injected as `children`.\n- Overflow is handled with `overflow: auto` on the outer `Box`, so wide code scrolls horizontally rather than wrapping.\n\n## Sources\n\n- [MDN — `<code>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code)\n- [WCAG 2.2 SC 1.4.3 — Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)\n- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)\n',
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
    bestPractices: [
      {
        guidance: true,
        description:
          'Use this hook only for JS-level branching decisions based on the motion preference: conditionally rendering a component, passing a reduced-motion-safe value to a JS animation library (Framer Motion, react-spring), adjusting canvas/WebGL animation frames, or skipping a particle/parallax effect entirely.',
      },
      {
        guidance: false,
        description:
          "Use this hook to disable a CSS animation or transition on a Chakra style prop — AgenticProvider's global CSS rule already collapses those to a near-zero duration automatically.",
      },
      {
        guidance: false,
        description:
          'Forget this hook when using a JS animation library — libraries like framer-motion and react-spring ignore the CSS `prefers-reduced-motion` media query entirely.',
      },
    ],
    notes:
      "## Signature\n\n```ts\nfunction useReducedMotion(): boolean\n```\n\nReturns `true` if `prefers-reduced-motion: reduce` is active, `false` otherwise. Returns `false` during SSR (no `window` access).\n\n## When to use this hook vs AgenticProvider's CSS rule\n\n`AgenticProvider` already injects a global CSS rule that collapses all `animation-duration` and `transition-duration` values inside `[data-agentic-ds]` to a near-zero duration. For CSS-based animations and transitions, this hook is not needed — the global rule handles it automatically. Reach for `useReducedMotion()` only when making a JS-level branching decision: conditionally rendering a component, passing a value to a JS animation library, adjusting canvas/WebGL frame counts, or skipping a decorative particle/parallax effect.\n\n## Sources\n\n- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)\n- [WCAG 2.2 SC 2.3.3 — Animation from Interactions](https://www.w3.org/TR/WCAG22/#animation-from-interactions)\n- [prefers-reduced-motion: Taking a no-motion-first approach — CSS-Tricks](https://css-tricks.com/introduction-reduced-motion-media-query/)\n",
  },
]
