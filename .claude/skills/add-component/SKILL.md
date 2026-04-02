---
name: add-component
description: Scaffold a new component in the correct package with source file, Storybook story, spec doc, and index export. Use when adding a new component to @agentic-ds/core or @agentic-ds/agents.
argument-hint: "<ComponentName> [core|agents]"
---

# Add Component

Scaffold a new component given `$ARGUMENTS` in the format `<ComponentName> [core|agents]`.

If the package is not specified, infer it:
- Agent-lifecycle, streaming, messaging, or tool-call components → `agents`
- General-purpose UI primitives → `core`

## Steps

### 1. Read existing conventions

Before writing any code:
- Read `docs/best-practices.md` in full
- Read `packages/<package>/src/index.ts` to understand the current export pattern
- Read one existing component in the target package to understand the code style
- Read `docs/components/Button.md` to understand the spec doc format

### 2. Create the component source file

File: `packages/<package>/src/<ComponentName>.tsx`

Requirements (all are MUST):
- Functional component, named export (no default export)
- Export the props interface alongside the component: `export interface <ComponentName>Props { ... }`
- All color values MUST reference Chakra semantic tokens — no hardcoded hex
- All timing values MUST reference `duration.*` tokens from `@agentic-ds/tokens`
- If the component displays status or live-updating content, it MUST include the correct ARIA live region:
  - Sequential content (streaming text, message thread) → `role="log"` + `aria-live="polite"` + `aria-atomic="false"`
  - Status indicators → `role="status"` + `aria-live="polite"`
  - Errors → `role="alert"`
- If the component has interactive expand/collapse, the trigger MUST be a `<button>` with `aria-expanded` + `aria-controls`
- If the component animates, it MUST respect `prefers-reduced-motion` (handled at theme level in AgenticProvider — do not add per-component overrides)
- Animated decorative elements MUST be `aria-hidden="true"`

### 3. Add export to package index

File: `packages/<package>/src/index.ts`

Add:
```ts
export { <ComponentName> } from './<ComponentName>'
export type { <ComponentName>Props } from './<ComponentName>'
```

### 4. Create Storybook story

File: `apps/storybook/src/stories/<ComponentName>.stories.tsx`

Requirements:
- Use `type { Meta, StoryObj }` from `@storybook/react`
- Title format: `'Core/<ComponentName>'` or `'Agents/<ComponentName>'`
- Include a story for every meaningful prop variant and state
- Include a story for every status/state value if the component is stateful
- Do NOT import `React` explicitly (jsx-runtime transform is configured)

### 5. Create component spec doc

File: `docs/components/<ComponentName>.md`

Use the YAML frontmatter format from `docs/components/Button.md`:
```yaml
---
component: <ComponentName>
package: "@agentic-ds/<package>"
category: <category>
status: implemented
tokens:
  colors: [list semantic tokens used]
  duration: [list if animated]
wcag: AA
aria-pattern: <URL to WAI-ARIA APG pattern if applicable>
mcp-states: [list MCP states surfaced, if applicable]
---
```

Body MUST include: description, variants table (if applicable), props table, accessibility requirements with WCAG SC references, do/don't examples. Use MUST/SHOULD/MAY (RFC 2119).

### 6. Build and lint

Run in order:
```sh
npm run build
npm run lint
```

Fix any lint errors before finishing. Do not use `eslint-disable` comments.
