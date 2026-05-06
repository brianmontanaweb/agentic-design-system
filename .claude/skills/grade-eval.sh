#!/usr/bin/env bash
# Grade one eval run's assertions and write grading.json.
#
# Usage:
#   bash .claude/skills/grade-eval.sh <skill> <eval-name> <mode> [iteration]
#
# <mode> is "with_skill" or "without_skill".
#
# Reads:
#   <skill>-workspace/iteration-<N>/eval-<name>/<mode>/outputs/response.txt
# Writes:
#   <skill>-workspace/iteration-<N>/eval-<name>/<mode>/grading.json

set -euo pipefail

SKILL="${1:?Usage: grade-eval.sh <skill> <eval-name> <mode> [iteration]}"
EVAL_NAME="${2:?}"
MODE="${3:?}"   # with_skill | without_skill
ITER="${4:-1}"

SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
EVALS="$SKILLS_DIR/$SKILL/evals/evals.json"
EVAL_DIR="$SKILLS_DIR/${SKILL}-workspace/iteration-$ITER/eval-$EVAL_NAME/$MODE"
RESPONSE_FILE="$EVAL_DIR/outputs/response.txt"
GRADING_FILE="$EVAL_DIR/grading.json"

[[ -f "$RESPONSE_FILE" ]] || { echo "Error: $RESPONSE_FILE not found. Run run-evals.sh first." >&2; exit 1; }

RESPONSE=$(cat "$RESPONSE_FILE")
ASSERTIONS=$(jq -c ".evals[] | select(.name == \"$EVAL_NAME\") | .assertions" "$EVALS")

if [[ "$ASSERTIONS" == "null" || -z "$ASSERTIONS" ]]; then
  echo "No assertions found for eval '$EVAL_NAME' in $EVALS" >&2; exit 1
fi

GRADE_SCHEMA=$(cat << 'SCHEMA'
{
  "type": "object",
  "required": ["assertion_results", "summary"],
  "properties": {
    "assertion_results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["text", "passed", "evidence"],
        "properties": {
          "text":     { "type": "string" },
          "passed":   { "type": "boolean" },
          "evidence": { "type": "string" }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["passed", "failed", "total", "pass_rate"],
      "properties": {
        "passed":    { "type": "integer" },
        "failed":    { "type": "integer" },
        "total":     { "type": "integer" },
        "pass_rate": { "type": "number" }
      }
    }
  }
}
SCHEMA
)

GRADE_PROMPT="Grade the following eval output against each assertion.

For each assertion return:
- passed: true if the output clearly satisfies it, false otherwise
- evidence: a short, specific quote or observation from the output (not a general opinion)

Require concrete evidence for PASS. If the assertion says something must exist and it is absent or vague, that is a FAIL.

ASSERTIONS:
$ASSERTIONS

OUTPUT:
$RESPONSE"

echo "Grading eval-$EVAL_NAME/$MODE..."

raw=$(claude -p \
  --output-format json \
  --json-schema "$GRADE_SCHEMA" \
  --dangerously-skip-permissions \
  "$GRADE_PROMPT" 2>/dev/null)

result=$(echo "$raw" | jq -r 'if type == "object" then .result // . else . end' 2>/dev/null || echo "$raw")

# Compute summary counts from assertion_results
echo "$result" | jq '
  . as $root |
  ($root.assertion_results | length) as $total |
  ($root.assertion_results | map(select(.passed)) | length) as $passed |
  ($total - $passed) as $failed |
  $root + {
    summary: {
      passed:    $passed,
      failed:    $failed,
      total:     $total,
      pass_rate: (if $total > 0 then ($passed / $total) else 0 end)
    }
  }
' > "$GRADING_FILE"

PASS_RATE=$(jq '.summary.pass_rate' "$GRADING_FILE")
PASSED=$(jq '.summary.passed' "$GRADING_FILE")
TOTAL=$(jq '.summary.total' "$GRADING_FILE")
echo "  $PASSED/$TOTAL assertions passed (pass_rate: $PASS_RATE)"
echo "  Written: $GRADING_FILE"
