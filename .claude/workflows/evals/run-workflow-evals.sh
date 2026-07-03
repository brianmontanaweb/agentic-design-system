#!/usr/bin/env bash
# Run all evals for a workflow in .claude/workflows/.
#
# Workflow counterpart to .claude/skills/run-evals.sh. Differences:
#   - no SKILL.md system-prompt injection — the workflow file itself is the
#     artifact under test, loaded by claude from .claude/workflows/
#   - single run mode (no with/without A-B): the baseline comparison that
#     makes sense for skills has no equivalent when the command doesn't exist
#     without its file
#
# Usage:
#   bash .claude/workflows/evals/run-workflow-evals.sh <workflow-name> [iteration] [--id N]
#
# --id N runs only the eval case with that id.
#
# Outputs:
#   .claude/workflows/evals/<workflow>-workspace/iteration-<N>/
#     eval-<name>/outputs/response.txt  timing.json
#
# After running, grade each eval with grade-workflow-eval.sh.

set -euo pipefail

WORKFLOW="${1:?Usage: run-workflow-evals.sh <workflow-name> [iteration] [--id N]}"
ITER="${2:-1}"
ONLY_ID=""
if [[ "${2:-}" == "--id" ]]; then ITER=1; ONLY_ID="${3:?--id requires a value}"; fi
if [[ "${3:-}" == "--id" ]]; then ONLY_ID="${4:?--id requires a value}"; fi
EVALS_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$EVALS_DIR/../../.." && pwd)"
WORKFLOW_FILE="$ROOT/.claude/workflows/$WORKFLOW.js"
EVALS="$EVALS_DIR/$WORKFLOW/evals.json"
WORKSPACE="$EVALS_DIR/${WORKFLOW}-workspace/iteration-$ITER"

[[ -f "$EVALS"         ]] || { echo "Error: $EVALS not found"         >&2; exit 1; }
[[ -f "$WORKFLOW_FILE" ]] || { echo "Error: $WORKFLOW_FILE not found" >&2; exit 1; }

# Run a setup/teardown value — may be an inline command or a path to a script.
run_hook() {
  local val="$1"
  [[ -z "$val" ]] && return 0
  if [[ -f "$ROOT/$val" ]]; then
    (cd "$ROOT" && bash "$val")
  else
    (cd "$ROOT" && bash -c "$val")
  fi
}

# Invoke claude -p from the repo root so the project workflow loads, and
# capture the text response plus timing. Workflows launch without an
# interactive approval prompt in -p mode.
run_claude() {
  local prompt="$1"
  local out_dir="$2"

  local start end duration raw result tokens

  # date +%s only — %N is GNU-specific and emits a literal N on macOS/BSD
  start=$(date +%s)
  raw=$(cd "$ROOT" && claude -p \
    --output-format json \
    --dangerously-skip-permissions \
    "$prompt" 2>/dev/null)
  end=$(date +%s)
  duration=$(((end - start) * 1000))

  result=$(echo "$raw" | jq -r 'if type == "object" then .result // . else . end' 2>/dev/null || echo "$raw")
  tokens=$(echo "$raw" | jq -r '(.usage.input_tokens // 0) + (.usage.output_tokens // 0)' 2>/dev/null || echo 0)

  printf '%s' "$result" > "$out_dir/outputs/response.txt"
  printf '{"total_tokens":%s,"duration_ms":%s}\n' "$tokens" "$duration" > "$out_dir/timing.json"
}

EVAL_COUNT=$(jq '.evals | length' "$EVALS")
FAILURES=0
echo "Running $EVAL_COUNT evals for workflow '$WORKFLOW' (iteration $ITER)"
mkdir -p "$WORKSPACE"

for i in $(seq 0 $((EVAL_COUNT - 1))); do
  ID=$(jq -r ".evals[$i].id" "$EVALS")
  if [[ -n "$ONLY_ID" && "$ID" != "$ONLY_ID" ]]; then continue; fi
  NAME=$(jq -r ".evals[$i].name" "$EVALS")
  PROMPT=$(jq -r ".evals[$i].prompt" "$EVALS")
  SETUP=$(jq -r ".evals[$i].setup // empty" "$EVALS")
  TEARDOWN=$(jq -r ".evals[$i].teardown // empty" "$EVALS")

  EVAL_DIR="$WORKSPACE/eval-$NAME"
  mkdir -p "$EVAL_DIR/outputs"

  echo ""
  echo "[$((i+1))/$EVAL_COUNT] eval-$NAME"

  # Teardown must run even if the claude call fails — a skipped teardown
  # leaves fixture violations in packages/ and poisons every later case.
  run_hook "$SETUP"
  CASE_STATUS=0
  run_claude "$PROMPT" "$EVAL_DIR" || CASE_STATUS=$?
  run_hook "$TEARDOWN"
  if [[ $CASE_STATUS -ne 0 ]]; then
    echo "  eval-$NAME FAILED (exit $CASE_STATUS) — teardown ran; continuing" >&2
    FAILURES=$((FAILURES + 1))
  fi
done

echo ""
echo "Done ($FAILURES failed). Results in: $WORKSPACE"
echo "Next: bash $EVALS_DIR/grade-workflow-eval.sh $WORKFLOW <eval-name> $ITER"
exit $((FAILURES > 0 ? 1 : 0))
