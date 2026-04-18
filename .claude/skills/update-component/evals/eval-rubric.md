# Update Component — Eval Rubric

Use this file to score the quality of a `/update-component` run against a known fixture state.

## Contents
- [Scoring Dimensions](#scoring-dimensions)
- [How to Run an Eval](#how-to-run-an-eval)
- [Test Case 1 — ToolCallCard](#test-case-1--toolcallcard)
- [Test Case 2 — AgentStatus](#test-case-2--agentstatus)
- [Test Case 3 — Button](#test-case-3--button)
- [Iteration Log](#iteration-log)

---

## Scoring Dimensions

| # | Dimension | Max pts | Description |
|---|-----------|---------|-------------|
| 1 | **Recall** | 30 | Found all expected violations — no misses |
| 2 | **Precision** | 15 | Did not flag false positives |
| 3 | **Plan specificity** | 15 | Changes described as `old value → new value`, not vague intentions |
| 4 | **Fix correctness** | 25 | Applied fixes actually resolve the violations |
| 5 | **No regressions** | 15 | `npm run build` + `npm run lint` pass after changes |

**Total: 100 pts.** Grade: ≥90 excellent · 75–89 good · 60–74 needs work · <60 failing.

Dimensions 1–3 are scorable from the plan alone (before approving). Dimensions 4–5 require executing the changes.

---

## How to Run an Eval

Two modes are available. Use both to get a full 100-point score.

### Planning evals (dimensions 1–3) — evals.json ids 1, 2, 3

```bash
# 1. Copy fixture files to the real paths
#    (see each test case below for the exact commands)

# 2. Run the skill
#    /update-component <ComponentName>

# 3. Score dimensions 1–3 from the plan, using the Expected violations table below.
#    Do NOT approve the changes yet.

# 4. Restore original files
git restore packages/agents/src/<ComponentName>.tsx \
            apps/storybook/src/stories/<ComponentName>.stories.tsx
git restore docs/components/<ComponentName>.md 2>/dev/null || rm -f docs/components/<ComponentName>.md
```

### Execution evals (dimensions 4–5) — evals.json ids 4, 5, 6

The prompt pre-approves the plan so the skill writes files. After the run, grade the
actual file state against the assertions, then teardown restores everything.

```bash
# 1. Copy fixture files (same setup commands as the planning eval)

# 2. Run the skill with pre-approval prompt
#    /update-component <ComponentName>
#    (prompt includes "apply all changes without pausing for approval")

# 3. Grade the actual file state against dimensions 4–5.

# 4. Restore — teardown in evals.json handles this automatically:
git restore packages/<pkg>/src/<ComponentName>.tsx \
            apps/storybook/src/stories/<ComponentName>.stories.tsx
git restore docs/components/<ComponentName>.md 2>/dev/null || rm -f docs/components/<ComponentName>.md
```

---

## Test Case 1 — ToolCallCard

**Package:** `agents` · **Fixture density:** high

### Setup

```bash
cp .claude/skills/update-component/references/fixtures/ToolCallCard/source.tsx \
   packages/agents/src/ToolCallCard.tsx

cp .claude/skills/update-component/references/fixtures/ToolCallCard/story.tsx \
   apps/storybook/src/stories/ToolCallCard.stories.tsx

cp .claude/skills/update-component/references/fixtures/ToolCallCard/spec.md \
   docs/components/ToolCallCard.md
```

### Teardown

```bash
git restore packages/agents/src/ToolCallCard.tsx \
            apps/storybook/src/stories/ToolCallCard.stories.tsx \
            docs/components/ToolCallCard.md
```

### Expected violations

| Category | Violation | File |
|----------|-----------|------|
| Tokens | `statusColors` uses hardcoded hex (`#8888aa`, `#4d9fff`, `#3dd68c`, `#f87171`) — replace with semantic tokens (`color.tool.status.*`) | source |
| ARIA | Expand/collapse trigger is a `<Box>` (div) with `onClick` — must be `<button>` with `aria-expanded` and `aria-controls` | source |
| Code quality | `import React, { useId, useState }` — default `React` import unused with jsx-runtime; should be `import { useId, useState }` | source |
| Story gap | No `Pending` story — `pending` is a valid `ToolCallStatus` value with no story coverage | story |
| Spec drift | `defaultOpen` prop missing from props table | spec |
| Spec drift | `input` prop type is `object` — should be `Record<string, unknown>` | spec |
| Spec drift | `pending` state missing from states table | spec |
| Spec drift | No ARIA section documenting the WAI-ARIA Disclosure pattern requirement | spec |
| Spec drift | Frontmatter `tokens` list is empty — should list semantic tokens used | spec |

**Recall target:** plan must surface all 9 violations.

**Precision check:** should NOT flag `color="accent.green"` on the output Code block — this is a semantic token name, not a hardcoded hex.

---

## Test Case 2 — AgentStatus

**Package:** `agents` · **Fixture density:** high

### Setup

```bash
cp .claude/skills/update-component/references/fixtures/AgentStatus/source.tsx \
   packages/agents/src/AgentStatus.tsx

cp .claude/skills/update-component/references/fixtures/AgentStatus/story.tsx \
   apps/storybook/src/stories/AgentStatus.stories.tsx

cp .claude/skills/update-component/references/fixtures/AgentStatus/spec.md \
   docs/components/AgentStatus.md
```

### Teardown

```bash
git restore packages/agents/src/AgentStatus.tsx \
            apps/storybook/src/stories/AgentStatus.stories.tsx \
            docs/components/AgentStatus.md
```

### Expected violations

| Category | Violation | File |
|----------|-----------|------|
| Tokens | `statusConfig` uses hardcoded hex — replace with `color.agent.status.*` semantic tokens | source |
| MCP states | `waiting` and `cancelled` missing from `AgentStatusValue` type and `statusConfig` | source |
| ARIA | Missing `role="status"` + `aria-live="polite"` on the container | source |
| ARIA | No visually-hidden text — color is the only state indicator (WCAG SC 1.4.1) | source |
| Story gap | No `Waiting` story | story |
| Story gap | No `Cancelled` story | story |
| Story gap | `argTypes.status.options` lists only 4 values — should include `waiting` and `cancelled` | story |
| Spec drift | `mcp-states` frontmatter only lists 4 states — should be all 6 | spec |
| Spec drift | States table missing `waiting` and `cancelled` rows | spec |
| Spec drift | `status` prop type is missing `waiting` and `cancelled` union members | spec |
| Spec drift | No ARIA section documenting `role="status"`, `aria-live="polite"`, visually-hidden text | spec |

**Recall target:** plan must surface all 11 violations.

**A11y report:** violations 3 and 4 above should appear in the A11y report section (Step 7), not just the source changes section (Step 4).

---

## Test Case 3 — Button

**Package:** `core` · **Fixture density:** low

### Setup

```bash
cp .claude/skills/update-component/references/fixtures/Button/source.tsx \
   packages/core/src/Button.tsx

cp .claude/skills/update-component/references/fixtures/Button/story.tsx \
   apps/storybook/src/stories/Button.stories.tsx

cp .claude/skills/update-component/references/fixtures/Button/spec.md \
   docs/components/Button.md
```

### Teardown

```bash
git restore packages/core/src/Button.tsx \
            apps/storybook/src/stories/Button.stories.tsx \
            docs/components/Button.md
```

### Expected violations

| Category | Violation | File |
|----------|-----------|------|
| Tokens | `transition: 'all 100ms'` in `baseStyles` — hardcoded timing value; should reference `var(--ds-duration-fast)` | source |
| Code quality | `import React from 'react'` in story — unused default import with jsx-runtime transform | story |
| Spec drift | `aria-label` prop missing from props table | spec |
| Spec drift | `color.on.accent` missing from frontmatter `tokens.colors` list | spec |
| Spec drift | Accessibility note contradicts implementation: says `tabIndex={-1}` but source correctly uses `tabIndex={0}` to keep disabled button in tab order | spec |

**Recall target:** plan must surface all 5 violations.

**Precision check:** should NOT flag:
- The `import React from 'react'` in **source** (used for `React.ReactElement`, `React.MouseEvent`, `React.ReactNode` type annotations)
- The `LoadingDots` animation (motion is suppressed at theme level — not a per-component violation)

---

## Iteration Log

Record misses and false positives after each eval run to guide skill improvements.

| Date | Test case | Miss or FP | Description | Action taken |
|------|-----------|------------|-------------|--------------|
| — | — | — | — | — |
