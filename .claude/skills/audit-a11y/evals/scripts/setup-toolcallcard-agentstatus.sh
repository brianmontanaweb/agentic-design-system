#!/usr/bin/env bash
set -euo pipefail
FIXTURES=".claude/skills/update-component/references/fixtures"
cp "$FIXTURES/ToolCallCard/source.tsx" packages/agents/src/ToolCallCard.tsx
cp "$FIXTURES/AgentStatus/source.tsx"  packages/agents/src/AgentStatus.tsx
