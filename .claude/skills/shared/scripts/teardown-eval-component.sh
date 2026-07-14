#!/usr/bin/env bash
# Removes everything setup-eval-component.sh created, plus any artifacts a
# sub-skill eval produced for EvalStatusPill.
set -euo pipefail

rm -rf packages/agents/src/EvalStatusPill
rm -f apps/storybook/src/stories/EvalStatusPill.stories.tsx
git restore packages/agents/src/index.ts 2>/dev/null || true
