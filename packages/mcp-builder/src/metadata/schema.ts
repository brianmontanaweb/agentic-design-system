// Shape of the component metadata served by get_component. The data itself
// lives in components.ts, generated from docs/components/*.md — see
// scripts/generate.ts for the spec-doc format contract.

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

/** Token usage by group (colors, radius, …), or 'all' for the token resolution root. */
export type TokensUsage = Record<string, string[]> | 'all'

export interface ComponentDef {
  name: string
  package: '@agentic-ds/core' | '@agentic-ds/agents'
  category: string
  status: string
  wcag: string
  /** ARIA pattern URL; absent when the spec doc declares n/a. */
  ariaPattern?: string
  /** Design tokens the component consumes; absent when the spec doc declares n/a. */
  tokens?: TokensUsage
  description: string
  props: Record<string, PropDef>
  types?: Record<string, TypeDef>
  /** Requirement bullets from the spec doc's Accessibility section. */
  ariaNotes?: string
}
