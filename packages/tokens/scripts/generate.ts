// Generate src/generated.ts by resolving tokens.resolver.json (DTCG 2025.10
// resolver module) once per color-scheme context.
// Run with: tsx scripts/generate.ts
//
// Pipeline: for each context (dark, light), merge the sets/modifiers listed in
// resolutionOrder, resolve {alias} references, then serialize every $value to
// its CSS string form. Color tokens from all contexts fold into one flat
// `colorModes` map; the two contexts must define an identical color key set or
// generation fails. Non-color groups come from the default context only.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.join(__dirname, '..')
const resolverPath = path.join(packageRoot, 'tokens.resolver.json')
const outputPath = path.join(packageRoot, 'src/generated.ts')

// ---- DTCG value shapes (2025.10 format module) ----

interface DimensionValue {
  value: number
  unit: string
}

interface ColorValue {
  colorSpace: string
  components: number[]
  alpha?: number
  hex?: string
}

interface ShadowValue {
  color: ColorValue
  offsetX: DimensionValue
  offsetY: DimensionValue
  blur: DimensionValue
  spread: DimensionValue
}

interface TokenNode {
  $value?: unknown
  $type?: string
  $description?: string
  [key: string]: unknown
}

type TokenTree = Record<string, unknown>

// ---- Resolver document (2025.10 resolver module) ----

type Source = { $ref: string } | TokenTree

interface ResolverDoc {
  version: string
  sets?: Record<string, { sources: Source[] }>
  modifiers?: Record<string, { contexts: Record<string, Source[]>; default: string }>
  resolutionOrder: { $ref: string }[]
}

function fail(message: string): never {
  console.error(`✗ ${message}`)
  process.exit(1)
}

function isTokenNode(v: unknown): v is TokenNode {
  return typeof v === 'object' && v !== null && '$value' in v
}

function loadSource(source: Source): TokenTree {
  if ('$ref' in source && typeof source.$ref === 'string') {
    const filePath = path.join(packageRoot, source.$ref)
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TokenTree
  }
  return source as TokenTree
}

// Later sources override earlier ones; groups merge recursively, tokens replace.
function deepMerge(target: TokenTree, incoming: TokenTree): TokenTree {
  for (const [key, value] of Object.entries(incoming)) {
    const existing = target[key]
    if (
      typeof value === 'object' &&
      value !== null &&
      !isTokenNode(value) &&
      typeof existing === 'object' &&
      existing !== null &&
      !isTokenNode(existing)
    ) {
      deepMerge(existing as TokenTree, value as TokenTree)
    } else {
      target[key] = value
    }
  }
  return target
}

function resolveContext(resolver: ResolverDoc, context: Record<string, string>): TokenTree {
  const tree: TokenTree = {}
  for (const entry of resolver.resolutionOrder) {
    const [, kind, name] = /^#\/(sets|modifiers)\/(.+)$/.exec(entry.$ref) ?? []
    if (kind === 'sets') {
      const set = resolver.sets?.[name]
      if (!set) fail(`resolutionOrder references unknown set "${name}"`)
      for (const source of set.sources) deepMerge(tree, loadSource(source))
    } else if (kind === 'modifiers') {
      const modifier = resolver.modifiers?.[name]
      if (!modifier) fail(`resolutionOrder references unknown modifier "${name}"`)
      const contextName = context[name] ?? modifier.default
      const sources = modifier.contexts[contextName]
      if (!sources) fail(`modifier "${name}" has no context "${contextName}"`)
      for (const source of sources) deepMerge(tree, loadSource(source))
    } else {
      fail(`unsupported resolutionOrder $ref: ${entry.$ref}`)
    }
  }
  return tree
}

// ---- Alias resolution ({group.path.token} references) ----

function lookupToken(tree: TokenTree, dotPath: string): TokenNode | undefined {
  let node: unknown = tree
  for (const part of dotPath.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined
    node = (node as TokenTree)[part]
  }
  return isTokenNode(node) ? node : undefined
}

