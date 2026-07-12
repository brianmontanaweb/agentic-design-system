---
name: add-component
description: Scaffolds a new component in @agentic-ds/core or @agentic-ds/agents end-to-end — source, Storybook story, unit tests, spec doc, and index export — by planning once, then orchestrating the add-component-source, add-component-story, add-component-tests, add-component-spec, and verify-component skills. Use when adding, creating, or scaffolding a new component.
---

# Add Component (Orchestrator)

Scaffold a new component given `$ARGUMENTS` in the format `<ComponentName> [core|agents]`.

This skill creates no files itself. It guards against overwrites, plans, gets approval **once**, then invokes five sub-skills in order via the Skill tool. Each sub-skill declares `context: fork`, so every invocation runs in a fresh subagent with no access to this conversation — a sub-skill cannot see the plan, the Figma data, or earlier file reads. Everything it needs must be passed explicitly in its args.

---

## Gotchas

- **Figma is optional** — if the user skips the link, mark "Figma: skipped" in output and proceed immediately; never block on it.
- **Approval happens once, here** — after the Step 3 plan is approved, run all five sub-skills without asking again. The sub-skills do not have their own approval gates.
- **Package inference default** — when ambiguous, lean `agents` for status/streaming/tool-related names; lean `core` for anything that reads like a generic UI primitive (full rules in the shared conventions reference).
- **Agent-specific ARIA is decided in the plan, not retrofitted** — pick the ARIA pattern in Step 3 from `shared/references/aria-patterns.md` and pass it to `add-component-source`.
- **Theming is decided in the plan too** — light/dark support comes from semantic tokens (see the Theming section of the shared conventions reference). Decide in Step 3 whether existing semantic tokens cover the component or new ones are needed; new tokens require both `_dark` and `_light` values.
- **Invoke sub-skills in the listed order** — story, tests, and spec doc all read the source file; source must exist first. Verification runs last.

---

## Step 0 — Check for existing component

Before doing anything else, check whether the component already exists in either package:

```sh
ls packages/core/src/<ComponentName>/<ComponentName>.tsx packages/agents/src/<ComponentName>/<ComponentName>.tsx 2>/dev/null
```

If any output is produced, the component already exists. **Stop immediately** and respond:

```
## Already exists: <ComponentName>

`<path shown in ls output>` already exists.
Use `/update-component <ComponentName>` to audit and update it instead.
```

Do not read, write, or modify any files. Do not proceed to Step 1.

---

## Step 1 — Read shared references

Read both (skip any already in context):

- `.claude/skills/shared/references/conventions.md` — file layout, package inference, import/export/token rules
- `.claude/skills/shared/references/aria-patterns.md` — ARIA pattern per component type, MCP states

Only load `docs/best-practices.md` if you hit an edge case these files don't cover.

## Step 2 — Fetch the Figma component node

If the user provided a Figma component node link, extract `fileKey` and `nodeId` and call `get_file_nodes(fileKey, [nodeId])`. Follow the extraction and conflict resolution process in `docs/best-practices.md` section 8.

If no Figma link was provided, note **Figma: skipped** and proceed immediately. Do not ask.

## Step 3 — Present the plan and wait for approval

Before invoking any sub-skill, output a brief plan:

```
## Plan: <ComponentName>

**Package:** `@agentic-ds/core` | `@agentic-ds/agents`
**Inferred from:** <reason — e.g., "streaming/status → agents" or "UI primitive → core" or "user-specified">
**ARIA pattern:** <e.g., `role="status" aria-live="polite"` — or "none">
**MCP states:** <list or "n/a">
**Theming:** existing semantic tokens | new tokens: <intent-named list, each with dark + light values>
**Figma:** reviewed | skipped

Files to create:
- `packages/<package>/src/<ComponentName>/<ComponentName>.tsx`
- `packages/<package>/src/<ComponentName>/index.ts`
- `packages/<package>/src/<ComponentName>/<ComponentName>.test.tsx`
- `apps/storybook/src/stories/<ComponentName>.stories.tsx`
- `docs/components/<ComponentName>.md`

Shall I proceed? Reply **yes** to create all files, or clarify anything first (package, ARIA pattern, MCP states).
```

Wait for explicit approval before invoking any sub-skill.

## Step 4 — Run the sub-skills in order

Invoke each via the Skill tool, in this exact order:

| Order | Skill                  | Args                        | Produces                                         |
| ----- | ---------------------- | --------------------------- | ------------------------------------------------ |
| 1     | `add-component-source` | `<ComponentName> <package>` | Source file, barrel `index.ts`, package export   |
| 2     | `add-component-story`  | `<ComponentName>`           | Storybook story                                  |
| 3     | `add-component-tests`  | `<ComponentName>`           | Unit test file (and runs it)                     |
| 4     | `add-component-spec`   | `<ComponentName>`           | Spec doc at `docs/components/<ComponentName>.md` |
| 5     | `verify-component`     | `<ComponentName>`           | Build + scoped lint + scoped tests, output shown |

Pass the ARIA pattern, MCP states, and theming decision from Step 3 as extra context in the `add-component-source` args (e.g., `EvalStatusPill agents — role="status" aria-live="polite", states: idle/running/done/error, tokens: existing semantic only` or `…, new token: color.eval.status.queued (dark + light)`).

Because each sub-skill forks into a fresh context, args are the only channel into it — also pass the package to the later sub-skills (e.g., `EvalStatusPill agents`) and any relevant Figma decisions from Step 2, rather than assuming the sub-skill can see this conversation. Each sub-skill's final report comes back as the Skill tool result; read it before moving on.

If a sub-skill reports a failure, fix it before moving to the next — do not defer failures to the verification step.

## Step 5 — Report

Output a concise summary:

```
## Done: <ComponentName>

**Package:** core | agents
**Files created:** <list>
**ARIA pattern:** <pattern applied or "none">
**MCP states:** <list or "n/a">
**Theming:** existing semantic tokens | new tokens added: <list>
**Build + lint:** passing
**Tests:** passing (N tests)
**Figma:** reviewed | skipped
```

To score this run against known test cases, see `evals/evals.json`.
