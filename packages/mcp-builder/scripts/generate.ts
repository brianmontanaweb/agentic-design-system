// Generate src/metadata/components.ts by importing every colocated
// <Name>.doc.ts next to component source in packages/core/src and
// packages/agents/src (the Astryx-inspired approach — see
// packages/component-doc). Each doc file exports a typed `doc: ComponentDoc`
// object directly; there is no markdown to parse or format to validate,
// since tsc already checked the shape when the package was linted.
// Run with: tsx scripts/generate.ts (or `npm run metadata:generate`)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import prettier from 'prettier'
import type { ComponentDoc } from '@agentic-ds/component-doc'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.join(__dirname, '..')
const monorepoRoot = path.join(packageRoot, '../..')
const outputPath = path.join(packageRoot, 'src/metadata/components.ts')

const SOURCE_DIRS = ['packages/core/src', 'packages/agents/src']

function findDocFiles(dir: string): string[] {
  const found: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      found.push(...findDocFiles(full))
    } else if (entry.name.endsWith('.doc.ts')) {
      found.push(full)
    }
  }
  return found
}

async function main(): Promise<void> {
  const docFiles = SOURCE_DIRS.flatMap((dir) => findDocFiles(path.join(monorepoRoot, dir))).sort()
  if (docFiles.length === 0)
    throw new Error('no *.doc.ts files found under ' + SOURCE_DIRS.join(', '))

  const components: ComponentDoc[] = []
  for (const file of docFiles) {
    const mod = (await import(file)) as { doc?: ComponentDoc }
    if (!mod.doc)
      throw new Error(`${path.relative(monorepoRoot, file)}: missing "export const doc"`)
    components.push(mod.doc)
  }

  const names = components.map((c) => c.name)
  if (new Set(names).size !== names.length) {
    throw new Error(`duplicate component names across doc.ts files: ${names.join(', ')}`)
  }

  const code = [
    '// Auto-generated from colocated *.doc.ts files — do not edit directly.',
    '// Run `npm run metadata:generate` (packages/mcp-builder) to regenerate.',
    '',
    "import type { ComponentDoc } from '@agentic-ds/component-doc'",
    '',
    "export type { ComponentDoc, PropDoc, TypeDoc, TokensUsage } from '@agentic-ds/component-doc'",
    '',
    `export const components: ComponentDoc[] = ${JSON.stringify(components, null, 2)}`,
    '',
  ].join('\n')

  const prettierConfig = await prettier.resolveConfig(outputPath)
  const formatted = await prettier.format(code, { ...prettierConfig, filepath: outputPath })
  fs.writeFileSync(outputPath, formatted)
  console.log(
    `✓ Generated ${outputPath} (${components.length} components from ${docFiles.length} doc.ts files)`
  )
}

await main()
