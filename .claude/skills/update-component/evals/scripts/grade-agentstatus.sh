#!/usr/bin/env bash
# Programmatic grader for eval 5 (AgentStatus execution).
# Run from the project root after the skill has applied its changes.
# Outputs [PASS] / [FAIL] / [SKIP] lines; exits with the number of failures.

SOURCE="packages/agents/src/AgentStatus/AgentStatus.tsx"
STORY="apps/storybook/src/stories/AgentStatus.stories.tsx"
SPEC="packages/agents/src/AgentStatus/AgentStatus.doc.ts"
FAILS=0

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; FAILS=$((FAILS + 1)); }

# 1. No hardcoded hex values in source
HEX=$(grep -oE '#[0-9a-fA-F]{3,8}' "$SOURCE" || true)
if [ -n "$HEX" ]; then
  fail "Source still contains hardcoded hex: $(echo "$HEX" | tr '\n' ' ')"
else
  pass "No hardcoded hex values in source"
fi

# 2. Semantic token references present (color.agent.status.*)
if grep -qE 'color\.agent\.status\.' "$SOURCE"; then
  pass "color.agent.status.* token references found in source"
else
  fail "No color.agent.status.* token references found in source"
fi

# 3. AgentStatusValue type includes 'waiting'
if grep -qE "AgentStatusValue[^=]" "$SOURCE" && grep -qE "'waiting'|\"waiting\"" "$SOURCE"; then
  pass "'waiting' found in source (type + config)"
else
  fail "'waiting' missing from AgentStatusValue type or statusConfig"
fi

# 4. AgentStatusValue type includes 'cancelled'
if grep -qE "'cancelled'|\"cancelled\"" "$SOURCE"; then
  pass "'cancelled' found in source (type + config)"
else
  fail "'cancelled' missing from AgentStatusValue type or statusConfig"
fi

# 5. role="status" on container
if grep -qE "role=['\"]status['\"]" "$SOURCE"; then
  pass "role=\"status\" found in source"
else
  fail "role=\"status\" missing from source"
fi

# 6. aria-live="polite" on container
if grep -qE "aria-live=['\"]polite['\"]" "$SOURCE"; then
  pass "aria-live=\"polite\" found in source"
else
  fail "aria-live=\"polite\" missing from source"
fi

# 7. Visually-hidden text present (any common pattern)
if grep -qiE 'srOnly|VisuallyHidden|visuallyHidden|sr-only|clip-path|clip:' "$SOURCE"; then
  pass "Visually-hidden text pattern found in source"
else
  fail "No visually-hidden text pattern found in source (expected srOnly, VisuallyHidden, or equivalent)"
fi

# 8. Waiting story exists
if grep -qE "status[[:space:]]*[:=][[:space:]]*['\"]waiting['\"]|export const Waiting" "$STORY"; then
  pass "Waiting story found in story file"
else
  fail "No Waiting story found in story file"
fi

# 9. Cancelled story exists
if grep -qE "status[[:space:]]*[:=][[:space:]]*['\"]cancelled['\"]|export const Cancelled" "$STORY"; then
  pass "Cancelled story found in story file"
else
  fail "No Cancelled story found in story file"
fi

# 10. argTypes options includes 'waiting' and 'cancelled'
if grep -q 'waiting' "$STORY" && grep -q 'cancelled' "$STORY"; then
  pass "'waiting' and 'cancelled' found in story file (argTypes options)"
else
  fail "'waiting' or 'cancelled' missing from story file argTypes options"
fi

# 11. types.AgentStatusValue lists all 6 MCP states
python3 - "$SPEC" <<'EOF'
import re, sys
content = open(sys.argv[1]).read()
required = {'idle', 'running', 'waiting', 'done', 'error', 'cancelled'}
found = set(re.findall(r"'(idle|running|waiting|done|error|cancelled)'", content))
missing = required - found
sys.exit(1 if missing else 0)
EOF
if [ $? -eq 0 ]; then
  pass "types.AgentStatusValue lists all 6 states"
else
  fail "types.AgentStatusValue is missing one or more of: idle, running, waiting, done, error, cancelled"
fi

# 12. ariaNotes documents role="status", aria-live, and visually-hidden text
if grep -qE 'role="status"|role=.status.' "$SPEC" && grep -qE 'aria-live' "$SPEC" && grep -qiE 'visually-hidden|VisuallyHidden' "$SPEC"; then
  pass "ariaNotes documents role=\"status\", aria-live, and visually-hidden text"
else
  fail "ariaNotes is missing role=\"status\", aria-live, or visually-hidden text documentation"
fi

# 13. ESLint on modified files
if npx eslint "$SOURCE" "$STORY" "$SPEC" > /dev/null 2>&1; then
  pass "ESLint passes on modified source and story files"
else
  fail "ESLint errors in modified files — run: npx eslint $SOURCE $STORY $SPEC"
fi

echo ""
echo "Result: $FAILS check(s) failed"
exit $FAILS
