import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@chakra-ui/react', 'next-themes'],
  // @agentic-ds/tokens is inlined into the bundle so consumers don't need to
  // install the internal tokens package separately. noExternal overrides tsup's
  // default of auto-externalizing anything listed in (peer)dependencies.
  noExternal: ['@agentic-ds/tokens'],
})
