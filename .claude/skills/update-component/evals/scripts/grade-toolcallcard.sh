#!/usr/bin/env bash
# Programmatic grader for eval 4 (ToolCallCard execution).
# Run from the project root after the skill has applied its changes.
# Outputs [PASS] / [FAIL] / [SKIP] lines; exits with the number of failures.

SOURCE="packages/agents/src/ToolCallCard.tsx"
STORY="apps/storybook/src/stories/ToolCallCard.stories.tsx"
SPEC="docs/components/ToolCallCard.md"
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

# 6. defaultOpen in spec doc props table
if grep -q 'defaultOpen' "$SPEC"; then
  pass "defaultOpen found in spec doc"
else
  fail "defaultOpen missing from spec doc props table"
fi

# 7. input prop type is Record<string, unknown> in spec
if grep -q 'Record<string, unknown>' "$SPEC"; then
  pass "input prop type is Record<string, unknown> in spec doc"
else
  fail "input prop type not updated to Record<string, unknown> in spec doc"
fi

# 8. ARIA / Accessibility section in spec
if grep -qiE '^#{1,3} (ARIA|A11y|Accessibility)' "$SPEC"; then
  pass "ARIA/Accessibility section found in spec doc"
else
  fail "No ARIA/Accessibility section in spec doc"
fi

# 9. Tokens frontmatter is not empty (at least one list entry under tokens:)
python3 - "$SPEC" <<'EOF'
import re, sys
content = open(sys.argv[1]).read()
parts = content.split('---', 2)
fm = parts[1] if len(parts) >= 3 else ''
in_tokens = False
for line in fm.splitlines():
    if re.match(r'^tokens:', line):
        in_tokens = True
    elif in_tokens and re.match(r'^\s+-\s+\S', line):
        sys.exit(0)  # found at least one entry
    elif in_tokens and re.match(r'^\S', line):
        break        # left tokens section without finding an entry
sys.exit(1)
EOF
if [ $? -eq 0 ]; then
  pass "Tokens frontmatter contains at least one entry"
else
  fail "Tokens frontmatter appears empty"
fi

# 10. accent.green preserved in source (semantic token — must not be removed)
if grep -q 'accent.green' "$SOURCE"; then
  pass "color='accent.green' preserved in source"
else
  fail "color='accent.green' removed from source (it is a semantic token and must stay)"
fi

# 11. ESLint on modified files
if npx eslint "$SOURCE" "$STORY" > /dev/null 2>&1; then
  pass "ESLint passes on modified source and story files"
else
  fail "ESLint errors in modified files — run: npx eslint $SOURCE $STORY"
fi

echo ""
echo "Result: $FAILS check(s) failed"
exit $FAILS
