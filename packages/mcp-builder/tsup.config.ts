import { defineConfig } from 'tsup'

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
  },
])
