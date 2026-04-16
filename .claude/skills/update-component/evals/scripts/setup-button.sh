#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures/Button"
cp "$FIXTURES/source.tsx" packages/core/src/Button.tsx
cp "$FIXTURES/story.tsx"  apps/storybook/src/stories/Button.stories.tsx
cp "$FIXTURES/spec.md"    docs/components/Button.md
