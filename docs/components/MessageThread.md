---
component: MessageThread
package: '@agentic-ds/agents'
category: layout
status: implemented
tokens:
  colors: [border.subtle]
wcag: AA
aria-pattern: https://www.w3.org/TR/wai-aria-1.2/#log
---

# MessageThread

A scrollable container for a conversation between a user and an agent. New messages are announced to screen readers as they arrive. Optionally auto-scrolls to the latest message.

---

## Props

| Prop         | Type              | Default            | Description                                         |
| ------------ | ----------------- | ------------------ | --------------------------------------------------- |
| `children`   | `React.ReactNode` | —                  | Sequence of `<MessageBubble>` components (required) |
| `maxHeight`  | `string`          | `"600px"`          | CSS max-height of the scroll container              |
| `autoScroll` | `boolean`         | `true`             | Scrolls to bottom whenever `children` changes       |
| `aria-label` | `string`          | `"Message thread"` | Label for the `role="log"` region                   |

---

## Accessibility

- MUST have `role="log"` + `aria-live="polite"` + `aria-atomic="false"` so new messages are announced incrementally. _(WCAG SC 4.1.3)_
- `aria-label` MUST be set to a meaningful phrase. Override the default `"Message thread"` when the context is more specific (e.g., `"Agent conversation"`, `"Support chat"`).
- `aria-atomic="false"` ensures screen readers announce only the newly added message rather than reading the entire thread.
- The scrollable container is the live region; do not wrap children in an additional live region.

---

## Auto-scroll behaviour

`autoScroll` uses a sentinel `<div ref={bottomRef}>` at the end of the list and calls `scrollIntoView({ behavior: 'smooth' })` when `children` changes. Disable it (`autoScroll={false}`) when the user has scrolled up to read history, or wire your own scroll logic.

---

## Do / Don't

**Do:**

```tsx
<MessageThread aria-label="Agent conversation">
  <MessageBubble sender="user" content="Hello" />
  <MessageBubble sender="assistant" content={<StreamingText text={reply} isStreaming />} />
</MessageThread>
```

**Don't:**

```tsx
// ❌ Wrapping children in another live region
<MessageThread>
  <div aria-live="polite"><MessageBubble ... /></div>
</MessageThread>

// ❌ Omitting aria-label when multiple threads exist on the page
<MessageThread>{messages}</MessageThread>
<MessageThread>{logs}</MessageThread>
```

---

## Implementation notes

- The custom scrollbar is styled with `-webkit-scrollbar` CSS; the scrollbar thumb uses the `--ds-border-subtle` CSS variable with a hardcoded fallback (`#2a2a38`) for browsers that don't support CSS variables (acceptable: applies only to a cosmetic scrollbar).
- `autoScroll` fires on every `children` change via `useEffect`; if children updates are very frequent, consider debouncing outside the component.

---

## Sources

- [WAI-ARIA 1.2 — log role](https://www.w3.org/TR/wai-aria-1.2/#log)
- [WCAG 2.2 SC 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)
- [MDN — aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
