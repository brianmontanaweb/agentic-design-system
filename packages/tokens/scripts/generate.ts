// Generate src/generated.ts from tokens.dtcg.json
// Run with: tsx scripts/generate.ts

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tokensPath = path.join(__dirname, '../tokens.dtcg.json')
const outputPath = path.join(__dirname, '../src/generated.ts')

interface TokenNode {
  $value?: string | number
  $type?: string
  $description?: string
  [key: string]: any
}

interface ResolveContext {
  allTokens: Map<string, TokenNode>
}

function flattenForAliasResolution(
  obj: TokenNode,
  prefix: string,
  result: Map<string, TokenNode>
): void {
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'object' && val !== null) {
      if (val.$value !== undefined) {
        result.set(path, val)
      } else {
        flattenForAliasResolution(val, path, result)
      }
    }
  }
}

function resolveAlias(value: string, ctx: ResolveContext): string {
  if (!value.startsWith('{') || !value.endsWith('}')) {
    return value
  }
  const ref = value.slice(1, -1)
  const token = ctx.allTokens.get(ref)
  if (token && token.$value !== undefined) {
    return String(token.$value)
  }
  return value
}

function tokenToCode(token: TokenNode, ctx: ResolveContext): string {
  // Keep DTCG alias notation as-is; don't resolve {group.key} references
  // Resolution happens in theme.ts for semantic token system
  const value = token.$value !== undefined ? String(token.$value) : ''
  const jsonValue = typeof token.$value === 'number' ? token.$value : `'${value}'`
  const desc = token.$description ? `, $description: '${token.$description}'` : ''
  return `{ $value: ${jsonValue}, $type: '${token.$type}'${desc} }`
}

