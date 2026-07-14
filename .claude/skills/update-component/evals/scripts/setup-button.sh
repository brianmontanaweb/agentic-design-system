#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures/Button"
cp "$FIXTURES/source.tsx" packages/core/src/Button/Button.tsx
cp "$FIXTURES/story.tsx"  apps/storybook/src/stories/Button.stories.tsx
cp "$FIXTURES/doc.ts"     packages/core/src/Button/Button.doc.ts
