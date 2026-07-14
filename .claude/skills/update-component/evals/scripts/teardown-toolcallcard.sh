#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/ToolCallCard/ToolCallCard.tsx \
            packages/agents/src/ToolCallCard/ToolCallCard.doc.ts \
            apps/storybook/src/stories/ToolCallCard.stories.tsx