function groupToCode(group: TokenNode, ctx: ResolveContext, indent: number): string {
  const lines: string[] = ['{']
  const ind = ' '.repeat(indent)
  const entries = Object.entries(group).filter(([k]) => !k.startsWith('$'))

  for (const [key, val] of entries) {
    if (typeof val === 'object' && val !== null) {
      // Quote keys that aren't valid identifiers (e.g., "2xl")
      const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`
      if (val.$value !== undefined) {
        lines.push(`  ${ind}${quotedKey}: ${tokenToCode(val, ctx)},`)
      } else {
        lines.push(`  ${ind}${quotedKey}: ${groupToCode(val, ctx, indent + 2)},`)
      }
    }
  }
  lines.push(`${ind}}`)
  return lines.join('\n')
}

// Read tokens.dtcg.json
const tokenData = JSON.parse(fs.readFileSync(tokensPath, 'utf-8')) as Record<string, TokenNode>

// Flatten for alias resolution
const allTokens = new Map<string, TokenNode>()
for (const [key, val] of Object.entries(tokenData)) {
  flattenForAliasResolution(val, key, allTokens)
}
const ctx: ResolveContext = { allTokens }

// Generate index exports
const exports: string[] = []
const groups = Object.entries(tokenData).filter(([key]) => key !== '$schema')

for (const [name, group] of groups) {
  const code = groupToCode(group, ctx, 2)
  exports.push(`export const ${name} = Object.freeze(${code})`)
}

// Generate tokens re-export
const tokenExport = `
export const tokens = Object.freeze({
  ${groups.map(([name]) => name).join(',\n  ')},
})
export default tokens
`

// Assemble full file
const fullCode = [
  `// Auto-generated from tokens.dtcg.json — do not edit directly`,
  `// Run \`npm run tokens:generate\` to regenerate`,
  ``,
  ...exports,
  ``,
  getCSSVariablesTemplate(tokenData),
  tokenExport,
].join('\n')

fs.writeFileSync(outputPath, fullCode)
console.log(`✓ Generated ${outputPath}`)

function getCSSVariablesTemplate(tokens: TokenNode): string {
  // Generate getCSSVariables by iterating tokens
  // Note: CSS variable names use a consistent mapping
  // (e.g., colors.bgBase → --ds-color-surface-base)
  // Update this function when new tokens are added in Phase 2

  const cssLines: string[] = []

  // Helper to add a variable
  function addVar(name: string, value: string) {
    cssLines.push(`    \`  --ds-${name}: ${value};  \`,`)
  }

  // Helper to resolve token references
  function getTokenValue(path: string): string {
    const parts = path.split('.')
    let current: any = tokens
    for (const part of parts) {
      current = current[part]
      if (!current) return ''
    }
    return current.$value || ''
  }

  return `export function getCSSVariables(): string {
  return [
    '[data-agentic-ds] {',
    // Colors and surfaces
    \`  --ds-color-surface-base: \${colors.bgBase.$value};  \`,
    \`  --ds-color-surface-default: \${colors.bgSurface.$value};  \`,
    \`  --ds-color-surface-elevated: \${colors.bgElevated.$value};  \`,
    \`  --ds-color-border-subtle: \${colors.borderSubtle.$value};  \`,
    \`  --ds-color-text-primary: \${colors.textPrimary.$value};  \`,
    \`  --ds-color-text-muted: \${colors.textMuted.$value};  \`,
    \`  --ds-color-accent-interactive: \${colors.accentBlue.$value};  \`,
    \`  --ds-color-accent-success: \${colors.accentGreen.$value};  \`,
    \`  --ds-color-accent-warning: \${colors.accentAmber.$value};  \`,
    \`  --ds-color-accent-danger: \${colors.accentRed.$value};  \`,
    \`  --ds-color-text-on-accent: \${colors.bgBase.$value};  \`,
    // Agent lifecycle states
    \`  --ds-color-agent-status-idle: \${colors.textMuted.$value};  \`,
    \`  --ds-color-agent-status-running: \${colors.accentBlue.$value};  \`,
    \`  --ds-color-agent-status-waiting: \${colors.accentAmber.$value};  \`,
    \`  --ds-color-agent-status-done: \${colors.accentGreen.$value};  \`,
    \`  --ds-color-agent-status-error: \${colors.accentRed.$value};  \`,
    \`  --ds-color-agent-status-cancelled: \${colors.textMuted.$value};  \`,
    // Tool call states
    \`  --ds-color-tool-status-pending: \${colors.textMuted.$value};  \`,
    \`  --ds-color-tool-status-running: \${colors.accentBlue.$value};  \`,
    \`  --ds-color-tool-status-done: \${colors.accentGreen.$value};  \`,
    \`  --ds-color-tool-status-error: \${colors.accentRed.$value};  \`,
    // Streaming
    \`  --ds-color-stream-cursor: \${colors.accentBlue.$value};  \`,
    // Message roles
    \`  --ds-color-message-user-bg: \${colors.bgElevated.$value};  \`,
    \`  --ds-color-message-assistant-bg: \${colors.bgSurface.$value};  \`,
    \`  --ds-color-message-tool-bg: \${colors.bgElevated.$value};  \`,
    \`  --ds-color-message-tool-border: \${colors.borderSubtle.$value};  \`,
    // Step tints
    \`  --ds-color-surface-step-active: \${stepTints.active.dark.$value};  \`,
    \`  --ds-color-surface-step-complete: \${stepTints.complete.dark.$value};  \`,
    \`  --ds-color-surface-step-waiting: \${stepTints.waiting.dark.$value};  \`,
    // Spacing
    \`  --ds-space-1: \${spacing[1].$value};  \`,
    \`  --ds-space-2: \${spacing[2].$value};  \`,
    \`  --ds-space-3: \${spacing[3].$value};  \`,
    \`  --ds-space-4: \${spacing[4].$value};  \`,
    \`  --ds-space-5: \${spacing[5].$value};  \`,
    \`  --ds-space-6: \${spacing[6].$value};  \`,
    \`  --ds-space-8: \${spacing[8].$value};  \`,
    \`  --ds-space-10: \${spacing[10].$value};  \`,
    \`  --ds-space-12: \${spacing[12].$value};  \`,
    \`  --ds-space-16: \${spacing[16].$value};  \`,
    // Typography
    \`  --ds-font-mono: \${fonts.mono.$value};  \`,
    \`  --ds-font-sans: \${fonts.sans.$value};  \`,
    \`  --ds-font-size-xs: \${fontSizes.xs.$value};  \`,
    \`  --ds-font-size-sm: \${fontSizes.sm.$value};  \`,
    \`  --ds-font-size-md: \${fontSizes.md.$value};  \`,
    \`  --ds-font-size-lg: \${fontSizes.lg.$value};  \`,
    \`  --ds-font-size-xl: \${fontSizes.xl.$value};  \`,
    \`  --ds-font-size-2xl: \${fontSizes['2xl'].$value};  \`,
    \`  --ds-font-weight-normal: \${fontWeights.normal.$value};  \`,
    \`  --ds-font-weight-medium: \${fontWeights.medium.$value};  \`,
    \`  --ds-font-weight-semibold: \${fontWeights.semibold.$value};  \`,
    \`  --ds-font-weight-bold: \${fontWeights.bold.$value};  \`,
    \`  --ds-line-height-tight: \${lineHeights.tight.$value};  \`,
    \`  --ds-line-height-base: \${lineHeights.base.$value};  \`,
    \`  --ds-line-height-relaxed: \${lineHeights.relaxed.$value};  \`,
    // Motion
    \`  --ds-duration-fast: \${durations.fast.$value};  \`,
    \`  --ds-duration-normal: \${durations.normal.$value};  \`,
    \`  --ds-duration-slow: \${durations.slow.$value};  \`,
    \`  --ds-duration-stream-blink: \${durations.stream.blink.$value};  \`,
    \`  --ds-duration-stream-thinking: \${durations.stream.thinking.$value};  \`,
    // Radius
    \`  --ds-radius-sm: \${radii.sm.$value};  \`,
    \`  --ds-radius-md: \${radii.md.$value};  \`,
    \`  --ds-radius-lg: \${radii.lg.$value};  \`,
    \`  --ds-radius-full: \${radii.full.$value};  \`,
    // Shadows
    \`  --ds-shadow-sm: \${shadows.sm.$value};  \`,
    \`  --ds-shadow-md: \${shadows.md.$value};  \`,
    \`  --ds-shadow-lg: \${shadows.lg.$value};  \`,
    // Z-index
    \`  --ds-z-index-dropdown: \${zIndex.dropdown.$value};  \`,
    \`  --ds-z-index-sticky: \${zIndex.sticky.$value};  \`,
    \`  --ds-z-index-overlay: \${zIndex.overlay.$value};  \`,
    \`  --ds-z-index-modal: \${zIndex.modal.$value};  \`,
    \`  --ds-z-index-tooltip: \${zIndex.tooltip.$value};  \`,
    '}',
    '',
    '@media (prefers-color-scheme: light) {',
    '  [data-agentic-ds] {',
    \`    --ds-color-surface-base: \${lightColors.bgBase.$value};  \`,
    \`    --ds-color-surface-default: \${lightColors.bgSurface.$value};  \`,
    \`    --ds-color-surface-elevated: \${lightColors.bgElevated.$value};  \`,
    \`    --ds-color-border-subtle: \${lightColors.borderSubtle.$value};  \`,
    \`    --ds-color-text-primary: \${lightColors.textPrimary.$value};  \`,
    \`    --ds-color-text-muted: \${lightColors.textMuted.$value};  \`,
    \`    --ds-color-accent-interactive: \${lightColors.accentBlue.$value};  \`,
    \`    --ds-color-accent-success: \${lightColors.accentGreen.$value};  \`,
    \`    --ds-color-accent-warning: \${lightColors.accentAmber.$value};  \`,
    \`    --ds-color-accent-danger: \${lightColors.accentRed.$value};  \`,
    \`    --ds-color-text-on-accent: \${lightColors.onAccent.$value};  \`,
    \`    --ds-color-agent-status-idle: \${lightColors.textMuted.$value};  \`,
    \`    --ds-color-agent-status-running: \${lightColors.accentBlue.$value};  \`,
    \`    --ds-color-agent-status-waiting: \${lightColors.accentAmber.$value};  \`,
    \`    --ds-color-agent-status-done: \${lightColors.accentGreen.$value};  \`,
    \`    --ds-color-agent-status-error: \${lightColors.accentRed.$value};  \`,
    \`    --ds-color-agent-status-cancelled: \${lightColors.textMuted.$value};  \`,
    \`    --ds-color-tool-status-pending: \${lightColors.textMuted.$value};  \`,
    \`    --ds-color-tool-status-running: \${lightColors.accentBlue.$value};  \`,
    \`    --ds-color-tool-status-done: \${lightColors.accentGreen.$value};  \`,
    \`    --ds-color-tool-status-error: \${lightColors.accentRed.$value};  \`,
    \`    --ds-color-stream-cursor: \${lightColors.accentBlue.$value};  \`,
    \`    --ds-color-message-user-bg: \${lightColors.bgElevated.$value};  \`,
    \`    --ds-color-message-assistant-bg: \${lightColors.bgSurface.$value};  \`,
    \`    --ds-color-message-tool-bg: \${lightColors.bgElevated.$value};  \`,
    \`    --ds-color-message-tool-border: \${lightColors.borderSubtle.$value};  \`,
    \`    --ds-color-surface-step-active: \${stepTints.active.light.$value};  \`,
    \`    --ds-color-surface-step-complete: \${stepTints.complete.light.$value};  \`,
    \`    --ds-color-surface-step-waiting: \${stepTints.waiting.light.$value};  \`,
    '  }',
    '}',
  ].join('\\n')
}`
}
