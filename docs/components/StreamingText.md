---
component: StreamingText
package: '@agentic-ds/agents'
category: display
status: implemented
tokens:
  colors: [color.text.primary, color.stream.cursor]
  duration: [duration.stream.blink]
wcag: AA
aria-pattern: https://www.w3.org/TR/wai-aria-1.2/#log
---

# StreamingText

Renders a growing block of text that is being streamed token-by-token from an agent. A blinking cursor indicates the stream is active. New text is announced incrementally to screen readers.

---

## Props

| Prop          | Type      | Default                | Description                                 |
| ------------- | --------- | ---------------------- | ------------------------------------------- |
| `text`        | `string`  | —                      | The full text accumulated so far (required) |
| `isStreaming` | `boolean` | `false`                | Shows blinking cursor when `true`           |
| `fontSize`    | `string`  | `"sm"`                 | Chakra font size token                      |
| `color`       | `string`  | `"color.text.primary"` | Chakra color token for the text             |
| `aria-label`  | `string`  | `"Streaming output"`   | Label for the live region                   |

---

## Accessibility

- MUST have `role="log"` + `aria-live="polite"` + `aria-atomic="false"` so screen readers announce only newly appended text, not the full buffer each time. _(WCAG SC 4.1.3)_
- The blinking cursor MUST have `aria-hidden="true"` — it is decorative and must not be read aloud. _(WCAG SC 1.3.3)_
- Cursor animation MUST respect `prefers-reduced-motion`. When active, `animation` is set to `undefined` (cursor remains visible but static).
- `aria-label` MUST describe the region purpose — consumers should override `"Streaming output"` if the context is more specific (e.g., `"Agent reasoning"`).

---

## Why `aria-live="polite"` and `aria-atomic="false"`

`aria-atomic="false"` instructs screen readers to announce only the DOM nodes that changed since the last render, not the entire region. This is correct for streaming: users hear each new chunk rather than the entire accumulated text repeated. `aria-live="polite"` avoids interrupting the user mid-sentence.

---

## Do / Don't

**Do:**

```tsx
<StreamingText text={buffer} isStreaming={true} aria-label="Agent reasoning" />
<StreamingText text={finalOutput} isStreaming={false} />
```

**Don't:**

```tsx
// ❌ Wrapping in another live region — nested live regions behave unpredictably
<div aria-live="polite">
  <StreamingText text={buffer} isStreaming />
</div>

// ❌ Passing raw hex for color — use a semantic token
<StreamingText text={buffer} color="#ffffff" />
```

---

## Implementation notes

- The `text` prop should be the full accumulated string, not a delta. The component does not manage internal buffer state.
- Cursor is an inline `<span>` colored `color.stream.cursor` with `ds-blink` keyframe (defined by `AgenticProvider`), `w="2px"`, `h="1em"`, `verticalAlign="text-bottom"`. Timing is `duration.stream.blink` — do not hardcode.
- For very high-frequency streams (< 50ms per token), consider debouncing `text` updates in the parent to avoid excessive SR announcements.

---

## Sources

- [WAI-ARIA 1.2 — log role](https://www.w3.org/TR/wai-aria-1.2/#log)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [Inclusive Components — Live Regions](https://inclusive-components.design/live-regions/)
- [MDN — aria-atomic](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-atomic)
