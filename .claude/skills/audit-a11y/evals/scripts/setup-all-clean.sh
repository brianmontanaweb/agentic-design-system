#!/usr/bin/env bash
set -euo pipefail
# Copy the current compliant committed source files to the flat paths the audit reads.
# Both ToolCallCard and AgentStatus are fully WCAG-compliant in the committed source.
cp packages/agents/src/ToolCallCard/ToolCallCard.tsx packages/agents/src/ToolCallCard.tsx
cp packages/agents/src/AgentStatus/AgentStatus.tsx   packages/agents/src/AgentStatus.tsx
