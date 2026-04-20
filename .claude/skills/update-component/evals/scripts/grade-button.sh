#!/usr/bin/env bash
# Programmatic grader for eval 6 (Button execution).
# Run from the project root after the skill has applied its changes.
# Outputs [PASS] / [FAIL] / [SKIP] lines; exits with the number of failures.

SOURCE="packages/core/src/Button.tsx"
STORY="apps/storybook/src/stories/Button.stories.tsx"
SPEC="docs/components/Button.md"
FAILS=0

pass() { echo "[PASS] $1"; }
fail() { echo "[FAIL] $1"; FAILS=$((FAILS + 1)); }
skip() { echo "[SKIP] $1"; }

# 1. Hardcoded '100ms' timing removed from source
if grep -q '100ms' "$SOURCE"; then
  fail "Source still contains hardcoded '100ms' timing value"
else
  pass "No hardcoded '100ms' timing in source"
fi

# 2. var(--ds-duration-fast) or token reference present in source
if grep -qE 'ds-duration-fast|duration\.fast|duration\[' "$SOURCE"; then
  pass "Duration token reference found in source"
else
  fail "No duration token reference found — transition may be unresolved"
fi

# 3. Default React import removed from story file
if grep -qE "^import React from" "$STORY"; then
  fail "Default 'import React from' still present in story file"
else
  pass "No standalone default React import in story file"
fi

# 4. React default import preserved in source file (valid — used for type annotations)
if grep -qE "^import React from" "$SOURCE"; then
  pass "Default React import preserved in source (needed for type annotations)"
else
  fail "Default React import removed from source — it is required for React.* type annotations"
fi

# 5. aria-label in spec doc props table
if grep -q 'aria-label' "$SPEC"; then
  pass "aria-label found in spec doc props table"
else
  fail "aria-label missing from spec doc props table"
fi

# 6. color.on.accent in spec frontmatter tokens list
python3 - "$SPEC" <<'EOF'
import re, sys
content = open(sys.argv[1]).read()
parts = content.split('---', 2)
fm = parts[1] if len(parts) >= 3 else ''
sys.exit(0 if 'color.on.accent' in fm else 1)
EOF
if [ $? -eq 0 ]; then
  pass "color.on.accent found in spec frontmatter tokens list"
else
  fail "color.on.accent missing from spec frontmatter tokens list"
fi

# 7. tabIndex accessibility note corrected to {0} not {-1}
if grep -qE 'tabIndex=\{-1\}' "$SPEC"; then
  fail "Spec doc still references tabIndex={-1} (should be tabIndex={0})"
elif grep -qE 'tabIndex=\{0\}|tabIndex={0}' "$SPEC"; then
  pass "Spec doc correctly states tabIndex={0}"
else
  skip "tabIndex note not found — verify manually"
fi

# 8. ESLint on modified files
if npx eslint "$SOURCE" "$STORY" > /dev/null 2>&1; then
  pass "ESLint passes on modified source and story files"
else
  fail "ESLint errors in modified files — run: npx eslint $SOURCE $STORY"
fi

echo ""
echo "Result: $FAILS check(s) failed"
exit $FAILS
