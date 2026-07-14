// Static CSS extraction for defineAgenticTheme() options — for CSP-strict
// embeds (style-src without 'unsafe-inline') that need a branded theme's
// custom properties as a build-time stylesheet instead of the runtime-only
// Chakra system that AgenticProvider otherwise consumes.

import { colorSchemeCss } from '@agentic-ds/tokens'
import { resolveThemeColors, themeSelector, type AgenticThemeOptions } from './theme'

/**
 * Turns `defineAgenticTheme()` options into a static stylesheet of `--ds-*`
 * color custom properties, scoped to the same selector the runtime theme
 * uses (`[data-agentic-ds]`, or `[data-agentic-ds][data-agentic-theme="name"]`
 * when `options.name` is set). Call this at the embedder's own build time —
 * not in the browser — and link the result alongside the base stylesheet
 * (`@agentic-ds/mcp-builder/iife/css`), which still supplies the theme-invariant
 * static tokens (spacing, fonts, durations) and keyframes.
 *
 * Only covers colors: `AgenticThemeOptions` has no non-color fields, so
 * everything else is identical to the stock theme and already in the base
 * stylesheet. Pass it the exact same options object used for
 * `defineAgenticTheme()` at runtime so the two never drift apart.
 *
 * When `options.name` is unset, the output selector is `[data-agentic-ds]`,
 * the same specificity as the base stylesheet's block — link this file
 * *after* the base one so its declarations win the cascade.
 *
 * ```ts
 * // build.ts
 * import { writeFileSync } from 'node:fs'
 * import { themeToCss } from '@agentic-ds/core'
 *
 * const themeOptions = { name: 'acme', accent: '#e8590c', neutralWarmth: 0.5 }
 * writeFileSync('dist/acme-theme.css', themeToCss(themeOptions))
 * // <AgenticProvider theme={defineAgenticTheme(themeOptions)} injectStyles={false}>
 * ```
 */
export function themeToCss(options: AgenticThemeOptions = {}): string {
  return colorSchemeCss(themeSelector(options.name), resolveThemeColors(options))
}
