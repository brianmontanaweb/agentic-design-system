---
name: add-component-spec
context: fork
description: Creates the spec doc at docs/components/[ComponentName].md for an existing component — YAML frontmatter with token inventory, props table, accessibility requirements with WCAG SC references. Use when a component is missing its spec doc, when documenting a component, or as step 4 of the /add-component flow.
---

# Add Component Spec Doc

Create the spec doc given `$ARGUMENTS` in the format `<ComponentName>`.

---

## Gotchas

- **The frontmatter token inventory requires active scanning** — extract every semantic token string from the source style props (any quoted dotted name in a Chakra style prop that is not `#`-hex) and list each in the matching `tokens.*` array. Do not write the list from memory.
- **Every prop in the `export interface` block goes in the props table** — including string-literal-key props like `'aria-label'?: string`.
- **Use exact TypeScript types in the props table** — `Record<string, unknown>` is not `object`; unions list all members.
- **The spec doc is machine-parsed** — `packages/mcp-builder/scripts/generate.ts` turns it into the MCP server's component metadata. The format rules in Step 3 are a parse contract, not a style guide; Step 4's regeneration fails loudly if the doc deviates.
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
- `docs/components/Button.md` — the spec doc format to follow
- If `docs/components/<ComponentName>.md` already exists, **stop** and suggest `/update-component <ComponentName>` instead — spec drift is that skill's job.

## Step 3 — Create the spec doc

File: `docs/components/<ComponentName>.md`

Use the YAML frontmatter format from `docs/components/Button.md`:

```yaml
---
component: <ComponentName>
package: '@agentic-ds/<package>'
category: <category>
status: implemented
tokens:
  colors: [list semantic tokens used]
  radius: [list if component uses radius tokens]
  duration: [list if animated]
  fonts: [list if component uses font tokens]
wcag: AA
aria-pattern: <URL to WAI-ARIA APG pattern if applicable>
mcp-states: [list MCP states surfaced, if applicable]
---
```

Body MUST include: description, variants table (if applicable), props table, accessibility requirements with WCAG SC references, do/don't examples. Use MUST/SHOULD/MAY (RFC 2119).

The MCP metadata generator parses the body, so these rules are load-bearing:

- The H1 must equal the frontmatter `component`, which must equal the filename. The single paragraph after the H1 becomes the MCP description.
- `tokens` is `n/a`, `all`, or a map of group → token-name arrays. `aria-pattern` is a URL or `n/a`.
- The `## Props` section contains exactly one `Prop | Type | Default | Description` table — or H3 sub-tables: `### <ComponentName>Props` for the props, plus one `### <TypeName>` (`Field | Type | Default | Description`) per structural type (see `ProgressSteps.md`).
- A prop or field is required iff its description contains `(required)`. Defaults use `—` for none.
- A named union type in the props (e.g. `ToolCallStatus`) must have a body table whose first-column header appears in the type name (e.g. `Status`) and whose first-column cells are all backticked values — that table defines the union members. Opaque types with no such table are allowed.
- `## Accessibility` bullets become the MCP `ariaNotes`.

## Step 4 — Regenerate MCP metadata

From the repo root:

```sh
npm run metadata:generate -w packages/mcp-builder
```

This regenerates `packages/mcp-builder/src/metadata/components.ts` from all spec docs. If it fails, the new doc violates the parse contract — fix the doc, never the generated file. Include the regenerated file in the same commit as the doc (CI diffs it).

Theming: both light and dark schemes are supported via the semantic tokens listed in the frontmatter — the body only needs a theming note when the component introduced **new** semantic tokens (name them and state that each carries `_dark` and `_light` values) or has scheme-specific contrast considerations (e.g. text on accent backgrounds — see `color.text.on.accent` in `theme.ts`).

## Step 5 — Report

```
## Spec doc created: <ComponentName>

**File:** docs/components/<ComponentName>.md
**Frontmatter tokens:** <counts per category>
**Props documented:** <count>
**MCP states:** <list or "n/a">
**MCP metadata:** regenerated (<N> components)
```

To score this run against known test cases, see `evals/evals.json`.
