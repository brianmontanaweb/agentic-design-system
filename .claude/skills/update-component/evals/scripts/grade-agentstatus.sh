#!/usr/bin/env bash
# Programmatic grader for eval 5 (AgentStatus execution).
# Run from the project root after the skill has applied its changes.
# Outputs [PASS] / [FAIL] / [SKIP] lines; exits with the number of failures.

SOURCE="packages/agents/src/AgentStatus.tsx"
STORY="apps/storybook/src/stories/AgentStatus.stories.tsx"
SPEC="docs/components/AgentStatus.md"
FAILS=0

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; FAILS=$((FAILS + 1)); }
skip() { echo "[SKIP] $1"; }

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

# 11. mcp-states frontmatter lists all 6 states
python3 - "$SPEC" <<'EOF'
import re, sys
content = open(sys.argv[1]).read()
parts = content.split('---', 2)
fm = parts[1] if len(parts) >= 3 else ''
required = {'idle', 'running', 'waiting', 'done', 'error', 'cancelled'}
found = set(re.findall(r'\b(idle|running|waiting|done|error|cancelled)\b', fm))
missing = required - found
if missing:
    print(f"Missing from mcp-states frontmatter: {', '.join(sorted(missing))}", file=sys.stderr)
    sys.exit(1)
sys.exit(0)
EOF
if [ $? -eq 0 ]; then
  pass "mcp-states frontmatter lists all 6 states"
else
  fail "mcp-states frontmatter missing states: $(python3 - "$SPEC" 2>&1 1>/dev/null <<'EOF'
import re, sys
content = open(sys.argv[1]).read()
parts = content.split('---', 2)
fm = parts[1] if len(parts) >= 3 else ''
required = {'idle', 'running', 'waiting', 'done', 'error', 'cancelled'}
found = set(re.findall(r'\b(idle|running|waiting|done|error|cancelled)\b', fm))
print(', '.join(sorted(required - found)))
EOF
)"
fi

# 12. Spec doc states table has waiting and cancelled rows
if grep -q 'waiting' "$SPEC" && grep -q 'cancelled' "$SPEC"; then
  pass "States table rows for 'waiting' and 'cancelled' found in spec doc"
else
  fail "'waiting' or 'cancelled' row missing from spec doc states table"
fi

# 13. ARIA section in spec
if grep -qiE '^#{1,3} (ARIA|A11y|Accessibility)' "$SPEC"; then
  pass "ARIA/Accessibility section found in spec doc"
else
  fail "No ARIA/Accessibility section in spec doc"
fi

# 14. npm run build — grader verifies from transcript
skip "npm run build — verify exit code from transcript"

echo ""
echo "Result: $FAILS check(s) failed"
exit $FAILS
