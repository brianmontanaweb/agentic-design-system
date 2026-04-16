#!/usr/bin/env bash
set -euo pipefail
git restore packages/core/src/Button.tsx \
            apps/storybook/src/stories/Button.stories.tsx \
            docs/components/Button.md
