#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures/ToolCallCard"
cp "$FIXTURES/source.tsx" packages/agents/src/ToolCallCard.tsx
cp "$FIXTURES/story.tsx"  apps/storybook/src/stories/ToolCallCard.stories.tsx
cp "$FIXTURES/spec.md"    docs/components/ToolCallCard.md
