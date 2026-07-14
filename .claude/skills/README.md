# Skills

Custom Claude Code skills for this monorepo. Each skill is a directory containing a `SKILL.md` and an `evals/` folder.

## Skills in this repo

| Skill                  | What it does                                                                     | Rubric? |
| ---------------------- | -------------------------------------------------------------------------------- | ------- |
| `add-component`        | Orchestrates a full scaffold by invoking the five sub-skills below in order      | No      |
| `add-component-source` | Creates the source file, barrel index, and package export                        | No      |
| `add-component-story`  | Creates/extends the Storybook story for an existing component                    | No      |
| `add-component-tests`  | Creates the unit test file for an existing component and runs it to green        | No      |
| `add-component-spec`   | Creates the colocated spec doc at `<Name>.doc.ts` next to the component's source | No      |
| `verify-component`     | Builds, lints, and tests one component's files; fixes errors in them             | No      |
| `update-component`     | Audits and updates an existing component; plans before writing                   | Yes     |

The full accessibility audit is **not** a skill — it is the `/audit-a11y` dynamic workflow at `.claude/workflows/audit-a11y.js` (one agent per component, adversarial verification, merged report). Its criteria live in `shared/references/a11y-audit-criteria.md` and its eval cases and rubric in `.claude/workflows/evals/audit-a11y/`.

The `add-component-*` sub-skills and `verify-component` are independently invocable (e.g. backfill tests for an existing component with `/add-component-tests Button`) and are also sequenced by the `/add-component` orchestrator, which owns the single plan-approval gate for full scaffolds. Sub-skills have no approval gates of their own.

## Directory layout

```
.claude/skills/
  shared/
    references/               # Single source of truth for cross-skill conventions
      conventions.md          #   file layout, imports, exports, tokens, CSS scoping
      aria-patterns.md        #   required ARIA per component type, MCP states
      testing.md              #   unit test conventions and required test groups
    scripts/                  # Eval fixtures shared by sub-skill evals
      setup-eval-component.sh #   creates a minimal EvalStatusPill in packages/agents
      teardown-eval-component.sh
  <skill-name>/
    SKILL.md                  # Frontmatter + step-by-step instructions
    evals/
      evals.json              # Machine-readable test cases with assertions
      eval-rubric.md          # Human-readable scoring guide (when needed — see below)
      scripts/                # Setup, teardown, and grade shell scripts (when needed)
    references/               # Skill-specific reference files loaded on demand
```

Conventions used by more than one skill belong in `shared/references/`, not in any single `SKILL.md` — skills load them by path and skip the read when the file is already in context.

## When to add an eval-rubric.md

Add a rubric when the skill's output quality has **multiple independent dimensions** that don't reduce to binary pass/fail — i.e., when you'd want to score a partial result.

| Skill type                          | Output                                                  | Use rubric?                                     |
| ----------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| Scaffolding (`add-component`)       | Files either exist with the right content or they don't | **No** — `evals.json` assertions are sufficient |
| Report/audit (e.g. an a11y audit)   | Report quality varies: recall, precision, format, scope | **Yes**                                         |
| Plan + execute (`update-component`) | Plan quality varies; execution correctness is checkable | **Yes**                                         |

A rubric should define named dimensions, a point allocation, a grading scale, expected violation tables per test case, and an Iteration Log for recording misses and false positives.

## Eval component naming

**Never use a real or plausible production component name in `add-component` evals.** Teardown uses `rm -f`, which would delete the real file.

- Use the `Eval` prefix: `EvalStatusPill`, `EvalIconButton`, `EvalToolProgress`
- The name should still exercise the inference logic being tested (e.g., "Status" → agents package)

Skills and workflows that operate _on_ existing components (`update-component`, the `/audit-a11y` workflow) use real names intentionally — their setup copies from fixtures and teardown uses `git restore`.

## Teardown patterns

| Situation                                      | Pattern                                            |
| ---------------------------------------------- | -------------------------------------------------- |
| No setup or teardown needed                    | `null`                                             |
| File created by the eval (didn't exist before) | `rm -f <path>`                                     |
| File overwritten from git-tracked state        | `git restore <path>`                               |
| File that may or may not be in git yet         | `git restore <path> 2>/dev/null \|\| rm -f <path>` |

The third pattern protects spec docs that are listed as gaps today but will eventually be committed. Use it for any component spec doc that doesn't yet have a committed `packages/<package>/src/<Name>/<Name>.doc.ts`.
