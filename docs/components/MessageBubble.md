---
component: MessageBubble
package: "@agentic-ds/agents"
category: display
status: implemented
tokens:
  colors: [color.message.user.bg, color.message.assistant.bg, color.message.tool.bg, color.message.tool.border, text.primary, text.muted, accent.blue, accent.green, border.subtle]
wcag: AA
---

# MessageBubble

A single message card within a conversation thread. Background color, label color, and default label text vary by sender role.

---

## Roles

| Role        | Background token               | Label color    | Default label |
|-------------|-------------------------------|----------------|---------------|
| `user`      | `color.message.user.bg`       | `text.muted`   | You           |
| `assistant` | `color.message.assistant.bg`  | `accent.blue`  | Assistant     |
| `tool`      | `color.message.tool.bg`       | `accent.green` | Tool          |

---

## Props

| Prop        | Type          | Default | Description                                        |
|-------------|---------------|---------|----------------------------------------------------|
| `sender`    | `MessageRole` | —       | Determines visual treatment (required)             |
| `content`   | `React.ReactNode` | —   | Message body — can be text, `<StreamingText>`, `<CodeBlock>`, etc. |
| `label`     | `string`      | —       | Override sender label; falls back to role default  |
| `timestamp` | `string`      | —       | Optional timestamp shown in the header row         |

---

## Accessibility

- The label and timestamp are in the DOM above the content — screen readers encounter them in natural reading order.
- Role differentiation is conveyed by both label text and background color. Color alone is not the sole signal. *(WCAG SC 1.4.1)*
- Do not set `aria-label` on the bubble itself — `MessageThread` (the parent `role="log"`) handles the region label.
- When nesting `<StreamingText>` as `content`, do not add an additional `aria-live` region on the bubble — the `StreamingText`'s own region is sufficient.

---

## Do / Don't

**Do:**
```tsx
<MessageBubble sender="user" content="What's the weather in NYC?" />
<MessageBubble sender="assistant" content={<StreamingText text={buffer} isStreaming />} />
<MessageBubble sender="tool" content={<CodeBlock code={result} language="json" />} label="get_weather" />
```

**Don't:**
```tsx
// ❌ Hardcoding background — use role-driven token
<MessageBubble sender="user" content="..." style={{ background: '#1a1a2e' }} />

// ❌ Wrapping in a live region — MessageThread handles this
<div aria-live="polite"><MessageBubble ... /></div>
```

---

## Implementation notes

- Background and label colors are driven by `roleConfig` — add new roles there rather than conditioning inline.
- The `content` prop accepts any `React.ReactNode`; compose `StreamingText`, `CodeBlock`, or plain text freely.
- `timestamp` is not formatted by the component — pass a pre-formatted string (e.g., `"2:34 PM"`).

---

## Sources

- [WCAG 2.2 SC 1.4.1 — Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [Inclusive Components — Cards](https://inclusive-components.design/cards/)
