#!/usr/bin/env bash
# Programmatic grader for eval 4 (ToolCallCard execution).
# Run from the project root after the skill has applied its changes.
# Outputs [PASS] / [FAIL] / [SKIP] lines; exits with the number of failures.

SOURCE="packages/agents/src/ToolCallCard/ToolCallCard.tsx"
STORY="apps/storybook/src/stories/ToolCallCard.stories.tsx"
SPEC="packages/agents/src/ToolCallCard/ToolCallCard.doc.ts"
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

# 2. aria-expanded present (confirms button-like trigger)
if grep -q 'aria-expanded' "$SOURCE"; then
  pass "aria-expanded found in source"
else
  fail "aria-expanded missing from source"
fi

# 3. aria-controls present
if grep -q 'aria-controls' "$SOURCE"; then
  pass "aria-controls found in source"
else
  fail "aria-controls missing from source"
fi

# 4. Default React import removed from source
if grep -qE '^import React from' "$SOURCE"; then
  fail "Default 'import React from' still present in source"
else
  pass "No standalone default React import in source"
fi

# 5. Pending story exists in story file
if grep -qE "status[[:space:]]*[:=][[:space:]]*['\"]pending['\"]|export const Pending" "$STORY"; then
  pass "Pending story found in story file"
else
  fail "No Pending story found in story file"
fi

# 6. defaultOpen in spec doc props
if grep -q 'defaultOpen' "$SPEC"; then
  pass "defaultOpen found in spec doc"
else
  fail "defaultOpen missing from spec doc props"
fi

# 7. input prop type is Record<string, unknown> in spec
if grep -q 'Record<string, unknown>' "$SPEC"; then
  pass "input prop type is Record<string, unknown> in spec doc"
else
  fail "input prop type not updated to Record<string, unknown> in spec doc"
fi

# 8. types.ToolCallStatus includes 'pending' (single-quoted — distinct from the
#    double-quoted union string on props.status.type)
if grep -q "'pending'" "$SPEC"; then
  pass "'pending' found in types.ToolCallStatus"
else
  fail "'pending' missing from types.ToolCallStatus"
fi

# 9. ariaNotes documents the button/aria-expanded/aria-controls contract
if grep -qE 'aria-expanded|aria-controls' "$SPEC"; then
  pass "ariaNotes documents aria-expanded/aria-controls"
else
  fail "ariaNotes does not document aria-expanded/aria-controls"
fi

# 10. tokens is no longer the empty fixture placeholder
if grep -q 'tokens: {}' "$SPEC"; then
  fail "tokens is still the empty {} placeholder in spec doc"
else
  pass "tokens is populated in spec doc"
fi

# 11. accent.green preserved in source (semantic token — must not be removed)
if grep -q 'accent.green' "$SOURCE"; then
  pass "color='accent.green' preserved in source"
else
  fail "color='accent.green' removed from source (it is a semantic token and must stay)"
fi

# 12. ESLint on modified files
if npx eslint "$SOURCE" "$STORY" "$SPEC" > /dev/null 2>&1; then
  pass "ESLint passes on modified source and story files"
else
  fail "ESLint errors in modified files — run: npx eslint $SOURCE $STORY $SPEC"
fi

echo ""
echo "Result: $FAILS check(s) failed"
exit $FAILS
