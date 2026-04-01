"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  colors: () => colors,
  default: () => index_default,
  duration: () => duration,
  fontSizes: () => fontSizes,
  fontWeights: () => fontWeights,
  fonts: () => fonts,
  getCSSVariables: () => getCSSVariables,
  radius: () => radius,
  space: () => space,
  tokens: () => tokens
});
module.exports = __toCommonJS(index_exports);
var colors = {
  bgBase: "#0a0a0f",
  bgSurface: "#13131a",
  bgElevated: "#1c1c26",
  borderSubtle: "#2a2a38",
  textPrimary: "#f0f0f5",
  textMuted: "#8888aa",
  accentBlue: "#4d9fff",
  accentGreen: "#3dd68c",
  accentAmber: "#f59e0b",
  accentRed: "#f87171"
};
var space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px"
};
var fonts = {
  mono: '"JetBrains Mono", "Fira Code", Menlo, monospace',
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
};
var fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem"
};
var fontWeights = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
};
var duration = {
  fast: "100ms",
  normal: "200ms",
  slow: "400ms"
};
var radius = {
  sm: "4px",
  md: "8px",
  lg: "12px"
};
function getCSSVariables() {
  return [
    ":root {",
    `  --ds-bg-base: ${colors.bgBase};`,
    `  --ds-bg-surface: ${colors.bgSurface};`,
    `  --ds-bg-elevated: ${colors.bgElevated};`,
    `  --ds-border-subtle: ${colors.borderSubtle};`,
    `  --ds-text-primary: ${colors.textPrimary};`,
    `  --ds-text-muted: ${colors.textMuted};`,
    `  --ds-accent-blue: ${colors.accentBlue};`,
    `  --ds-accent-green: ${colors.accentGreen};`,
    `  --ds-accent-amber: ${colors.accentAmber};`,
    `  --ds-accent-red: ${colors.accentRed};`,
    `  --ds-font-mono: ${fonts.mono};`,
    `  --ds-font-sans: ${fonts.sans};`,
    `  --ds-duration-fast: ${duration.fast};`,
    `  --ds-duration-normal: ${duration.normal};`,
    `  --ds-duration-slow: ${duration.slow};`,
    `  --ds-radius-sm: ${radius.sm};`,
    `  --ds-radius-md: ${radius.md};`,
    `  --ds-radius-lg: ${radius.lg};`,
    "}"
  ].join("\n");
}
var tokens = { colors, space, fonts, fontSizes, fontWeights, duration, radius };
var index_default = tokens;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  colors,
  duration,
  fontSizes,
  fontWeights,
  fonts,
  getCSSVariables,
  radius,
  space,
  tokens
});
//# sourceMappingURL=index.cjs.map