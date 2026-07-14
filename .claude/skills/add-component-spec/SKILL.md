---
name: add-component-spec
context: fork
description: Creates the colocated <ComponentName>.doc.ts spec next to an existing component's source — a typed ComponentDoc object with token inventory, props, and accessibility requirements with WCAG SC references. Use when a component is missing its doc, when documenting a component, or as step 4 of the /add-component flow.
---

# Add Component Spec Doc

Create the spec doc given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

- **The tokens field requires active scanning** — extract every semantic token string from the source style props (any quoted dotted name in a Chakra style prop that is not `#`-hex) and list each in the matching `tokens.*` array. Do not write the list from memory.
- **Every prop in the `export interface` block goes in `props`** — including string-literal-key props like `'aria-label'?: string`.
- **Use exact TypeScript types in `props`** — `Record<string, unknown>` is not `object`; unions list all members.
- **The doc is real TypeScript, not markdown** — `packages/mcp-builder/scripts/generate.ts` imports it directly to build the MCP server's component metadata. There is no parse contract to satisfy; `tsc` and `eslint` are the only gates. Step 4's regeneration only fails if the file doesn't type-check as `ComponentDoc` or a required field is missing.
- **No approval gate** — creating one doc is the whole task; proceed without asking.

---

## Step 1 — Locate the component source

```sh
ls packages/core/src/<ComponentName>/<ComponentName>.tsx packages/agents/src/<ComponentName>/<ComponentName>.tsx 2>/dev/null
```

If no output, **stop immediately** and respond:

```
## No source: <ComponentName>

Neither package contains `<ComponentName>`. Create it first with
`/add-component-source <ComponentName>` (source only) or `/add-component <ComponentName>` (full scaffold).
```

Infer the package (`core` or `agents`) from which path exists.

## Step 2 — Read context

Skip anything already in context from earlier in this conversation:

- The component source file — props interface, variants, states, ARIA attributes, token usage
- `packages/core/src/Button/Button.doc.ts` — the `ComponentDoc` shape to follow
- `packages/component-doc/src/index.ts` — the authoritative `ComponentDoc`/`PropDoc`/`TypeDoc` interfaces
- If `packages/<package>/src/<ComponentName>/<ComponentName>.doc.ts` already exists, **stop** and suggest `/update-component <ComponentName>` instead — spec drift is that skill's job.

## Step 3 — Create the spec doc

File: `packages/<package>/src/<ComponentName>/<ComponentName>.doc.ts`

```ts
import type { ComponentDoc } from '@agentic-ds/component-doc'

export const doc: ComponentDoc = {
  name: '<ComponentName>',
  package: '@agentic-ds/<package>',
  category: '<category>',
  status: 'implemented',
  wcag: 'AA',
  ariaPattern: '<URL to WAI-ARIA APG pattern, or omit entirely if none>',
  tokens: {
    colors: ['<list semantic tokens used>'],
    radius: ['<list if component uses radius tokens>'],
    duration: ['<list if animated>'],
    fonts: ['<list if component uses font tokens>'],
  },
  description: '<one paragraph — becomes the MCP description>',
  props: {
    /* one entry per prop in the exported Props interface, e.g.: */
    variant: {
      type: '"solid" | "outline"',
      required: false,
      default: '"solid"',
      description: 'Visual style',
    },
  },
  // types: only when a prop's type is a named union or structural type not
  // spelled out inline (e.g. `Step[]`) — see ProgressSteps.doc.ts for both
  // a structural type (`Step`) and an enum (`StepStatus`).
  ariaNotes: ['<one WCAG requirement per array entry>'].join('\n'),
  // bestPractices: do/don't guidance as prose (no embedded code) — omit
  // the field entirely if the component has none worth stating.
  // notes: free-form markdown for anything structural that doesn't fit a
  // typed field above (size/state tables, implementation notes, sources).
  // Omit entirely if there's nothing left over.
}
```

Reference file for the full shape in practice, including `types`, `bestPractices`, and `notes`: `packages/core/src/Button/Button.doc.ts`.

- `tokens` is omitted entirely (not present as a key) when the component uses no tokens, or set to `'all'` for the token-resolution root (`AgenticProvider`).
- `ariaPattern` is omitted entirely when there is no applicable WAI-ARIA pattern — do not write `'n/a'` as a string.
- A prop's `required` is a literal `true`/`false` — set it directly from whether the TS prop is optional (`?`) in the source interface.
- `ariaNotes` becomes the MCP server's accessibility section — one WCAG requirement per line, joined with `\n`.
- **Every string in the file is checked by `no-restricted-syntax`** — raw hex colors, `rgb()`/`hsl()`/`oklch()` calls, and literal `ms`/`s` timing values are banned even inside prose in `notes` or `bestPractices` descriptions (e.g. write "a near-zero duration" instead of `"0.01ms"`, or drop a parenthetical value entirely). Fix these by rewording — never add an `eslint-disable` comment.

## Step 4 — Regenerate MCP metadata

From the repo root:

```sh
npm run metadata:generate -w packages/mcp-builder
```

This imports every `packages/{core,agents}/src/**/*.doc.ts` and rebuilds `packages/mcp-builder/src/metadata/components.ts`. If it fails, either the new file doesn't export `doc`, or a duplicate component `name` exists — fix the doc file, never the generated file. Include the regenerated file in the same commit as the doc (CI diffs it).

Also run `npm run lint -w packages/<package>` — this is what actually catches a `ComponentDoc` shape mismatch (tsc) and token-usage violations (eslint) before metadata generation ever runs.

Theming: both light and dark schemes are supported via the semantic tokens listed in `tokens` — `notes` only needs a theming callout when the component introduced **new** semantic tokens (name them and state that each carries `_dark` and `_light` values) or has scheme-specific contrast considerations (e.g. text on accent backgrounds — see `color.text.on.accent` in `theme.ts`).

## Step 5 — Report

```
## Spec doc created: <ComponentName>

**File:** packages/<package>/src/<ComponentName>/<ComponentName>.doc.ts
**Tokens:** <counts per category>
**Props documented:** <count>
**MCP metadata:** regenerated (<N> components)
```

To score this run against known test cases, see `evals/evals.json`.
