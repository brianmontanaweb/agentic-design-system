#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/AgentStatus.tsx \
            apps/storybook/src/stories/AgentStatus.stories.tsx
rm -f docs/components/AgentStatus.md
