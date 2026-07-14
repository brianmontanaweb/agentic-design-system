// Shape of a component's colocated <Name>.doc.ts, consumed by
// packages/mcp-builder/scripts/generate.ts to build the metadata served by
// get_component. Lives in its own package (rather than in mcp-builder, where
// this type previously lived as ComponentDef) because a component's doc file
// sits in packages/core or packages/agents, which build before mcp-builder —
// those packages cannot depend on it.

export interface PropDoc {
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface TypeDoc {
  values: string[]
  description?: string
}

/** Token usage by group (colors, radius, …), or 'all' for the token resolution root. */
export type TokensUsage = Record<string, string[]> | 'all'

export interface BestPractice {
  /** true = do, false = don't. */
  guidance: boolean
  description: string
}

export interface ComponentDoc {
  name: string
  package: '@agentic-ds/core' | '@agentic-ds/agents'
  category: string
  status: string
  wcag: string
  /** ARIA pattern URL; omit when not applicable. */
  ariaPattern?: string
  /** Design tokens the component consumes; omit when not applicable. */
  tokens?: TokensUsage
  description: string
  props: Record<string, PropDoc>
  types?: Record<string, TypeDoc>
  /** Accessibility requirement bullets, one requirement per entry. */
  ariaNotes?: string
  /** Do/don't usage guidance, as prose (no embedded code samples). */
  bestPractices?: BestPractice[]
  /** Free-form markdown for content that doesn't fit a structured field
   *  (size/state tables, label-text rules, icon-usage rules, implementation
   *  notes). Carried through verbatim, not parsed. */
  notes?: string
}
