import { join } from 'node:path'
import { waitForPageReady } from '@storybook/test-runner'
import { toMatchImageSnapshot, type MatchImageSnapshotOptions } from 'jest-image-snapshot'
import type { TestRunnerConfig } from '@storybook/test-runner'

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
    // Freeze all CSS animations and transitions so screenshots are deterministic.
    // Without this, ThinkingIndicator, AgentStatus(running), and StreamingText
    // cursor produce flaky diffs on every run.
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

    // Capture only the story root element, not the full Storybook chrome.
    // Falls back to full page if the element is not found.
    const root = await page.$('#storybook-root')
    const image = await (root ?? page).screenshot()

    expect(image).toMatchImageSnapshot({
      ...snapshotOptions,
      customSnapshotIdentifier: context.id,
    })
  },
}

export default config