function resolveAliases(tree: TokenTree): void {
  function resolveValue(node: TokenNode, trail: string[]): unknown {
    const { $value } = node
    if (typeof $value !== 'string' || !/^\{[^}]+\}$/.test($value)) return $value
    const ref = $value.slice(1, -1)
    if (trail.includes(ref)) fail(`circular alias: ${[...trail, ref].join(' → ')}`)
    const target = lookupToken(tree, ref)
    if (!target) fail(`alias {${ref}} does not resolve to a token`)
    return resolveValue(target, [...trail, ref])
  }

  function walk(node: TokenTree): void {
    for (const value of Object.values(node)) {
      if (isTokenNode(value)) {
        value.$value = resolveValue(value, [])
      } else if (typeof value === 'object' && value !== null) {
        walk(value as TokenTree)
      }
    }
  }
  walk(tree)
}

// ---- $value serialization to CSS strings ----

function serializeDimension(v: DimensionValue): string {
  return v.value === 0 ? '0' : `${v.value}${v.unit}`
}

function serializeColor(v: ColorValue): string {
  const alpha = v.alpha ?? 1
  if (v.hex) {
    if (alpha >= 1) return v.hex
    return (
      v.hex +
      Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0')
    )
  }
  const [r, g, b] = v.components.map((c) => Math.round(c * 255))
  return alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function serializeShadow(v: ShadowValue): string {
  const spread = v.spread.value === 0 ? '' : ` ${serializeDimension(v.spread)}`
  const offsets = `${serializeDimension(v.offsetX)} ${serializeDimension(v.offsetY)}`
  return `${offsets} ${serializeDimension(v.blur)}${spread} ${serializeColor(v.color)}`
}

function serializeFontFamily(v: string[] | string): string {
  const families = Array.isArray(v) ? v : [v]
  return families.map((name) => (/\s/.test(name) ? `"${name}"` : name)).join(', ')
}

function serializeValue(node: TokenNode, tokenPath: string): string | number {
  switch (node.$type) {
    case 'color':
      return serializeColor(node.$value as ColorValue)
    case 'dimension':
      return serializeDimension(node.$value as DimensionValue)
    case 'duration': {
      const v = node.$value as DimensionValue
      return `${v.value}${v.unit}`
    }
    case 'fontFamily':
      return serializeFontFamily(node.$value as string[] | string)
    case 'fontWeight':
    case 'number':
      return node.$value as number
    case 'shadow':
      return serializeShadow(node.$value as ShadowValue)
    default:
      return fail(`token "${tokenPath}" has unsupported $type: ${String(node.$type)}`)
  }
}

interface SerializedToken {
  $value: string | number
  $type: string
  $description?: string
}

function serializeTree(tree: TokenTree, trail: string[]): TokenTree {
  const out: TokenTree = {}
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith('$')) continue
    const tokenPath = [...trail, key].join('.')
    if (isTokenNode(value)) {
      const serialized: SerializedToken = {
        $value: serializeValue(value, tokenPath),
        $type: value.$type ?? fail(`token "${tokenPath}" is missing $type`),
      }
      if (value.$description) serialized.$description = value.$description
      out[key] = serialized
    } else if (typeof value === 'object' && value !== null) {
      out[key] = serializeTree(value as TokenTree, [...trail, key])
    }
  }
  return out
}

function flattenLeaves(tree: TokenTree, trail: string[]): Map<string, SerializedToken> {
  const flat = new Map<string, SerializedToken>()
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith('$')) continue
    const tokenPath = [...trail, key]
    if (isTokenNode(value)) {
      flat.set(tokenPath.join('.'), value as unknown as SerializedToken)
    } else if (typeof value === 'object' && value !== null) {
      for (const [k, v] of flattenLeaves(value as TokenTree, tokenPath)) flat.set(k, v)
    }
  }
  return flat
}

// ---- Resolve every color-scheme context ----

const resolver = JSON.parse(fs.readFileSync(resolverPath, 'utf-8')) as ResolverDoc
if (resolver.version !== '2025.10') fail(`unsupported resolver version: ${resolver.version}`)

