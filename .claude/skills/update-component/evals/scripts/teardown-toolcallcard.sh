#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/ToolCallCard.tsx \
            apps/storybook/src/stories/ToolCallCard.stories.tsx
rm -f docs/components/ToolCallCard.md
