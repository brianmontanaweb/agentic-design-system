#!/usr/bin/env bash
set -euo pipefail
git restore packages/core/src/Button/Button.tsx \
            packages/core/src/Button/Button.doc.ts \
            apps/storybook/src/stories/Button.stories.tsx
