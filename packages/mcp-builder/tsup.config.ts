import { defineConfig } from 'tsup'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { buildStaticCss } from './src/static-css'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig([
  // MCP server — Node.js binary over stdio
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
  // IIFE bundle (unminified) — for MCP App iframe embedding
  {
    entry: { 'agentic-ds': 'src/iife.ts' },
    format: ['iife'],
    globalName: 'AgenticDS',
    platform: 'browser',
    dts: false,
    sourcemap: true,
    clean: true,
    outDir: 'dist/iife',
    noExternal: [/.*/],
    esbuildOptions(options) {
      options.define = { 'process.env.NODE_ENV': '"production"' }
    },
  },
  // IIFE bundle (minified)
  {
    entry: { 'agentic-ds': 'src/iife.ts' },
    format: ['iife'],
    globalName: 'AgenticDS',
    platform: 'browser',
    dts: false,
    sourcemap: true,
    clean: false,
    outDir: 'dist/iife',
    noExternal: [/.*/],
    minify: true,
    outExtension: () => ({ js: '.min.js' }),
    esbuildOptions(options) {
      options.define = { 'process.env.NODE_ENV': '"production"' }
    },
    // Emit the static stylesheet next to the IIFE bundles: custom properties
    // + keyframes for CSP-strict iframes (see src/static-css.ts). Runs on the
    // last config so dist/iife exists and its clean step has already happened.
    onSuccess() {
      const outFile = join(__dirname, 'dist/iife/agentic-ds.css')
      writeFileSync(outFile, buildStaticCss())
      console.log(`✓ Generated ${outFile}`)
      return Promise.resolve()
    },
  },
])
