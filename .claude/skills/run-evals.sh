#!/usr/bin/env bash
# Run all evals for a skill in both with_skill and without_skill modes.
#
# Usage:
#   bash .claude/skills/run-evals.sh <skill-name> [iteration]
#
# Outputs:
#   .claude/skills/<skill>-workspace/iteration-<N>/
#     eval-<name>/
#       with_skill/outputs/response.txt  timing.json
#       without_skill/outputs/response.txt  timing.json
#
# After running, grade each eval with grade-eval.sh, then compute-benchmark.sh.

set -euo pipefail

SKILL="${1:?Usage: run-evals.sh <skill-name> [iteration]}"
ITER="${2:-1}"
SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$SKILLS_DIR/$SKILL"
WORKSPACE="$SKILLS_DIR/${SKILL}-workspace/iteration-$ITER"
EVALS="$SKILL_DIR/evals/evals.json"
SKILL_MD="$SKILL_DIR/SKILL.md"

[[ -f "$EVALS"    ]] || { echo "Error: $EVALS not found"    >&2; exit 1; }
[[ -f "$SKILL_MD" ]] || { echo "Error: $SKILL_MD not found" >&2; exit 1; }

# Run a setup/teardown value — may be an inline command or a path to a script.
run_hook() {
  local val="$1"
  [[ -z "$val" ]] && return 0
  if [[ -f "$val" ]]; then
    bash "$val"
  else
    bash -c "$val"
  fi
}

# Invoke claude -p and capture the text response plus timing.
run_claude() {
  local mode="$1"   # with_skill | without_skill
  local prompt="$2"
  local out_dir="$3"

  local extra_args=()
  if [[ "$mode" == "with_skill" ]]; then
    extra_args+=(--append-system-prompt "$(cat "$SKILL_MD")")
  fi

  local start end duration raw result tokens

  start=$(date +%s%3N)
  raw=$(claude -p \
    --output-format json \
    --dangerously-skip-permissions \
    "${extra_args[@]}" \
    "$prompt" 2>/dev/null)
  end=$(date +%s%3N)
  duration=$((end - start))

  # --output-format json wraps: {"type":"result","subtype":"success","result":"...","usage":{...}}
  result=$(echo "$raw" | jq -r 'if type == "object" then .result // . else . end' 2>/dev/null || echo "$raw")
  tokens=$(echo "$raw" | jq -r '(.usage.input_tokens // 0) + (.usage.output_tokens // 0)' 2>/dev/null || echo 0)

  printf '%s' "$result" > "$out_dir/outputs/response.txt"
  printf '{"total_tokens":%s,"duration_ms":%s}\n' "$tokens" "$duration" > "$out_dir/timing.json"
}

EVAL_COUNT=$(jq '.evals | length' "$EVALS")
echo "Running $EVAL_COUNT evals for '$SKILL' (iteration $ITER)"
mkdir -p "$WORKSPACE"

for i in $(seq 0 $((EVAL_COUNT - 1))); do
  NAME=$(jq -r ".evals[$i].name" "$EVALS")
  PROMPT=$(jq -r ".evals[$i].prompt" "$EVALS")
  SETUP=$(jq -r ".evals[$i].setup // empty" "$EVALS")
  TEARDOWN=$(jq -r ".evals[$i].teardown // empty" "$EVALS")

  EVAL_DIR="$WORKSPACE/eval-$NAME"
  WITH_DIR="$EVAL_DIR/with_skill"
  WITHOUT_DIR="$EVAL_DIR/without_skill"
  mkdir -p "$WITH_DIR/outputs" "$WITHOUT_DIR/outputs"

  echo ""
  echo "[$((i+1))/$EVAL_COUNT] eval-$NAME"

  echo "  → with_skill"
  run_hook "$SETUP"
  run_claude with_skill "$PROMPT" "$WITH_DIR"
  run_hook "$TEARDOWN"

  echo "  → without_skill (baseline)"
  run_hook "$SETUP"
  run_claude without_skill "$PROMPT" "$WITHOUT_DIR"
  run_hook "$TEARDOWN"
done

echo ""
echo "Done. Results in: $WORKSPACE"
echo "Next: bash .claude/skills/grade-eval.sh $SKILL <eval-name> <mode> $ITER"
