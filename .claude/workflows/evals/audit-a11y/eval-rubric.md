# Audit A11y Workflow — Eval Rubric

Scores the quality of an `/audit-a11y` workflow run (`.claude/workflows/audit-a11y.js`) against a known fixture state. Machine-readable cases with setup/teardown live in `evals.json` beside this file.

> This suite predates its migration from the `audit-a11y` skill. The `run-evals.sh` skill harness does **not** apply to workflows — use the workflow harness beside this directory:
>
> ```bash
> bash .claude/workflows/evals/run-workflow-evals.sh audit-a11y        # run all cases
> bash .claude/workflows/evals/grade-workflow-eval.sh audit-a11y <eval-name>  # grade one
> ```
>
> The runner handles setup/teardown per case and invokes `claude -p` from the repo root. Note: in environments where the headless session lacks the native workflow runner (Dynamic workflows toggled off, or unavailable in `-p`), the session emulates `audit-a11y.js` step by step — verified 2026-07-03 to produce a format-identical report. That still evaluates the audit end-to-end (routing, criteria, verification, report format), but not the `agent()`/`pipeline()` runtime; confirm the native path occasionally with an interactive `/audit-a11y` run.

## Scoring Dimensions

| #   | Dimension            | Max pts | Description                                                                                                                               |
| --- | -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Recall**           | 30      | Found all expected violations — no misses, and the verification stage did not reject real violations                                      |
| 2   | **Precision**        | 25      | No false positives in the final report (token names as hex, valid React imports, per-component animations when the theme override exists) |
| 3   | **Format**           | 20      | Correct markdown tables with all required columns; line numbers on every violation; Passing section present; Summary present with counts  |
| 4   | **Scope**            | 15      | Full runs cover every component in `packages/core/src/` and `packages/agents/src/`; scoped runs (`args`) audit only the listed files      |
| 5   | **No modifications** | 10      | No source files changed — report only                                                                                                     |

**Total: 100 pts.** Grade: ≥90 excellent · 75–89 good · 60–74 needs work · <60 failing.

Precision carries more weight than in the old skill rubric because the workflow has a dedicated adversarial verification stage — false positives surviving to the report mean that stage failed at its one job. Findings rejected by verification appear in the report's "Rejected by verification" appendix; a real violation landing there is a Recall failure, not a Precision success.

## Fixtures

Fixtures are shared with `update-component` — they live in `.claude/skills/update-component/references/fixtures/`. Setup scripts copy them over the committed component sources (directory layout: `packages/agents/src/<Name>/<Name>.tsx`); teardown is `git restore`.

The committed codebase is largely WCAG-compliant, with one known exception verified 2026-07-03: `ToolCallCard` has two true SC 1.4.1 color-only violations (status dot ~line 66, error/success output color ~line 139). Evals 3 and 5 expect exactly those findings and nothing else; update them when ToolCallCard is fixed.

## Test cases

See `evals.json` for the five cases, each with prompt, setup/teardown, expected output, and assertions:

1. **two-fixture-components** — recall across two violated components at once
2. **single-fixture-component** — report format; clean components listed as Passing
3. **committed-codebase** — only the known ToolCallCard SC 1.4.1 findings, zero false positives on committed source
4. **two-fixture-casual** — natural-language prompt routes to the workflow via CLAUDE.md (not an ad-hoc audit)
5. **scoped-run** — `args` scoping: out-of-scope violations on disk must not appear

## Iteration Log

Record misses and false positives after each eval run to guide workflow improvements.

| Date | Test case | Miss or FP | Description | Action taken |
| ---- | --------- | ---------- | ----------- | ------------ |
| —    | —         | —          | —           | —            |
