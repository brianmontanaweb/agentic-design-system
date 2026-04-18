# Audit A11y — Eval Rubric

Use this file to score the quality of an `/audit-a11y` run against a known fixture state.

## Contents
- [Scoring Dimensions](#scoring-dimensions)
- [How to Run an Eval](#how-to-run-an-eval)
- [Test Case 1 — ToolCallCard + AgentStatus fixtures](#test-case-1--toolcallcard--agentstatus-fixtures)
- [Test Case 2 — AgentStatus fixture only](#test-case-2--agentstatus-fixture-only)
- [Test Case 3 — Real codebase](#test-case-3--real-codebase)
- [Iteration Log](#iteration-log)

---

## Scoring Dimensions

| # | Dimension | Max pts | Description |
|---|-----------|---------|-------------|
| 1 | **Recall** | 35 | Found all expected violations — no misses |
| 2 | **Precision** | 20 | Did not flag false positives (token names as hex, valid React imports in source files, per-component animations when theme override exists) |
| 3 | **Format** | 20 | Correct markdown table with all required columns; line numbers present on every violation; Passing section present; Summary present with counts |
| 4 | **Scope** | 15 | Covered every `.tsx` file in both `packages/core/src/` and `packages/agents/src/` |
| 5 | **No modifications** | 10 | No source files changed — report only |

**Total: 100 pts.** Grade: ≥90 excellent · 75–89 good · 60–74 needs work · <60 failing.

---

## How to Run an Eval

Fixtures for this skill are shared with `update-component` — they live in `.claude/skills/update-component/references/fixtures/`.

```bash
# 1. Copy fixture files (see each test case for exact commands)

# 2. Run the skill
#    /audit-a11y

# 3. Score the report against the Expected violations table below.

# 4. Restore original files
git restore packages/agents/src/<ComponentName>.tsx
# — or use the teardown command in the test case
```

---

## Test Case 1 — ToolCallCard + AgentStatus fixtures

**Fixture density:** high — two components with known violations in place simultaneously.

### Setup

```bash
cp .claude/skills/update-component/references/fixtures/ToolCallCard/source.tsx \
   packages/agents/src/ToolCallCard.tsx
cp .claude/skills/update-component/references/fixtures/AgentStatus/source.tsx \
   packages/agents/src/AgentStatus.tsx
```

### Teardown

```bash
git restore packages/agents/src/ToolCallCard.tsx \
            packages/agents/src/AgentStatus.tsx
```

### Expected violations

| Component | Rule | WCAG SC | Severity |
|-----------|------|---------|----------|
| ToolCallCard | Expand/collapse trigger is a div/HStack with `onClick` — must be `<button>` | SC 4.1.2 | High |
| AgentStatus | Missing `role="status"` on container | SC 4.1.3 | High |
| AgentStatus | Missing `aria-live="polite"` on container | SC 4.1.3 | High |
| AgentStatus | Color-only state indicator with no visually-hidden text | SC 1.4.1 | High |

**Recall target:** report must surface all 4 violations with file paths and line numbers.

**Precision check:** must NOT flag `color.agent.status.*` or `color.on.accent` token names as hex violations.

---

## Test Case 2 — AgentStatus fixture only

**Fixture density:** single component — tests that the report correctly scopes violations to what is present and produces the correct table format.

### Setup

```bash
cp .claude/skills/update-component/references/fixtures/AgentStatus/source.tsx \
   packages/agents/src/AgentStatus.tsx
```

### Teardown

```bash
git restore packages/agents/src/AgentStatus.tsx
```

### Expected violations

| Component | Rule | WCAG SC | Severity |
|-----------|------|---------|----------|
| AgentStatus | Missing `role="status"` + `aria-live="polite"` on container | SC 4.1.3 | High |
| AgentStatus | Color-only state indicator with no visually-hidden text | SC 1.4.1 | High |

**Recall target:** report must surface both AgentStatus violations.

**Format check:** report must use a markdown table with columns: Component, File, Line, Rule, WCAG SC, Severity. Button must appear in the Passing section.

---

## Test Case 3 — Real codebase

**Fixture density:** none — runs against the current committed source files. Tests that the skill identifies pre-existing violations and does not produce false positives.

### Setup

```bash
# none
```

### Teardown

```bash
# none
```

### Expected violations

The real codebase contains pre-existing violations (see `CLAUDE.md` Known Gaps). At minimum, the report must identify:

| Component | Rule | WCAG SC |
|-----------|------|---------|
| ToolCallCard | Non-button expand/collapse trigger | SC 4.1.2 |
| AgentStatus | Missing ARIA live region attributes | SC 4.1.3 |
| AgentStatus | Color-only state indicator | SC 1.4.1 |

**Precision check:** must NOT flag `color.agent.status.*`, `color.on.accent`, or similar semantic token names as hex violations. Must NOT flag `import React` in source files where `React.*` type annotations are present.

**No modifications check:** no `.tsx` files in `packages/core/src/` or `packages/agents/src/` may be modified.

---

## Iteration Log

Record misses and false positives after each eval run to guide skill improvements.

| Date | Test case | Miss or FP | Description | Action taken |
|------|-----------|------------|-------------|--------------|
| — | — | — | — | — |
