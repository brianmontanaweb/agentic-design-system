#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/ToolCallCard.tsx \
            apps/storybook/src/stories/ToolCallCard.stories.tsx
git restore docs/components/ToolCallCard.md 2>/dev/null || rm -f docs/components/ToolCallCard.md
