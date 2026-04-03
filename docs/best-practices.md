---
title: Agentic Design System — Best Practices
scope: all packages
last-reviewed: 2026-04-02
sources:
  - https://modelcontextprotocol.io/specification/2025-11-25
  - https://modelcontextprotocol.io/extensions/apps/overview
  - https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html
  - https://www.designtokens.org/tr/2025.10/format/
  - https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
  - https://developers.openai.com/apps-sdk/concepts/ui-guidelines
---

# Agentic Design System — Best Practices

This document is the authoritative reference for standards that apply across all packages in this monorepo. It is written for both human developers and AI agents working on this codebase.

---

## 1. MCP Lifecycle Coverage

### Required Agent States

All status-bearing components (`AgentStatus`, `ProgressSteps`) MUST support all MCP task lifecycle states defined in the [MCP 2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25):

| State | Maps To | Notes |
|---|---|---|
| `idle` | Not started | Default/initial state |
| `running` | `working` | Agent actively processing |
| `waiting` | `input_required` | Agent paused, needs user input |
| `done` | `completed` | Successfully finished |
| `error` | `failed` | Terminal failure |
| `cancelled` | `cancelled` | Explicitly stopped |

`waiting` and `cancelled` are currently missing from `AgentStatus` and `ProgressSteps` — these MUST be added.

### MCP Apps Bundle Target

