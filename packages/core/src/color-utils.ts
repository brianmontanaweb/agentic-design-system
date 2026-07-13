// Internal color math for defineAgenticTheme(). Pure functions, no DOM, no
// dependencies. All conversions round-trip through linear sRGB; OKLCH is used
// for perceptual adjustments (neutral warmth tinting) and WCAG relative
// luminance for contrast decisions. Out-of-gamut results are clamped per
// channel, which is sufficient for the subtle chroma shifts applied here.

export interface Rgb {
  r: number // 0..1
  g: number // 0..1
  b: number // 0..1
}

export interface Oklch {
  l: number // 0..1 perceptual lightness
  c: number // chroma, 0 = gray
  h: number // hue in degrees, meaningless when c ≈ 0
}

const HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHexColor(value: string): boolean {
  return HEX_PATTERN.test(value)
}

export function hexToRgb(hex: string): Rgb {
  if (!isHexColor(hex)) {
    throw new Error(`Invalid hex color "${hex}". Expected #rgb or #rrggbb.`)
  }
  let body = hex.slice(1)
  if (body.length === 3) {
    body = body
      .split('')
      .map((ch) => ch + ch)
      .join('')
  }
  return {
    r: parseInt(body.slice(0, 2), 16) / 255,
    g: parseInt(body.slice(2, 4), 16) / 255,
    b: parseInt(body.slice(4, 6), 16) / 255,
  }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const channel = (v: number): string =>
    Math.round(clamp01(v) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function linearToSrgb(v: number): number {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
}

// WCAG 2.x relative luminance of an sRGB color.
export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * srgbToLinear(rgb.r) + 0.7152 * srgbToLinear(rgb.g) + 0.0722 * srgbToLinear(rgb.b)
}

// WCAG 2.x contrast ratio, 1..21.
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// ---- OKLab / OKLCH (Björn Ottosson's reference implementation) ----

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const c = Math.sqrt(a * a + bb * bb)
  let h = (Math.atan2(bb, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

export function oklchToRgb({ l: L, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const bb = c * Math.sin(hr)

  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * bb, 3)
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * bb, 3)
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * bb, 3)

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  return { r: clamp01(linearToSrgb(r)), g: clamp01(linearToSrgb(g)), b: clamp01(linearToSrgb(b)) }
}

// Warm hue sits in the amber range, cool in the blue range. Chroma is capped
// low so tinted neutrals stay neutrals (text contrast is not meaningfully
// affected below c ≈ 0.05).
const WARM_HUE = 75
const COOL_HUE = 265
const MAX_TINT_CHROMA = 0.05
const TINT_CHROMA_PER_UNIT = 0.02

// Shift a neutral toward warm (warmth > 0) or cool (warmth < 0) in OKLCH,
// preserving lightness. warmth = 0 returns the input unchanged.
export function tintNeutral(hex: string, warmth: number): string {
  if (warmth === 0) return hex
  const lch = rgbToOklch(hexToRgb(hex))
  const magnitude = Math.abs(warmth)
  return rgbToHex(
    oklchToRgb({
      l: lch.l,
      c: Math.min(lch.c + TINT_CHROMA_PER_UNIT * magnitude, MAX_TINT_CHROMA),
      h: warmth > 0 ? WARM_HUE : COOL_HUE,
    })
  )
}

// Pick whichever of the two candidates has the higher WCAG contrast against
// the background. Used to derive color.text.on.accent from a brand accent.
export function pickHigherContrast(
  background: string,
  candidateA: string,
  candidateB: string
): string {
  const bg = hexToRgb(background)
  return contrastRatio(hexToRgb(candidateA), bg) >= contrastRatio(hexToRgb(candidateB), bg)
    ? candidateA
    : candidateB
}
