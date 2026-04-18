#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/AgentStatus.tsx \
            apps/storybook/src/stories/AgentStatus.stories.tsx
git restore docs/components/AgentStatus.md 2>/dev/null || rm -f docs/components/AgentStatus.md
