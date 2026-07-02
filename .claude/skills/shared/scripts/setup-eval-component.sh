#!/usr/bin/env bash
# Creates a minimal EvalStatusPill component in packages/agents so sub-skill
# evals (story, tests, spec, verify) have an existing component to operate on.
# Teardown: shared/scripts/teardown-eval-component.sh
set -euo pipefail

DIR="packages/agents/src/EvalStatusPill"
mkdir -p "$DIR"

cat > "$DIR/EvalStatusPill.tsx" <<'EOF'
import { HStack, Text, VisuallyHidden } from '@chakra-ui/react'

export type EvalStatusPillStatus = 'idle' | 'running' | 'done' | 'error'

export interface EvalStatusPillProps {
  status: EvalStatusPillStatus
  label?: string
}

const statusText: Record<EvalStatusPillStatus, string> = {
  idle: 'Idle',
  running: 'Running',
  done: 'Done',
  error: 'Error',
}

export function EvalStatusPill({ status, label }: EvalStatusPillProps) {
  return (
    <HStack gap={2} role="status" aria-live="polite">
      <VisuallyHidden>{statusText[status]}</VisuallyHidden>
      <Text fontSize="sm" color="color.text.muted" fontFamily="mono">
        {label ?? statusText[status]}
      </Text>
    </HStack>
  )
}
EOF

cat > "$DIR/index.ts" <<'EOF'
export * from './EvalStatusPill'
EOF

if ! grep -q "EvalStatusPill" packages/agents/src/index.ts; then
  cat >> packages/agents/src/index.ts <<'EOF'
export { EvalStatusPill } from './EvalStatusPill'
export type { EvalStatusPillProps, EvalStatusPillStatus } from './EvalStatusPill'
EOF
fi
