#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/AgentStatus/AgentStatus.tsx \
            packages/agents/src/AgentStatus/AgentStatus.doc.ts \
            apps/storybook/src/stories/AgentStatus.stories.tsx
