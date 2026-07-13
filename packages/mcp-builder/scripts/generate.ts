// Generate src/metadata/components.ts from the spec docs in docs/components/.
// Run with: tsx scripts/generate.ts (or `npm run metadata:generate`)
//
// The spec doc is the single source of truth for MCP component metadata (same
// pattern as tokens/scripts/generate.ts). Each doc must follow this contract,
// and generation fails loudly on any deviation:
//
// - YAML frontmatter with `component`, `package`, `category`, `status`, `wcag`;
//   optional `aria-pattern` (URL or `n/a`) and `tokens` (`n/a`, `all`, or a map
//   of group → token-name array).
// - An H1 matching the component name, followed by one intro paragraph — this
//   becomes the description.
// - A `## Props` section containing either a single props table
//   (Prop | Type | Default | Description) or H3 sub-tables: `<Name>Props` for
//   the props, any other H3 defines a structural type from a field table
//   (Field | Type | Default | Description). A prop or field is required iff
//   its description contains "(required)".
// - Named union types referenced in the props (e.g. `ToolCallStatus`) resolve
//   against a body table outside the Props section whose first-column header
//   (e.g. "Status", "Role") appears in the type name and whose first-column
//   cells are all backticked values. Types with no matching table are opaque
//   (e.g. `AgenticTheme`); more than one match fails — disambiguate with an H3
//   sub-table under Props.
// - `## Accessibility` bullets become ariaNotes.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'
import prettier from 'prettier'
import type { ComponentDef, PropDef, TypeDef, TokensUsage } from '../src/metadata/schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.join(__dirname, '..')
const docsDir = path.join(packageRoot, '../../docs/components')
const outputPath = path.join(packageRoot, 'src/metadata/components.ts')

const VALID_PACKAGES = ['@agentic-ds/core', '@agentic-ds/agents'] as const
const REQUIRED_FRONTMATTER = ['component', 'package', 'category', 'status', 'wcag'] as const

function fail(file: string, message: string): never {
  throw new Error(`${file}: ${message}`)
}

// ---- Markdown primitives ----

interface Table {
  headers: string[]
  rows: string[][]
}

interface Section {
  heading: string
  lines: string[]
}

/** Split a markdown table row on unescaped pipes; outer pipes are dropped. */
function splitRow(line: string): string[] {
  const cells: string[] = []
  let current = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '\\' && line[i + 1] === '|') {
      current += '|'
      i++
    } else if (ch === '|') {
      cells.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  cells.push(current)
  return cells.slice(1, -1).map((c) => c.trim())
}

function stripTicks(text: string): string {
  return text.replace(/^`|`$/g, '')
}

/** Extract all tables from a run of lines, ignoring fenced code blocks. */
function parseTables(lines: string[]): Table[] {
  const tables: Table[] = []
  let inFence = false
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence
      i++
      continue
    }
    if (!inFence && line.startsWith('|')) {
      const block: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        block.push(lines[i])
        i++
      }
      if (block.length >= 2 && /^\|(\s*:?-+:?\s*\|)+\s*$/.test(block[1])) {
        tables.push({
          headers: splitRow(block[0]),
          rows: block.slice(2).map(splitRow),
        })
      }
      continue
    }
    i++
  }
  return tables
}

/** First paragraph in a run of lines (before any table, fence, or heading). */
function firstParagraph(lines: string[]): string | undefined {
  const collected: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '') {
      if (collected.length > 0) break
      continue
    }
    if (/^([#|>-]|```|\d+\.)/.test(trimmed)) break
    collected.push(trimmed)
  }
  return collected.length > 0 ? collected.join(' ') : undefined
}

/** Split a document body into H2 sections; `heading: ''` holds the preamble. */
function splitSections(lines: string[]): Section[] {
  const sections: Section[] = [{ heading: '', lines: [] }]
  let inFence = false
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) inFence = !inFence
    if (!inFence && line.startsWith('## ')) {
      sections.push({ heading: line.slice(3).trim(), lines: [] })
    } else {
      sections[sections.length - 1].lines.push(line)
    }
  }
  return sections
}

function splitSubsections(lines: string[]): { name: string; lines: string[] }[] {
  const subs: { name: string; lines: string[] }[] = []
  let inFence = false
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) inFence = !inFence
    if (!inFence && line.startsWith('### ')) {
      subs.push({ name: stripTicks(line.slice(4).trim()), lines: [] })
    } else if (subs.length > 0) {
      subs[subs.length - 1].lines.push(line)
    }
  }
  return subs
}

// ---- Frontmatter ----

interface Frontmatter {
  component: string
  package: (typeof VALID_PACKAGES)[number]
  category: string
  status: string
  wcag: string
  ariaPattern?: string
  tokens?: TokensUsage
}