Components intended for embedding in [MCP App iframes](https://modelcontextprotocol.io/extensions/apps/overview) MUST:

1. Be bundled as a self-contained `iife` via Vite's `lib` mode — not ESM or CJS.
2. Preserve `[data-agentic-ds]` CSS scoping so styles do not leak into the host iframe.
3. Provide a plain-text fallback for every UI interaction (the spec requires meaningful text content even when UI rendering is unavailable).
4. Use the `@modelcontextprotocol/ext-apps` SDK for `postMessage` JSON-RPC communication (`app.callServerTool`, `app.updateModelContext`).

The `packages/mcp-builder` package is responsible for producing this bundle. It is currently unimplemented.

---

## 2. Accessibility (WCAG 2.2 AA — Non-Negotiable)

All components MUST meet [WCAG 2.2 Level AA](https://www.w3.org/WAI/WCAG22/quickref/). The agent-specific components have unique requirements under [SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html).

### Live Region Requirements by Component

#### StreamingText

MUST use [`role="log"`](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23) with `aria-live="polite"` and `aria-atomic="false"`.

```tsx
// CORRECT — live region must exist in DOM before content is populated
<div
  role="log"
  aria-live="polite"
  aria-atomic="false"
  aria-label="Agent response"
>
  {text}
  {streaming && <span aria-hidden="true">▋</span>}
</div>
```

The cursor span MUST be `aria-hidden="true"` — it is decorative. The live region container MUST be mounted before any text is injected; mounting and populating simultaneously causes most screen readers to miss the announcement.

#### ThinkingIndicator

MUST use [`role="status"`](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22) with `aria-live="polite"`. Animated dots MUST be `aria-hidden="true"`. Label MUST be screen-reader-visible.

```tsx
<div role="status" aria-live="polite" aria-label={label ?? 'Agent is thinking'}>
  <span aria-hidden="true">{/* animated dots */}</span>
  <span className="sr-only">{label ?? 'Agent is thinking'}</span>
</div>
```

#### AgentStatus

MUST use `role="status"` with `aria-live="polite"`. Color alone MUST NOT be the only indicator of state ([SC 1.4.1](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)) — always include visually-hidden text.

#### MessageThread

MUST use `role="log"` with an `aria-label`. Represents a sequential stream of messages — `role="log"` is semantically correct per [ARIA23](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23).

#### ToolCallCard (Disclosure Widget)

The expand/collapse trigger MUST be a `<button>` element — never a `div` or `span` with `onClick`. MUST implement the [WAI-ARIA Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/):

```tsx
<button aria-expanded={open} aria-controls={panelId}>
  {toolName}
</button>
<div id={panelId} hidden={!open}>
  {/* content */}
</div>
```

#### ProgressSteps

MUST use `role="list"` on the container. The active step MUST carry `aria-current="step"`.

### prefers-reduced-motion

ALL CSS animations MUST respect `prefers-reduced-motion: reduce`. This MUST be handled at the theme level in `AgenticProvider` — not component by component.

```ts
// In theme.ts — add to globalCss or as a condition
'@media (prefers-reduced-motion: reduce)': {
  '*': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' }
}
```

Components with animations: `ThinkingIndicator` (pulse), `ToolCallCard` running state (pulse), `StreamingText` cursor (blink), `AgentStatus` running dot (pulse).

---

## 3. Design Tokens

### Format: W3C DTCG

All tokens in `packages/tokens` MUST use the [W3C Design Tokens Format Module (2025.10)](https://www.designtokens.org/tr/2025.10/format/) — the first stable standard. This means:

- Token properties use `$` prefix: `$value`, `$type`, `$description`
- Aliases use the `{path.to.token}` reference syntax
- [Style Dictionary v4](https://v4.styledictionary.com/reference/utils/dtcg/) and [Tokens Studio](https://github.com/tokens-studio/sd-transforms) both support this format natively

Current tokens use the pre-DTCG format and SHOULD be migrated.

### Three-Tier Token Architecture

Tokens MUST follow the three-tier model:

| Tier | Naming Pattern | Example | Used In |
|---|---|---|---|
| **Primitive** | `[category].[scale]` | `color.blue.500` | Never directly in components |
| **Semantic** | `[category].[concept].[state]` | `color.agent.status.running` | Components and themes |
| **Component** | `[component].[element].[property]` | `toolCallCard.statusDot.color` | Single-component scope |

Current tokens are hybrid primitives. A formal semantic alias layer MUST be added before new components are built.

### Required Semantic Tokens (Not Yet Implemented)

These tokens MUST be added to `packages/tokens` to replace hardcoded values in components:

```ts
// Agent lifecycle
'color.agent.status.idle'
'color.agent.status.running'
'color.agent.status.waiting'     // MCP input_required
'color.agent.status.done'
'color.agent.status.error'
'color.agent.status.cancelled'   // MCP cancelled

// Tool call lifecycle
'color.tool.status.pending'
'color.tool.status.running'
'color.tool.status.done'
'color.tool.status.error'

// Streaming / generative content
'color.stream.cursor'
'duration.stream.blink'
'duration.stream.thinking'

// Message roles
'color.message.user.bg'
'color.message.assistant.bg'
'color.message.tool.bg'
'color.message.tool.border'

// Step states
'color.step.pending'
'color.step.active'
'color.step.complete'
```

### No Hardcoded Values in Components

Components MUST NOT contain hardcoded color hex values, px values outside of layout, or timing values. Every design decision MUST reference a token.

The `statusColors` record in `ToolCallCard.tsx` is a known violation — it MUST be replaced with semantic token references.

---

## 4. Token Naming Convention

Follow the [EightShapes token naming taxonomy](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676):

**Formula:** `[namespace]-[category]-[concept]-[property]-[variant]-[state]`

- **Namespace:** `ads` (agentic-ds) — prefix for CSS custom properties only, not JS token names
- **Category:** `color`, `font`, `duration`, `radius`, `space`
- **Concept:** the semantic subject (`agent`, `tool`, `message`, `stream`, `step`)
- **Property:** `bg`, `border`, `color`, `size`, `weight`
- **Variant/State:** `user`, `assistant`, `running`, `error`, etc.

Token names communicate **intent**, not raw values. `color.agent.status.running` is correct. `accentBlue` is not — it describes the value, not the purpose.

---

## 5. Component Documentation Standard

Every implemented component MUST have a corresponding spec file at `docs/components/[ComponentName].md`.

Spec files MUST include:

```yaml
---
component: ComponentName
package: "@agentic-ds/[package]"
status: implemented | planned
tokens: [list of tokens used]
wcag: AA
aria-pattern: [URL to WAI-ARIA APG pattern if applicable]
mcp-states: [list of MCP states the component surfaces, if applicable]
---
```

The body MUST include: variants table, props table, accessibility requirements (with WCAG SC references), and do/don't examples.

Spec files are written for LLM consumption — use `MUST`/`SHOULD`/`MAY` (RFC 2119 keywords) for requirements.

Currently missing spec files: `AgentStatus`, `ThinkingIndicator`, `ProgressSteps`, `ToolCallCard`, `StreamingText`, `MessageBubble`, `MessageThread`.

---

## 6. Build & Bundle Targets

| Package | ESM | CJS | `.d.ts` | IIFE | Notes |
|---|---|---|---|---|---|
| `tokens` | ✓ | ✓ | ✓ | — | |
| `core` | ✓ | ✓ | ✓ | — | |
| `agents` | ✓ | ✓ | ✓ | planned | IIFE needed for MCP Apps |
| `mcp-builder` | ✓ | — | ✓ | ✓ | MCP Apps bundle target |

The `mcp-builder` IIFE bundle MUST be self-contained — no external imports, all dependencies inlined.

---

## 7. CSS Scoping Rule

ALL styles MUST be scoped to `[data-agentic-ds]` — never to `:root`. This prevents style leakage when the design system is embedded in a host application or MCP App iframe. This invariant MUST be preserved across all build targets including the IIFE bundle.

---

## 8. Figma MCP Usage

The official [Figma MCP](https://www.figma.com/developers/mcp) is the authoritative design reference for all component work. It MUST be consulted when implementing a new component (`/add-component`) or updating an existing one (`/update-component`).

### Design file organisation

Design files are split by package:

| Package | Figma file |
|---|---|
| `@agentic-ds/core` | Core design file |
| `@agentic-ds/agents` | Agents design file |

### Getting the component node

Component names in Figma do not necessarily match component names in code. The user MUST provide a direct link to the specific Figma component node. A Figma node link looks like:

```
https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>
```

Extract the `fileKey` and `nodeId` from the URL and use the Figma MCP `get_file_nodes` tool to fetch the node:

```
get_file_nodes(fileKey, [nodeId])
```

If the user has not provided a Figma link, ask for it before proceeding:

> Please provide the Figma link for the **\<ComponentName\>** component node so I can extract the design values.

### What to extract

For every component, extract all of the following from the Figma node:

| Category | What to look for |
|---|---|
| **Colors** | Fill, stroke, and background values for every state — map to semantic tokens |
| **Spacing & sizing** | Padding, gap, width, height, border radius, border width |
| **Typography** | Font family, size, weight, line height, letter spacing |
| **State variants** | Every variant defined in the component set (hover, focus, disabled, loading, error, etc.) |
| **MCP lifecycle states** | For status-bearing components: idle, running, waiting, done, error, cancelled |
| **Component props** | Variant property names and their values as defined in the Figma component set |

Extract values by inspecting the node properties returned by the MCP. Prefer the Figma token/variable name over the raw value when Figma variables are in use — these map directly to `@agentic-ds/tokens`.

### Mapping Figma values to tokens

Figma values MUST be mapped to semantic tokens from `packages/tokens/src/index.ts`. Do not use raw hex or px values from Figma directly in component source — always route through a token.

```ts
// CORRECT — map Figma fill value to the semantic token it represents
color: tokens['color.agent.status.running']   // Figma: #6ee7b7

// WRONG — copy the raw value from Figma into the component
color: '#6ee7b7'
```

If a Figma value has no matching token in `packages/tokens/src/index.ts`, a new token MUST be added before the component is implemented. Follow the naming convention in section 4.

### Conflict resolution

If a value in Figma conflicts with the current implementation or an existing token, do not resolve it unilaterally. Present the conflict to the user:

> **Figma conflict — \<ComponentName\>**
>
> | Property | Figma value | Current code value |
> |---|---|---|
> | `color.agent.status.waiting` | `#fbbf24` | `#f59e0b` |
>
> Which value should be treated as correct? Options:
> - **Figma is correct** — update the token and any components that use it
> - **Code is correct** — the Figma file needs updating (flag this to the design team)
> - **Neither** — provide the correct value

Apply the resolution the user specifies. Do not proceed with the rest of the implementation until all conflicts are resolved.

---

## Sources

- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Apps Extension Overview](https://modelcontextprotocol.io/extensions/apps/overview)
- [MCP Apps Blog Post — Jan 2026](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [WCAG 2.2 SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [WAI-ARIA ARIA23: role=log](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23)
- [WAI-ARIA ARIA22: role=status](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)
- [WAI-ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [Accessible Notifications with ARIA Live Regions — Sara Soueidan](https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-1/)
- [W3C DTCG Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/)
- [Style Dictionary v4 DTCG Support](https://v4.styledictionary.com/reference/utils/dtcg/)
- [Naming Tokens in Design Systems — EightShapes](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)
- [OpenAI Apps SDK UI Guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)
- [prefers-reduced-motion — CSS-Tricks](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
