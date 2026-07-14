#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures/AgentStatus"
cp "$FIXTURES/source.tsx" packages/agents/src/AgentStatus/AgentStatus.tsx
cp "$FIXTURES/story.tsx"  apps/storybook/src/stories/AgentStatus.stories.tsx
cp "$FIXTURES/doc.ts"     packages/agents/src/AgentStatus/AgentStatus.doc.ts