function parseFrontmatter(file: string, raw: string): { fm: Frontmatter; body: string } {
  const lines = raw.split('\n')
  if (lines[0] !== '---') fail(file, 'must start with YAML frontmatter (---)')
  const end = lines.indexOf('---', 1)
  if (end === -1) fail(file, 'unterminated YAML frontmatter')

  const data: unknown = parseYaml(lines.slice(1, end).join('\n'))
  if (typeof data !== 'object' || data === null) fail(file, 'frontmatter must be a YAML map')
  const fm = data as Record<string, unknown>

  for (const key of REQUIRED_FRONTMATTER) {
    if (typeof fm[key] !== 'string' || fm[key] === '') {
      fail(file, `frontmatter is missing required key "${key}"`)
    }
  }
  const pkg = fm.package as string
  if (!VALID_PACKAGES.includes(pkg as (typeof VALID_PACKAGES)[number])) {
    fail(file, `frontmatter package "${pkg}" must be one of: ${VALID_PACKAGES.join(', ')}`)
  }

  let ariaPattern: string | undefined
  const rawPattern = fm['aria-pattern']
  if (rawPattern !== undefined && rawPattern !== 'n/a') {
    if (typeof rawPattern !== 'string' || !rawPattern.startsWith('http')) {
      fail(file, `frontmatter aria-pattern must be a URL or "n/a", got: ${String(rawPattern)}`)
    }
    ariaPattern = rawPattern
  }

  let tokens: TokensUsage | undefined
  const rawTokens = fm.tokens
  if (rawTokens !== undefined && rawTokens !== 'n/a') {
    if (rawTokens === 'all') {
      tokens = 'all'
    } else if (typeof rawTokens === 'object' && rawTokens !== null) {
      tokens = {}
      for (const [group, value] of Object.entries(rawTokens as Record<string, unknown>)) {
        if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
          fail(file, `frontmatter tokens.${group} must be an array of token names`)
        }
        tokens[group] = value as string[]
      }
    } else {
      fail(file, `frontmatter tokens must be "n/a", "all", or a map of group → token names`)
    }
  }

  return {
    fm: {
      component: fm.component as string,
      package: pkg as (typeof VALID_PACKAGES)[number],
      category: fm.category as string,
      status: fm.status as string,
      wcag: fm.wcag as string,
      ariaPattern,
      tokens,
    },
    body: lines.slice(end + 1).join('\n'),
  }
}

// ---- Props / types ----

const PROP_TABLE_HEADERS = ['prop', 'type', 'default', 'description']
const FIELD_TABLE_HEADERS = ['field', 'type', 'default', 'description']

interface ParsedField extends PropDef {
  name: string
}

function parseDefTable(file: string, context: string, table: Table): ParsedField[] {
  const headers = table.headers.map((h) => h.toLowerCase())
  const isProps = PROP_TABLE_HEADERS.every((h, i) => headers[i] === h)
  const isFields = FIELD_TABLE_HEADERS.every((h, i) => headers[i] === h)
  if (!isProps && !isFields) {
    fail(
      file,
      `${context}: table headers must be "Prop | Type | Default | Description" ` +
        `(or "Field | ...") — got: ${table.headers.join(' | ')}`
    )
  }

  return table.rows.map((cells) => {
    if (cells.length !== 4) {
      fail(file, `${context}: row has ${cells.length} cells, expected 4: ${cells.join(' | ')}`)
    }
    const name = stripTicks(cells[0])
    const type = stripTicks(cells[1])
    if (!name || !type) fail(file, `${context}: row is missing a name or type`)

    const rawDefault = cells[2]
    const def =
      rawDefault === '—' || rawDefault === '-' || rawDefault === ''
        ? undefined
        : stripTicks(rawDefault)

    const required = cells[3].includes('(required)')
    const description = cells[3].replace(/\s*\(required\)/, '').trim() || undefined
    return { name, type, required, default: def, description }
  })
}

function toPropsRecord(fields: ParsedField[]): Record<string, PropDef> {
  const record: Record<string, PropDef> = {}
  for (const { name, ...def } of fields) record[name] = def
  return record
}

/** `{ id: string; label: string; status: StepStatus; description?: string }` */
function toStructuralType(fields: ParsedField[]): string {
  const parts = fields.map((f) => `${f.name}${f.required ? '' : '?'}: ${f.type}`)
  return `{ ${parts.join('; ')} }`
}

/** Named types (e.g. `ToolCallStatus`, `Step[]`) that need a definition. */
function namedTypeCandidates(types: string[]): string[] {
  const names = new Set<string>()
  for (const type of types) {
    const bare = type.replace(/\[\]$/, '')
    if (/^[A-Z][A-Za-z0-9]*$/.test(bare)) names.add(bare)
  }
  return [...names]
}

interface EnumTable {
  header: string
  values: string[]
  description?: string
}

