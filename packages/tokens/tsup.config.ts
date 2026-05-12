import { defineConfig } from 'tsup'
import { writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  async onSuccess() {
    const distPath = resolve(__dirname, 'dist')
    const indexPath = join(distPath, 'index.js')
    const { getCSSVariables } = await import(indexPath)
    const css = getCSSVariables()
    writeFileSync(join(distPath, 'tokens.css'), css)
  },
})
