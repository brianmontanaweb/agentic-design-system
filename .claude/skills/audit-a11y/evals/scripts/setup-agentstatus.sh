#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures"
cp "$FIXTURES/AgentStatus/source.tsx" packages/agents/src/AgentStatus.tsx
