import { join } from 'node:path'
import { waitForPageReady } from '@storybook/test-runner'
import { toMatchImageSnapshot, type MatchImageSnapshotOptions } from 'jest-image-snapshot'
import type { TestRunnerConfig } from '@storybook/test-runner'
import AxeBuilder from '@axe-core/playwright'

// Snapshots are stored alongside the storybook app so they can be committed
// as baselines and reviewed in PRs. Run `npm run test:visual:update -w apps/storybook`
// to regenerate all baselines after intentional visual changes.
const snapshotOptions: MatchImageSnapshotOptions = {
  customSnapshotsDir: join(process.cwd(), '__snapshots__'),
  // 1% pixel difference tolerance — accounts for sub-pixel anti-aliasing
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  // Diff images are written next to snapshots for easy inspection on failure
  diffDirection: 'horizontal',
}

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot })
  },

  async postVisit(page, context) {
    // 1. Accessibility check — runs axe-core against the story root.
    //    Any WCAG 2.x violation fails the test with a descriptive message.
    const results = await new AxeBuilder({ page }).include('#storybook-root').analyze()

    if (results.violations.length > 0) {
      const details = results.violations
        .map(
          (v) =>
            `  [${v.impact ?? 'unknown'}] ${v.id}: ${v.description}\n` +
            v.nodes.map((n) => `    ${n.html}`).join('\n')
        )
        .join('\n\n')
      throw new Error(`Accessibility violations in "${context.id}":\n\n${details}`)
    }

    // 2. Reduced-motion snapshot — taken before the freeze style is injected so the
    //    prefers-reduced-motion CSS paths in AgenticProvider and theme.ts are exercised
    //    naturally. Chromium emulates the media query, triggering the 0.01ms
    //    animation-duration overrides and static ds-pulse/ds-blink keyframes, which
    //    makes the screenshot deterministic without a JS-injected freeze style.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await waitForPageReady(page)
    const reducedRoot = await page.$('#storybook-root')
    const reducedImage = await (reducedRoot ?? page).screenshot()
    expect(reducedImage).toMatchImageSnapshot({
      ...snapshotOptions,
      customSnapshotIdentifier: `${context.id}-reduced-motion`,
    })
    await page.emulateMedia({ reducedMotion: 'no-preference' })

    // 3. Freeze all CSS animations and transitions so the default screenshot is
    //    deterministic. Without this, ThinkingIndicator, AgentStatus(running), and
    //    StreamingText cursor produce flaky diffs on every run.
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })

    await waitForPageReady(page)

    // 4. Capture only the story root element, not the full Storybook chrome.
    //    Falls back to full page if the element is not found.
    const root = await page.$('#storybook-root')
    const image = await (root ?? page).screenshot()

    expect(image).toMatchImageSnapshot({
      ...snapshotOptions,
      customSnapshotIdentifier: context.id,
    })
  },
}

export default config
