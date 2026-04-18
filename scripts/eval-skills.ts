#!/usr/bin/env node
/**
 * Skill eval runner — runs evals/evals.json for each skill in .claude/skills/
 *
 * Usage:
 *   npx tsx scripts/eval-skills.ts               # run all skills
 *   npx tsx scripts/eval-skills.ts audit-a11y    # run one skill
 *   npx tsx scripts/eval-skills.ts audit-a11y --id 1  # run one eval case
 */

import { query } from '@anthropic-ai/claude-agent-sdk'
import { execSync } from 'child_process'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SKILLS_DIR = join(ROOT, '.claude', 'skills')

// Each concurrent gradeAssertion() call opens a query() stream that registers
// an exit listener. Raise the cap to cover the largest assertion batch we run.
process.setMaxListeners(50)

// ── Types ──────────────────────────────────────────────────────────────────

interface EvalCase {
  id: number
  prompt: string
  expected_output: string
  setup: string
  teardown: string
  assertions: string[]
}

interface EvalsFile {
  skill_name: string
  evals: EvalCase[]
}

interface EvalResult {
  id: number
  skill: string
  prompt: string
  passed: string[]
  failed: { assertion: string; reason: string }[]
  error?: string
  cost_usd: number
}

// ── Terminal colors ────────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

const print = (msg: string) => process.stdout.write(msg + '\n')
const passLine = (msg: string) => print(`  ${C.green}✓${C.reset} ${C.dim}${msg}${C.reset}`)
const failLine = (msg: string, reason: string) =>
  print(`  ${C.red}✗${C.reset} ${msg}\n    ${C.dim}└─ ${reason}${C.reset}`)

// ── Skill discovery ────────────────────────────────────────────────────────

function findEvalsFiles(filter?: string): Array<{ skill: string; evalsPath: string }> {
  if (!existsSync(SKILLS_DIR)) return []
  return readdirSync(SKILLS_DIR)
    .filter(name => !filter || name === filter)
    .map(name => ({ skill: name, evalsPath: join(SKILLS_DIR, name, 'evals', 'evals.json') }))
    .filter(({ evalsPath }) => existsSync(evalsPath))
}

// ── LLM grader ────────────────────────────────────────────────────────────

async function gradeAssertion(
  output: string,
  assertion: string,
): Promise<{ pass: boolean; reason: string }> {
  const gradePrompt = `Grade whether an AI agent's output satisfies the assertion below.

ASSERTION:
${assertion}

AGENT OUTPUT (truncated to 8000 chars):
${output.slice(0, 8000)}

Reply with JSON only, no markdown fences: {"pass": true or false, "reason": "one short sentence"}`

  let text = ''
  for await (const message of query({
    prompt: gradePrompt,
    options: {
      cwd: ROOT,
      settingSources: ['user', 'project'],
      permissionMode: 'bypassPermissions',
      allowDangerouslySkipPermissions: true,
    },
  })) {
    if (message.type === 'result' && message.subtype === 'success') {
      text = message.result ?? ''
    }
  }

  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}') as {
      pass?: boolean
      reason?: string
    }
    return {
      pass: parsed.pass ?? false,
      reason: parsed.reason ?? 'No reason provided',
    }
  } catch {
    return { pass: false, reason: `Grader parse error — raw: ${text.slice(0, 80)}` }
  }
}

// ── Skill invocation ───────────────────────────────────────────────────────

async function runSkill(prompt: string): Promise<{ output: string; cost_usd: number }> {
  let output = ''
  let cost_usd = 0

  for await (const message of query({
    prompt,
    options: {
      cwd: ROOT,
      settingSources: ['user', 'project'],
      tools: { type: 'preset', preset: 'claude_code' },
      permissionMode: 'bypassPermissions',
      allowDangerouslySkipPermissions: true,
    },
  })) {
    if (message.type === 'assistant') {
      for (const block of message.message.content) {
        if (block.type === 'text') output += block.text
      }
    }
    if (message.type === 'result' && message.subtype === 'success') {
      cost_usd = message.total_cost_usd
    }
  }

  return { output, cost_usd }
}

// ── Eval execution ─────────────────────────────────────────────────────────

