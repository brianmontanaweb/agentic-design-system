declare const colors: {
    readonly bgBase: "#0a0a0f";
    readonly bgSurface: "#13131a";
    readonly bgElevated: "#1c1c26";
    readonly borderSubtle: "#2a2a38";
    readonly textPrimary: "#f0f0f5";
    readonly textMuted: "#8888aa";
    readonly accentBlue: "#4d9fff";
    readonly accentGreen: "#3dd68c";
    readonly accentAmber: "#f59e0b";
    readonly accentRed: "#f87171";
};
declare const space: {
    readonly 1: "4px";
    readonly 2: "8px";
    readonly 3: "12px";
    readonly 4: "16px";
    readonly 5: "20px";
    readonly 6: "24px";
    readonly 8: "32px";
    readonly 10: "40px";
    readonly 12: "48px";
    readonly 16: "64px";
};
declare const fonts: {
    readonly mono: "\"JetBrains Mono\", \"Fira Code\", Menlo, monospace";
    readonly sans: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
};
declare const fontSizes: {
    readonly xs: "0.75rem";
    readonly sm: "0.875rem";
    readonly md: "1rem";
    readonly lg: "1.125rem";
    readonly xl: "1.25rem";
    readonly '2xl': "1.5rem";
};
declare const fontWeights: {
    readonly normal: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
};
declare const duration: {
    readonly fast: "100ms";
    readonly normal: "200ms";
    readonly slow: "400ms";
};
declare const radius: {
    readonly sm: "4px";
    readonly md: "8px";
    readonly lg: "12px";
};
declare function getCSSVariables(): string;
declare const tokens: {
    colors: {
        readonly bgBase: "#0a0a0f";
        readonly bgSurface: "#13131a";
        readonly bgElevated: "#1c1c26";
        readonly borderSubtle: "#2a2a38";
        readonly textPrimary: "#f0f0f5";
        readonly textMuted: "#8888aa";
        readonly accentBlue: "#4d9fff";
        readonly accentGreen: "#3dd68c";
        readonly accentAmber: "#f59e0b";
        readonly accentRed: "#f87171";
    };
    space: {
        readonly 1: "4px";
        readonly 2: "8px";
        readonly 3: "12px";
        readonly 4: "16px";
        readonly 5: "20px";
        readonly 6: "24px";
        readonly 8: "32px";
        readonly 10: "40px";
        readonly 12: "48px";
        readonly 16: "64px";
    };
    fonts: {
        readonly mono: "\"JetBrains Mono\", \"Fira Code\", Menlo, monospace";
        readonly sans: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
    };
    fontSizes: {
        readonly xs: "0.75rem";
        readonly sm: "0.875rem";
        readonly md: "1rem";
        readonly lg: "1.125rem";
        readonly xl: "1.25rem";
        readonly '2xl': "1.5rem";
    };
    fontWeights: {
        readonly normal: "400";
        readonly medium: "500";
        readonly semibold: "600";
        readonly bold: "700";
    };
    duration: {
        readonly fast: "100ms";
        readonly normal: "200ms";
        readonly slow: "400ms";
    };
    radius: {
        readonly sm: "4px";
        readonly md: "8px";
        readonly lg: "12px";
    };
};

export { colors, tokens as default, duration, fontSizes, fontWeights, fonts, getCSSVariables, radius, space, tokens };
