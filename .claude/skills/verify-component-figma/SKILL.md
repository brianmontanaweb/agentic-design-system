---
name: verify-component-figma
description: Pixel-compares a component's live Storybook rendering against its Figma design node and reports a numeric diff percentage plus a saved diff image — actual visual fidelity, not a props/token read. Use whenever the user asks whether a component "matches Figma," "looks right compared to the design," wants a "Figma diff" or "visual diff," or wants to verify implementation fidelity against a Figma link. Good as a follow-up to /update-component or /add-component once a component exists, or standalone any time a Figma node link is available.
---

# Verify Component Against Figma

Render a component's Figma design node to an image, screenshot the matching Storybook story, pixel-diff the two, and report the result. This is a _visual_ check — it complements (does not replace) the _data_ check in `docs/best-practices.md` section 8 (colors/spacing/typography extracted as values). A component can pass the data check and still fail this one if e.g. line-height or padding renders differently than the extracted values suggest.

Parse `$ARGUMENTS` as `<ComponentName> <core|agents> <FigmaNodeURL> [storyExportName]`.

---

## Gotchas

- **A Figma render needs credentials one way or another.** Either a connected Figma MCP server that exposes an image/render tool, or a personal access token in `FIGMA_TOKEN` for the REST fallback in Step 2. If neither is available, stop and tell the user which one to set up — do not guess or skip this step silently.
- **The Figma node link is required, not optional, for this skill** — unlike `/update-component`'s Figma step, there's nothing meaningful to compare without it. If the user hasn't provided one, ask for it before proceeding.
- **`storyExportName` disambiguates which variant to compare.** A Figma component node usually corresponds to one specific variant (e.g. "Solid / Medium"), not the whole component. If the user didn't say which story export matches the Figma node, ask — don't default to the first export in the file, since that's frequently the wrong visual state to compare.
- **Storybook must be running** against `http://localhost:6006` for the Playwright screenshot step. Check before assuming; start it if it's not up.
- **Dimension mismatches make the pixel diff meaningless.** `scripts/figma-diff.ts` compares only the overlapping region and flags a mismatch explicitly — always surface that flag in the report rather than only reporting the diff percentage.
- **This is exploratory tooling, not CI.** Output images are gitignored scratch artifacts (`.figma-diff/`), not committed baselines like `apps/storybook/__snapshots__`. Don't try to wire this into `test:visual`.

---

## Step 1 — Resolve inputs

Extract `fileKey` and `nodeId` from the Figma URL:

```
https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>
```

Note `nodeId` in the URL uses `-` (e.g. `12-34`); the Figma API wants `:` (e.g. `12:34`) — convert it.

Confirm the component's story file exists:

```sh
ls apps/storybook/src/stories/<ComponentName>.stories.tsx
```

If it doesn't exist, stop and point to `/add-component-story <ComponentName>` — there's nothing to screenshot yet.

If `storyExportName` wasn't given, list the exported story names in that file and ask the user which one visually corresponds to the Figma node before continuing.

Compute the Storybook story id: kebab-case the `title` field and the export name, joined by `--`. E.g. `title: 'Core/Button'` + export `Solid` → `core-button--solid`.

## Step 2 — Render the Figma node to a PNG

**If a Figma MCP server with an image/render tool is connected**, use it to render `nodeId` from `fileKey` and save the result as a PNG.

**Otherwise, fall back to the Figma REST API directly**, using a token from `FIGMA_TOKEN`:

```sh
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/<fileKey>?ids=<nodeId>&format=png&scale=2" \
  | jq -r '.images["<nodeId>"]'
```

That returns a signed, short-lived S3 URL — download it immediately:

```sh
mkdir -p .figma-diff/<ComponentName>
curl -s -o .figma-diff/<ComponentName>/figma.png "<signed-url>"
```

If `FIGMA_TOKEN` is unset and no Figma MCP image tool is available, stop here and tell the user exactly what's missing (env var name, or which MCP server to connect) rather than proceeding with a partial comparison.

## Step 3 — Screenshot the Storybook story

Check Storybook is reachable; start it if not:

```sh
curl -s -o /dev/null -w '%{http_code}' http://localhost:6006
```

If not `200`, start it in the background and wait for it to come up:

```sh
npm run storybook &
npx wait-on http://localhost:6006 --timeout 60000
```

Navigate directly to the story's isolated iframe (no Storybook chrome to crop out) and screenshot it:

```
mcp__playwright__browser_navigate: http://localhost:6006/iframe.html?id=<storyId>&viewMode=story
mcp__playwright__browser_take_screenshot -> save to .figma-diff/<ComponentName>/storybook.png
```

Wait for the page to be visually settled (fonts loaded, no pending animation) before capturing — the same concerns `apps/storybook/.storybook/test-runner.ts` handles for the committed visual-regression baselines apply here too.

## Step 4 — Diff

```sh
npx tsx scripts/figma-diff.ts \
  .figma-diff/<ComponentName>/figma.png \
  .figma-diff/<ComponentName>/storybook.png \
  .figma-diff/<ComponentName>/diff.png \
  --threshold 0.01
```

The script prints a JSON result and exits non-zero when the diff exceeds the threshold or dimensions don't match. Read the JSON rather than re-deriving the percentages yourself.

## Step 5 — Report

```
## Figma Diff: <ComponentName> (<storyExportName>)

**Figma node:** <nodeId> in <fileKey>
**Figma render:** .figma-diff/<ComponentName>/figma.png (<W>x<H>)
**Storybook capture:** .figma-diff/<ComponentName>/storybook.png (<W>x<H>)
**Diff image:** .figma-diff/<ComponentName>/diff.png
**Dimension match:** yes | no — compared <W>x<H> overlap only
**Pixel difference:** <diffPercent>% (threshold <thresholdPercent>%)
**Result:** PASS | FAIL
```

If it fails, look at the diff image before speculating about the cause — a uniform diff usually means a color/token mismatch, a diff concentrated at one edge usually means padding/sizing, and a mismatched dimension means the wrong story variant or viewport was compared.