/** Tables whose first column enumerates backticked values, e.g. the Statuses table. */
function collectEnumTables(sections: Section[], skipHeading: string): EnumTable[] {
  const found: EnumTable[] = []
  for (const section of sections) {
    if (section.heading === skipHeading) continue
    for (const table of parseTables(section.lines)) {
      if (table.rows.length === 0) continue
      if (!table.rows.every((r) => /^`[^`]+`$/.test(r[0] ?? ''))) continue
      found.push({
        header: table.headers[0],
        values: table.rows.map((r) => stripTicks(r[0])),
        description: firstParagraph(section.lines),
      })
    }
  }
  return found
}

// ---- Per-file parsing ----

function parseSpecDoc(filePath: string): ComponentDef {
  const file = path.basename(filePath)
  const { fm, body } = parseFrontmatter(file, fs.readFileSync(filePath, 'utf8'))

  if (fm.component !== path.basename(file, '.md')) {
    fail(file, `frontmatter component "${fm.component}" does not match the filename`)
  }

  const bodyLines = body.split('\n')
  const h1Index = bodyLines.findIndex((l) => l.startsWith('# '))
  if (h1Index === -1) fail(file, 'missing H1 heading')
  const h1 = bodyLines[h1Index].slice(2).trim()
  if (h1 !== fm.component) {
    fail(file, `H1 "${h1}" does not match frontmatter component "${fm.component}"`)
  }

  const description = firstParagraph(bodyLines.slice(h1Index + 1))
  if (!description) fail(file, 'missing intro paragraph after the H1 — it becomes the description')

  const sections = splitSections(bodyLines)

  // Props: a single table, or H3 sub-tables (structural types + <Name>Props).
  let props: Record<string, PropDef> = {}
  const types: Record<string, TypeDef> = {}
  const referencedTypes: string[] = []

  const propsSection = sections.find((s) => s.heading === 'Props')
  if (propsSection) {
    const subs = splitSubsections(propsSection.lines)
    if (subs.length > 0) {
      let propsFound = false
      for (const sub of subs) {
        const tables = parseTables(sub.lines)
        if (tables.length !== 1) {
          fail(file, `Props › ${sub.name}: expected exactly one table, found ${tables.length}`)
        }
        const fields = parseDefTable(file, `Props › ${sub.name}`, tables[0])
        if (sub.name === `${fm.component}Props`) {
          props = toPropsRecord(fields)
          propsFound = true
        } else {
          types[sub.name] = { values: [toStructuralType(fields)] }
        }
        referencedTypes.push(...fields.map((f) => f.type))
      }
      if (!propsFound) {
        fail(file, `Props section has H3 sub-tables but none named "${fm.component}Props"`)
      }
    } else {
      const tables = parseTables(propsSection.lines)
      if (tables.length !== 1) {
        fail(file, `Props section must contain exactly one table, found ${tables.length}`)
      }
      const fields = parseDefTable(file, 'Props', tables[0])
      props = toPropsRecord(fields)
      referencedTypes.push(...fields.map((f) => f.type))
    }
  }

  // Resolve named union types against enumerating body tables.
  const enumTables = collectEnumTables(sections, 'Props')
  for (const typeName of namedTypeCandidates(referencedTypes)) {
    if (typeName in types) continue // structural type from an H3 sub-table
    const matches = enumTables.filter((t) =>
      typeName.toLowerCase().includes(t.header.toLowerCase())
    )
    if (matches.length > 1) {
      fail(
        file,
        `type "${typeName}" matches ${matches.length} value tables — ` +
          `disambiguate with an H3 sub-table under Props`
      )
    }
    if (matches.length === 1) {
      types[typeName] = { values: matches[0].values, description: matches[0].description }
    }
    // No match → opaque type (e.g. AgenticTheme, ReactNode); intentionally omitted.
  }

  // Accessibility bullets → ariaNotes.
  const a11ySection = sections.find((s) => s.heading === 'Accessibility')
  let ariaNotes: string | undefined
  if (a11ySection) {
    const bullets = a11ySection.lines.filter((l) => l.startsWith('- '))
    if (bullets.length === 0) fail(file, 'Accessibility section has no requirement bullets')
    ariaNotes = bullets.map((b) => b.slice(2).trim()).join('\n')
  }

  return {
    name: fm.component,
    package: fm.package,
    category: fm.category,
    status: fm.status,
    wcag: fm.wcag,
    ariaPattern: fm.ariaPattern,
    tokens: fm.tokens,
    description,
    props,
    types: Object.keys(types).length > 0 ? types : undefined,
    ariaNotes,
  }
}

// ---- Main ----

async function main(): Promise<void> {
  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
  if (files.length === 0) throw new Error(`no spec docs found in ${docsDir}`)

  const components = files.map((f) => parseSpecDoc(path.join(docsDir, f)))

  const names = components.map((c) => c.name)
  if (new Set(names).size !== names.length) {
    throw new Error(`duplicate component names across spec docs: ${names.join(', ')}`)
  }

  const code = [
    '// Auto-generated from docs/components/*.md — do not edit directly',
    '// Run `npm run metadata:generate` (packages/mcp-builder) to regenerate',
    '',
    "import type { ComponentDef } from './schema.js'",
    '',
    "export type { ComponentDef, PropDef, TypeDef, TokensUsage } from './schema.js'",
    '',
    `export const components: ComponentDef[] = ${JSON.stringify(components, null, 2)}`,
    '',
  ].join('\n')

  const prettierConfig = await prettier.resolveConfig(outputPath)
  const formatted = await prettier.format(code, { ...prettierConfig, filepath: outputPath })
  fs.writeFileSync(outputPath, formatted)
  console.log(
    `✓ Generated ${outputPath} (${components.length} components from ${files.length} spec docs)`
  )
}

await main()
