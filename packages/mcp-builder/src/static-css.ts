import { getCSSVariables } from '@agentic-ds/tokens'
import { keyframesCss } from '@agentic-ds/core'

// Assembles the static stylesheet emitted next to the IIFE bundles at build
// time (dist/iife/agentic-ds.css). CSP-strict MCP App iframes (style-src
// without 'unsafe-inline') link this file and render
// <AgenticProvider injectStyles={false}>; everything else Chakra emits at
// runtime goes through CSSOM insertRule, which CSP does not restrict.
export function buildStaticCss(): string {
  return [
    '/* Agentic Design System — static stylesheet for CSP-strict MCP App iframes.',
    ' * Generated at build time from @agentic-ds/tokens (custom properties) and',
    ' * @agentic-ds/core (keyframes + reduced-motion rules). Do not edit.',
    ' * Link this and render <AgenticProvider injectStyles={false}>.',
    ' * Captures the stock theme only — defineAgenticTheme() output is runtime-emitted. */',
    '',
    getCSSVariables(),
    keyframesCss,
  ].join('\n')
}
