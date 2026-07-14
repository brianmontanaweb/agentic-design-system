#!/usr/bin/env node
/**
 * Figma vs Storybook visual diff — pixel-compares two PNGs and writes a diff image.
 *
 * Usage:
 *   npx tsx scripts/figma-diff.ts <figmaPng> <storybookPng> <outDiffPng> [--threshold 0.01]
 *
 * Prints a JSON result to stdout and exits non-zero if the diff exceeds the
 * threshold (fraction of pixels, default 0.01 = 1%, matching the tolerance
 * apps/storybook/.storybook/test-runner.ts already uses for baseline snapshots).
 */
import { readFileSync, writeFileSync } from 'fs'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const [, , figmaPath, storybookPath, diffPath, ...rest] = process.argv

if (!figmaPath || !storybookPath || !diffPath) {
  console.error('Usage: figma-diff.ts <figmaPng> <storybookPng> <outDiffPng> [--threshold 0.01]')
  process.exit(2)
}

const thresholdFlagIndex = rest.indexOf('--threshold')
const threshold = thresholdFlagIndex >= 0 ? Number(rest[thresholdFlagIndex + 1]) : 0.01

const figma = PNG.sync.read(readFileSync(figmaPath))
const storybook = PNG.sync.read(readFileSync(storybookPath))

const width = Math.min(figma.width, storybook.width)
const height = Math.min(figma.height, storybook.height)
const dimensionMismatch = figma.width !== storybook.width || figma.height !== storybook.height

// pixelmatch requires equal dimensions. Rather than stretching either image
// (which would distort the pixel comparison), compare the overlapping region
// and report the mismatch separately so it can't be missed in the output.
function cropTo(png: PNG, w: number, h: number): PNG {
  if (png.width === w && png.height === h) return png
  const cropped = new PNG({ width: w, height: h })
  PNG.bitblt(png, cropped, 0, 0, w, h, 0, 0)
  return cropped
}

const a = cropTo(figma, width, height)
const b = cropTo(storybook, width, height)
const diff = new PNG({ width, height })

const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 })
const totalPixels = width * height
const diffRatio = totalPixels > 0 ? diffPixels / totalPixels : 1

writeFileSync(diffPath, PNG.sync.write(diff))

const result = {
  figmaPath,
  storybookPath,
  diffPath,
  figmaDimensions: `${figma.width}x${figma.height}`,
  storybookDimensions: `${storybook.width}x${storybook.height}`,
  dimensionMismatch,
  comparedDimensions: `${width}x${height}`,
  diffPixels,
  totalPixels,
  diffPercent: Number((diffRatio * 100).toFixed(2)),
  thresholdPercent: Number((threshold * 100).toFixed(2)),
  pass: !dimensionMismatch && diffRatio <= threshold,
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.pass ? 0 : 1)
