#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures/ToolCallCard"
cp "$FIXTURES/source.tsx" packages/agents/src/ToolCallCard/ToolCallCard.tsx
cp "$FIXTURES/story.tsx"  apps/storybook/src/stories/ToolCallCard.stories.tsx
cp "$FIXTURES/doc.ts"     packages/agents/src/ToolCallCard/ToolCallCard.doc.ts
