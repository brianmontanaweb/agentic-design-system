# Skills

Custom Claude Code skills for this monorepo. Each skill is a directory containing a `SKILL.md` and an `evals/` folder.

## Skills in this repo

| Skill | What it does | Rubric? |
|---|---|---|
| `add-component` | Scaffolds a new component: source, story, spec doc, index export | No |
| `update-component` | Audits and updates an existing component; plans before writing | Yes |
| `audit-a11y` | Full WCAG 2.2 AA audit across all components; report only | Yes |

## Directory layout

```
.claude/skills/
  <skill-name>/
    SKILL.md                  # Frontmatter + step-by-step instructions
    evals/
      evals.json              # Machine-readable test cases with assertions
      eval-rubric.md          # Human-readable scoring guide (when needed — see below)
      scripts/                # Setup, teardown, and grade shell scripts (when needed)
    references/               # Reference files loaded on demand (progressive disclosure)
```

## When to add an eval-rubric.md

Add a rubric when the skill's output quality has **multiple independent dimensions** that don't reduce to binary pass/fail — i.e., when you'd want to score a partial result.

| Skill type | Output | Use rubric? |
|---|---|---|
| Scaffolding (`add-component`) | Files either exist with the right content or they don't | **No** — `evals.json` assertions are sufficient |
| Report/audit (`audit-a11y`) | Report quality varies: recall, precision, format, scope | **Yes** |
| Plan + execute (`update-component`) | Plan quality varies; execution correctness is checkable | **Yes** |

A rubric should define named dimensions, a point allocation, a grading scale, expected violation tables per test case, and an Iteration Log for recording misses and false positives.

## Eval component naming

**Never use a real or plausible production component name in `add-component` evals.** Teardown uses `rm -f`, which would delete the real file.

- Use the `Eval` prefix: `EvalStatusPill`, `EvalIconButton`, `EvalToolProgress`
- The name should still exercise the inference logic being tested (e.g., "Status" → agents package)

Skills that operate *on* existing components (`update-component`, `audit-a11y`) use real names intentionally — their setup copies from fixtures and teardown uses `git restore`.

## Teardown patterns

| Situation | Pattern |
|---|---|
| File created by the eval (didn't exist before) | `rm -f <path>` |
| File overwritten from git-tracked state | `git restore <path>` |
| File that may or may not be in git yet | `git restore <path> 2>/dev/null \|\| rm -f <path>` |

The third pattern protects spec docs that are listed as gaps today but will eventually be committed. Use it for any component spec doc in `packages/agents/` that doesn't yet have a committed `docs/components/<Name>.md`.
