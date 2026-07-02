# Testing Conventions — Shared Reference

Conventions for component unit tests. If this file is already in context from an earlier step in the conversation, do not re-read it.

## File setup

- Test file lives next to the source: `packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx`.
- Import `React` from `'react'` (test convention — unlike source/story files).
- Import `{ describe, expect, it, vi, beforeEach, afterEach }` from `'vitest'` (only what the file uses).
- Import `{ screen, act }` from `'@testing-library/react'` and `userEvent` from `'@testing-library/user-event'` as needed.
- Import `renderWithProviders` from `'../__tests__/test-utils'` — never use `render` directly; `renderWithProviders` wraps in `AgenticProvider` so Chakra tokens resolve correctly.
- Import the component and its prop types from `'./<ComponentName>'`.

## Required test groups

**`structure`** — basic render and DOM shape: renders without crashing; key child elements exist; significant DOM roles are present.

**`ARIA`** — one test per ARIA attribute the component sets (`role`, `aria-live`, `aria-atomic`, `aria-describedby`, `aria-expanded`, `aria-controls`, `aria-label`, `aria-current`, `aria-hidden`). Each test asserts the attribute is set AND that its value is correct (id reference, string value, boolean). Write ARIA tests first — they prove accessibility correctness, not just render correctness.

**`props`** — one test per meaningful prop. Use `it.each` for enum props (`variant`, `size`, `placement`, `status`); every enum value gets at least a smoke test asserting it renders without crashing.

**`disabled / isDisabled`** — if applicable: confirms blocked behavior (events not fired, element not rendered, attribute absent).

**`interaction`** — for every user-facing behavior, via `userEvent.setup()` — never `fireEvent`:

- Hover: `user.hover()` / `user.unhover()`
- Keyboard: `user.tab()`, `user.keyboard('{Escape}')`, `user.keyboard('{Enter}')`, `user.keyboard(' ')`
- Click: `user.click()`
- Components with `setTimeout` show/hide delays: `vi.useFakeTimers()` in `beforeEach`, `vi.useRealTimers()` in `afterEach`, pass `{ advanceTimers: vi.advanceTimersByTime }` to `userEvent.setup()`, and wrap timer advancement in `act(() => { vi.runAllTimers() })`.

## What not to test

- Visual styles (colors, font sizes, spacing) — these are token values, not logic
- Animation keyframes
- Implementation details (internal state variable names, specific CSS class names)
