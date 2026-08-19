#!/usr/bin/env bash
set -euo pipefail
git restore packages/agents/src/index.ts
rm -rf packages/agents/src/EvalCleanComponent
rm -f apps/storybook/src/stories/EvalCleanComponent.stories.tsx
