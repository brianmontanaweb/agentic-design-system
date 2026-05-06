#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/index.ts
rm -f packages/agents/src/EvalCleanComponent.tsx \
      apps/storybook/src/stories/EvalCleanComponent.stories.tsx \
      docs/components/EvalCleanComponent.md
