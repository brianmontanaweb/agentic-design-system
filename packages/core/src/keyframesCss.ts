import { durations } from '@agentic-ds/tokens'

// Keyframe names use the ds- prefix to prevent collisions in the host app's
// global stylesheet. Scoping @keyframes inside a selector requires CSS Nesting
// (Level 4) which isn't universally supported — top-level declarations are
// safer. The ds- prefix is the primary collision guard.
//
// AgenticProvider injects this as an inline <style> by default. CSP-strict
// embeds (style-src without 'unsafe-inline') must instead link the built
// artifact that includes this text (@agentic-ds/mcp-builder/iife/css) and
// render <AgenticProvider injectStyles={false}>.
export const keyframesCss = `
@keyframes ds-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.85); }
  50%       { opacity: 1;   transform: scale(1); }
}
@keyframes ds-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes ds-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 1; transform: scale(1); }
  }
  @keyframes ds-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 1; }
  }
  [data-agentic-ds] *, [data-agentic-ds] *::before, [data-agentic-ds] *::after {
    animation-duration: ${durations.instant.$value} !important;
    transition-duration: ${durations.instant.$value} !important;
  }
}
`
