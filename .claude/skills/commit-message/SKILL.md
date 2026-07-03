---
name: commit-message
description: Drafts a conventional commit message from the current uncommitted changes, matching this repo's type(scope) style and history. Use when asked to write, draft, or generate a commit message. Pass --commit to also create the commit.
---

# Commit Message

Draft a commit message for the current changes given `$ARGUMENTS` (optional: `--commit` to also create the commit).

---

## Gotchas

- **Draft-only by default** — output the message; do not run `git commit` unless `--commit` was passed.
- **Staged changes win** — if anything is staged, describe only the staged diff; otherwise describe all uncommitted changes (and say which set you used).
- **Match history, not a generic convention** — read recent `git log` subjects before writing; this repo's style is authoritative over any general conventional-commits habit.
- **Never invent scope from a single stray file** — scope reflects where the substance of the change lives; a drive-by fix in a second area goes in the body, not the scope.

---

## Step 1 — Collect the change

```sh
git status --short
git diff --staged --stat   # if anything is staged
git diff --stat            # otherwise
git log --oneline -15
```

Read the full diff (`git diff --staged` / `git diff`) for the files that carry the substance of the change. Skim generated files (`packages/tokens/src/generated.ts`, snapshots) — name them in the body if regenerated, but do not describe their contents line by line.

## Step 2 — Choose type and scope

Format: `type(scope): subject` — scope omitted when the change is repo-wide.

| Type       | Used for                                         |
| ---------- | ------------------------------------------------ |
| `feat`     | New component, prop, token, skill, or capability |
| `fix`      | Bug or violation fix (a11y fixes count)          |
| `refactor` | Restructuring with no behavior change            |
| `chore`    | Tooling, lint config, versioning, baselines      |
| `test`     | Test or eval additions/changes                   |
| `build`    | Bundling, packaging, build order                 |
| `docs`     | Spec docs or markdown-only changes               |

Scopes seen in history: `skills`, `lint`, `core`, `evals`, plus package names (`tokens`, `agents`) and component names where the change is that narrow. Multi-part changes may join two clauses with `;` in the subject (see `142a14c`).

## Step 3 — Write the message

- Subject: imperative mood, lower-case after the colon, ≤ 72 characters.
- Body (only when the diff spans multiple concerns): short bullets, one per concern, wrapped at 72 columns. State _what and why_, not file-by-file narration.
- No trailer when drafting for the user. If `--commit` was passed, end the body with the `Co-Authored-By: Claude` trailer per project convention.

## Step 4 — Output

```
## Commit message

<the message in a fenced code block, ready to paste>

Based on: staged changes | all uncommitted changes (<n> files)
```

If `--commit` was passed: stage the described files if nothing was staged, commit with the message, and show `git log -1 --stat` output so the result is verifiable.