async function runEval(
  evalCase: EvalCase,
  skillName: string,
): Promise<EvalResult> {
  const result: EvalResult = {
    id: evalCase.id,
    skill: skillName,
    prompt: evalCase.prompt,
    passed: [],
    failed: [],
    cost_usd: 0,
  }

  // Setup
  if (evalCase.setup && evalCase.setup !== 'none') {
    try {
      execSync(evalCase.setup, { cwd: ROOT, stdio: 'pipe' })
    } catch (e) {
      result.error = `Setup failed: ${String(e)}`
      return result
    }
  }

  const teardown = () => {
    if (evalCase.teardown) {
      try {
        execSync(evalCase.teardown, { cwd: ROOT, stdio: 'pipe' })
      } catch {
        // teardown failures are non-fatal
      }
    }
  }

  let output = ''
  try {
    const run = await runSkill(evalCase.prompt)
    output = run.output
    result.cost_usd = run.cost_usd
  } catch (e) {
    result.error = `Skill run failed: ${String(e)}`
    teardown()
    return result
  }

  // Grade assertions in parallel — files still exist on disk
  const grades = await Promise.all(
    evalCase.assertions.map(assertion => gradeAssertion(output, assertion)),
  )

  evalCase.assertions.forEach((assertion, i) => {
    const grade = grades[i]!
    if (grade.pass) {
      result.passed.push(assertion)
    } else {
      result.failed.push({ assertion, reason: grade.reason })
    }
  })

  teardown()
  return result
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const skillFilter = args.find(a => !a.startsWith('-'))
  const idFlag = args.indexOf('--id')
  const idFilter = idFlag !== -1 ? parseInt(args[idFlag + 1] ?? '') : undefined

  const files = findEvalsFiles(skillFilter)

  if (files.length === 0) {
    print(
      skillFilter
        ? `No evals.json found for skill "${skillFilter}". Check .claude/skills/${skillFilter}/evals/evals.json`
        : `No skills with evals.json found in ${SKILLS_DIR}`,
    )
    process.exit(1)
  }

  let totalPassed = 0
  let totalFailed = 0
  let totalCost = 0

  for (const { skill, evalsPath } of files) {
    const { evals } = JSON.parse(readFileSync(evalsPath, 'utf8')) as EvalsFile
    const toRun = idFilter != null ? evals.filter(e => e.id === idFilter) : evals

    print(`\n${C.bold}${C.cyan}${skill}${C.reset}  ${C.dim}(${toRun.length} eval${toRun.length !== 1 ? 's' : ''})${C.reset}`)
    print('─'.repeat(64))

    for (const evalCase of toRun) {
      print(`\n${C.bold}Eval ${evalCase.id}${C.reset}  ${C.dim}${evalCase.prompt}${C.reset}`)

      const result = await runEval(evalCase, skill)

      if (result.error) {
        print(`  ${C.red}ERROR:${C.reset} ${result.error}`)
        totalFailed += evalCase.assertions.length
        continue
      }

      for (const a of result.passed) {
        passLine(a)
      }
      for (const { assertion, reason } of result.failed) {
        failLine(assertion, reason)
      }

      totalPassed += result.passed.length
      totalFailed += result.failed.length
      totalCost += result.cost_usd

      const assertCount = result.passed.length + result.failed.length
      const scoreStr =
        result.failed.length === 0
          ? `${C.green}${result.passed.length}/${assertCount}${C.reset}`
          : `${C.red}${result.passed.length}/${assertCount}${C.reset}`
      print(`\n  Score: ${scoreStr}  ${C.dim}cost: $${result.cost_usd.toFixed(4)}${C.reset}`)
    }
  }

  print(`\n${'═'.repeat(64)}`)
  const summary =
    totalFailed === 0
      ? `${C.green}${C.bold}All ${totalPassed} assertions passed${C.reset}`
      : `${C.green}${totalPassed} passed${C.reset}  ${C.red}${totalFailed} failed${C.reset}`
  print(`${summary}  ${C.dim}total cost: $${totalCost.toFixed(4)}${C.reset}`)

  if (totalFailed > 0) process.exit(1)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