const colorScheme = resolver.modifiers?.['color-scheme']
if (!colorScheme) fail('resolver must define a "color-scheme" modifier')

const serializedByContext = new Map<string, TokenTree>()
for (const contextName of Object.keys(colorScheme.contexts)) {
  const tree = resolveContext(resolver, { 'color-scheme': contextName })
  resolveAliases(tree)
  serializedByContext.set(contextName, serializeTree(tree, []))
}

const defaultContext = serializedByContext.get(colorScheme.default)
if (!defaultContext) fail(`default context "${colorScheme.default}" not among contexts`)

// ---- Color key parity across contexts ----

const colorByContext = new Map<string, Map<string, SerializedToken>>()
for (const [contextName, tree] of serializedByContext) {
  colorByContext.set(contextName, flattenLeaves({ color: tree.color } as TokenTree, []))
}

const referenceKeys = [...(colorByContext.get(colorScheme.default) ?? new Map()).keys()]
for (const [contextName, flat] of colorByContext) {
  const missing = referenceKeys.filter((k) => !flat.has(k))
  const extra = [...flat.keys()].filter((k) => !referenceKeys.includes(k))
  if (missing.length > 0 || extra.length > 0) {
    fail(
      `color key sets differ between "${colorScheme.default}" and "${contextName}" contexts` +
        (missing.length > 0 ? `\n  missing in ${contextName}: ${missing.join(', ')}` : '') +
        (extra.length > 0 ? `\n  extra in ${contextName}: ${extra.join(', ')}` : '')
    )
  }
}

// ---- Emit generated.ts ----

function quote(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function keyCode(key: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : quote(key)
}

function tokenToCode(token: SerializedToken): string {
  const value = typeof token.$value === 'number' ? token.$value : quote(token.$value)
  const desc = token.$description ? `, $description: ${quote(token.$description)}` : ''
  return `{ $value: ${value}, $type: ${quote(token.$type)}${desc} }`
}

function groupToCode(group: TokenTree, indent: number): string {
  const ind = ' '.repeat(indent)
  const lines: string[] = ['{']
  for (const [key, value] of Object.entries(group)) {
    if (isTokenNode(value)) {
      lines.push(`  ${ind}${keyCode(key)}: ${tokenToCode(value as unknown as SerializedToken)},`)
    } else {
      lines.push(`  ${ind}${keyCode(key)}: ${groupToCode(value as TokenTree, indent + 2)},`)
    }
  }
  lines.push(`${ind}}`)
  return lines.join('\n')
}

const contextNames = [colorScheme.default].concat(
  Object.keys(colorScheme.contexts).filter((c) => c !== colorScheme.default)
)

const colorModeLines: string[] = ['export const colorModes = Object.freeze({']
for (const key of referenceKeys) {
  const modes = contextNames
    .map((c) => `${keyCode(c)}: ${quote(String(colorByContext.get(c)?.get(key)?.$value))}`)
    .join(', ')
  const reference = colorByContext.get(colorScheme.default)?.get(key)
  const desc = reference?.$description ? `, $description: ${quote(reference.$description)}` : ''
  colorModeLines.push(`  ${quote(key)}: { ${modes}, $type: 'color'${desc} },`)
}
colorModeLines.push('})')

const groupNames = Object.keys(defaultContext).filter((name) => name !== 'color')
const groupExports = groupNames.map(
  (name) =>
    `export const ${name} = Object.freeze(${groupToCode(defaultContext[name] as TokenTree, 2)})`
)

const tokenExport = `
export const tokens = Object.freeze({
  colorModes,
  ${groupNames.join(',\n  ')},
})
export default tokens
`

const fullCode = [
  `// Auto-generated from tokens.resolver.json + tokens/*.json — do not edit directly`,
  `// Run \`npm run tokens:generate\` to regenerate`,
  ``,
  colorModeLines.join('\n'),
  ``,
  ...groupExports,
  tokenExport,
].join('\n')

fs.writeFileSync(outputPath, fullCode)
console.log(
  `✓ Generated ${outputPath} (${referenceKeys.length} color tokens × ${contextNames.length} modes)`
)
