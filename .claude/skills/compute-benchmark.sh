#!/usr/bin/env bash
# Aggregate grading.json files across all evals in an iteration into benchmark.json.
#
# Usage:
#   bash .claude/skills/compute-benchmark.sh <skill> [iteration]
#
# Requires all eval-*/with_skill/grading.json and eval-*/without_skill/grading.json
# to exist. Run grade-eval.sh for each eval/mode pair first.
#
# Writes:
#   <skill>-workspace/iteration-<N>/benchmark.json

set -euo pipefail

SKILL="${1:?Usage: compute-benchmark.sh <skill> [iteration]}"
ITER="${2:-1}"
SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE="$SKILLS_DIR/${SKILL}-workspace/iteration-$ITER"
BENCHMARK="$WORKSPACE/benchmark.json"

[[ -d "$WORKSPACE" ]] || { echo "Error: $WORKSPACE not found. Run run-evals.sh first." >&2; exit 1; }

# Collect stats for one mode (with_skill or without_skill).
# Outputs JSON: {"pass_rate":{"mean":M,"stddev":S},"time_ms":{"mean":M},"tokens":{"mean":M}}
collect_stats() {
  local mode="$1"
  python3 - "$WORKSPACE" "$mode" << 'PY'
import sys, json, os, statistics, pathlib

workspace = pathlib.Path(sys.argv[1])
mode = sys.argv[2]

rates, times, tokens = [], [], []
for grading_file in sorted(workspace.glob(f"eval-*/{mode}/grading.json")):
  with open(grading_file) as f:
    g = json.load(f)
  rates.append(g["summary"]["pass_rate"])
  timing_file = grading_file.parent / "timing.json"
  if timing_file.exists():
    with open(timing_file) as f:
      t = json.load(f)
    times.append(t.get("duration_ms", 0))
    tokens.append(t.get("total_tokens", 0))

def stats(vals):
  if not vals:
    return {"mean": None, "stddev": None, "n": 0}
  return {
    "mean": round(statistics.mean(vals), 4),
    "stddev": round(statistics.stdev(vals), 4) if len(vals) > 1 else 0,
    "n": len(vals),
  }

print(json.dumps({
  "pass_rate": stats(rates),
  "time_ms":   stats(times),
  "tokens":    stats(tokens),
}))
PY
}

echo "Computing benchmark for '$SKILL' iteration $ITER..."

with_stats=$(collect_stats with_skill)
without_stats=$(collect_stats without_skill)

# Delta = with_skill mean - without_skill mean (null if either is missing)
delta_pass=$(python3 -c "
import json
w = json.loads('$with_stats')['pass_rate']['mean']
wo = json.loads('$without_stats')['pass_rate']['mean']
print(round(w - wo, 4) if w is not None and wo is not None else 'null')
")

jq -n \
  --argjson with    "$with_stats" \
  --argjson without "$without_stats" \
  --argjson delta   "$delta_pass" \
  '{
    run_summary: {
      with_skill:    $with,
      without_skill: $without,
      delta: { pass_rate: $delta }
    }
  }' > "$BENCHMARK"

echo ""
echo "benchmark.json written to $BENCHMARK"
echo ""
cat "$BENCHMARK"
