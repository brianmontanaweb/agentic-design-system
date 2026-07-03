export const meta = {
  name: 'audit-a11y',
  description:
    'WCAG 2.2 AA audit of every component in packages/core and packages/agents — one audit agent per component, findings adversarially verified, merged into one report. Report-only.',
}

// Criteria live in one shared reference so this workflow and the component
// skills never drift apart on what counts as a violation.
const CRITERIA = '.claude/skills/shared/references/a11y-audit-criteria.md'

const auditSchema = {
  type: 'object',
  required: ['component', 'file', 'findings', 'passingNote'],
  properties: {
    component: { type: 'string' },
    file: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['line', 'rule', 'wcag', 'severity', 'evidence'],
        properties: {
          line: { type: 'integer' },
          rule: { type: 'string' },
          wcag: { type: 'string' },
          severity: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          evidence: { type: 'string' },
        },
      },
    },
    passingNote: {
      type: 'string',
      description: 'One line on what the component does right; empty string if it has findings',
    },
  },
}

const verifySchema = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['line', 'rule', 'wcag', 'severity', 'verdict', 'reason'],
        properties: {
          line: { type: 'integer' },
          rule: { type: 'string' },
          wcag: { type: 'string' },
          severity: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          verdict: { type: 'string', enum: ['confirmed', 'rejected'] },
          reason: { type: 'string' },
        },
      },
    },
  },
}

// Scope: pass an array of repo-relative source paths to audit only those
// files, e.g. `Run /audit-a11y on ["packages/agents/src/AgentStatus/AgentStatus.tsx"]`.
// With no args, every component in both packages is audited.
let files
if (Array.isArray(args) && args.length > 0) {
  files = args
} else {
  const discovered = await agent(
    'List every component source file in this repository matching packages/core/src/*/*.tsx and packages/agents/src/*/*.tsx. ' +
      'Exclude *.test.tsx files, anything under __tests__/ directories, and index.ts barrels. ' +
      'Include hook sources such as useReducedMotion. Return repo-relative paths.',
    {
      schema: {
        type: 'object',
        required: ['files'],
        properties: { files: { type: 'array', items: { type: 'string' } } },
      },
      label: 'discover components',
    },
  )
  files = discovered.files
}

const audits = await pipeline(files, (file) =>
  agent(
    `Read ${CRITERIA} in full, then read ${file} and audit it against every check category in the criteria. ` +
      'This is a report-only audit: do not modify, create, or delete any file. ' +
      'Return every violation with a 1-indexed line number, a one-sentence rule, the WCAG SC reference, ' +
      'a severity per the criteria definitions, and a short evidence quote from the source. ' +
      'Respect the false-positive traps section. If the component is clean, return an empty findings array ' +
      'and a one-line passingNote naming what it does right.',
    { schema: auditSchema, label: `audit ${file}` },
  ),
)

// Adversarial verification: a second agent per flagged component tries to
// knock each finding down before it reaches the report.
const verified = await pipeline(audits, async (audit) => {
  if (!audit || audit.findings.length === 0) return audit
  const review = await agent(
    `The following accessibility violations were claimed against ${audit.file}:\n\n` +
      JSON.stringify(audit.findings, null, 2) +
      `\n\nAssume each claim may be a false positive. Read ${CRITERIA} (especially the false-positive traps) ` +
      `and re-read ${audit.file}, then for each claim return a verdict: "confirmed" only if the cited line ` +
      'actually violates the criteria as written; otherwise "rejected" with the reason. ' +
      'Correct the line number or severity if the violation is real but miscited. ' +
      'Do not modify any file.',
    { schema: verifySchema, label: `verify ${audit.component}` },
  )
  return {
    ...audit,
    findings: review.findings.filter((f) => f.verdict === 'confirmed'),
    rejected: review.findings.filter((f) => f.verdict === 'rejected'),
  }
})

// Deterministic report assembly — format is part of the contract (see
// .claude/workflows/evals/audit-a11y/eval-rubric.md), so it is built here
// rather than left to an agent.
const severityRank = { High: 0, Medium: 1, Low: 2 }
const violations = []
const passing = []
const rejected = []

for (const audit of verified) {
  if (!audit) continue
  for (const f of audit.findings) {
    violations.push({ component: audit.component, file: audit.file, ...f })
  }
  for (const f of audit.rejected ?? []) {
    rejected.push({ component: audit.component, ...f })
  }
  if (audit.findings.length === 0) {
    passing.push({ component: audit.component, notes: audit.passingNote || 'no violations found' })
  }
}

violations.sort(
  (a, b) => severityRank[a.severity] - severityRank[b.severity] || a.component.localeCompare(b.component),
)

const date = new Date().toISOString().slice(0, 10)
const lines = [`## A11y Audit Report — ${date}`, '', '### Violations', '']

if (violations.length === 0) {
  lines.push('None.')
} else {
  lines.push('| Component | File | Line | Rule | WCAG SC | Severity |')
  lines.push('|---|---|---|---|---|---|')
  for (const v of violations) {
    lines.push(`| ${v.component} | ${v.file} | ${v.line} | ${v.rule} | ${v.wcag} | ${v.severity} |`)
  }
}

lines.push('', '### Passing', '')
lines.push('| Component | Notes |')
lines.push('|---|---|')
for (const p of passing.sort((a, b) => a.component.localeCompare(b.component))) {
  lines.push(`| ${p.component} | ${p.notes} |`)
}

const flagged = new Set(violations.map((v) => v.component)).size
const high = violations.filter((v) => v.severity === 'High').length
lines.push('', '### Summary', '')
lines.push(`${violations.length} violations across ${flagged} components. ${high} are High severity.`)

if (rejected.length > 0) {
  lines.push('', '### Rejected by verification', '')
  lines.push('| Component | Line | Claimed rule | Reason rejected |')
  lines.push('|---|---|---|---|')
  for (const r of rejected) {
    lines.push(`| ${r.component} | ${r.line} | ${r.rule} | ${r.reason} |`)
  }
}

return lines.join('\n')
