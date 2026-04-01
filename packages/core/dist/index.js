// src/AgenticProvider.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";

// src/theme.ts
import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";
import { fonts } from "@agentic-ds/tokens";
var buttonRecipe = defineRecipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "body",
    fontWeight: "medium",
    borderRadius: "md",
    cursor: "pointer",
    transition: "all 100ms",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "accent.blue",
      outlineOffset: "2px"
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
      pointerEvents: "none"
    }
  },
  variants: {
    variant: {
      solid: {
        bg: "accent.blue",
        color: "white",
        _hover: { opacity: 0.85 },
        _active: { transform: "scale(0.97)", opacity: 0.75 }
      },
      outline: {
        bg: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "border.subtle",
        color: "text.primary",
        _hover: { bg: "bg.elevated" },
        _active: { bg: "bg.elevated", transform: "scale(0.97)" }
      },
      ghost: {
        bg: "transparent",
        color: "text.muted",
        _hover: { bg: "bg.elevated", color: "text.primary" },
        _active: { bg: "bg.elevated", transform: "scale(0.97)" }
      },
      danger: {
        bg: "accent.red",
        color: "white",
        _hover: { opacity: 0.85 },
        _active: { transform: "scale(0.97)", opacity: 0.75 }
      }
    },
    size: {
      sm: { h: "28px", px: 3, fontSize: "xs" },
      md: { h: "36px", px: 4, fontSize: "sm" },
      lg: { h: "44px", px: 5, fontSize: "md" }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
});
var config = defineConfig({
  // Scope all CSS custom properties to the provider root element rather than
  // :root. This prevents the design system from leaking token values into the
  // host application's global scope when the library is imported.
  cssVarsRoot: "[data-agentic-ds]",
  theme: {
    recipes: {
      button: buttonRecipe
    },
    tokens: {
      fonts: {
        mono: { value: fonts.mono },
        sans: { value: fonts.sans },
        heading: { value: fonts.sans },
        body: { value: fonts.sans }
      }
    },
    semanticTokens: {
      colors: {
        "bg.base": { value: { _dark: "#0a0a0f", _light: "#f8f9fa" } },
        "bg.surface": { value: { _dark: "#13131a", _light: "#ffffff" } },
        "bg.elevated": { value: { _dark: "#1c1c26", _light: "#f0f0f5" } },
        "border.subtle": { value: { _dark: "#2a2a38", _light: "#e2e2e8" } },
        "text.primary": { value: { _dark: "#f0f0f5", _light: "#0a0a0f" } },
        "text.muted": { value: { _dark: "#8888aa", _light: "#6666aa" } },
        "accent.blue": { value: { _dark: "#4d9fff", _light: "#2563eb" } },
        "accent.green": { value: { _dark: "#3dd68c", _light: "#16a34a" } },
        "accent.amber": { value: { _dark: "#f59e0b", _light: "#d97706" } },
        "accent.red": { value: { _dark: "#f87171", _light: "#dc2626" } }
      }
    }
  }
  // No globalCss — libraries must not set styles on body or any global selector.
});
var system = createSystem(defaultConfig, config);

// src/AgenticProvider.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var keyframes = `
[data-agentic-ds] {
  @keyframes ds-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.85); }
    50%       { opacity: 1;   transform: scale(1); }
  }
  @keyframes ds-blink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }
}
`;
function AgenticProvider({ children }) {
  return (
    // data-agentic-ds is the cssVarsRoot selector in theme.ts — all Chakra
    // CSS custom properties are scoped to this element, not :root.
    // ThemeProvider sets data-theme / class on this element for color mode.
    /* @__PURE__ */ jsxs("div", { "data-agentic-ds": "", children: [
      /* @__PURE__ */ jsx("style", { children: keyframes }),
      /* @__PURE__ */ jsx(ChakraProvider, { value: system, children: /* @__PURE__ */ jsx(
        ThemeProvider,
        {
          attribute: "class",
          defaultTheme: "dark",
          disableTransitionOnChange: true,
          children
        }
      ) })
    ] })
  );
}

// src/Button.tsx
import { Box, chakra } from "@chakra-ui/react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ButtonEl = chakra("button");
var baseStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  fontFamily: "body",
  fontWeight: "medium",
  borderRadius: "md",
  border: "none",
  cursor: "pointer",
  userSelect: "none",
  whiteSpace: "nowrap",
  transition: "all 100ms",
  _focusVisible: {
    outline: "2px solid",
    outlineColor: "accent.blue",
    outlineOffset: "2px"
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    pointerEvents: "none"
  }
};
var variantStyles = {
  solid: {
    bg: "accent.blue",
    color: "white",
    _hover: { opacity: 0.85 },
    _active: { transform: "scale(0.97)", opacity: 0.75 }
  },
  outline: {
    bg: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    color: "text.primary",
    _hover: { bg: "bg.elevated" },
    _active: { bg: "bg.elevated", transform: "scale(0.97)" }
  },
  ghost: {
    bg: "transparent",
    color: "text.muted",
    _hover: { bg: "bg.elevated", color: "text.primary" },
    _active: { bg: "bg.elevated", transform: "scale(0.97)" }
  },
  danger: {
    bg: "accent.red",
    color: "white",
    _hover: { opacity: 0.85 },
    _active: { transform: "scale(0.97)", opacity: 0.75 }
  }
};
var sizeStyles = {
  sm: { h: "28px", px: 3, fontSize: "xs", gap: 1 },
  md: { h: "36px", px: 4, fontSize: "sm", gap: 2 },
  lg: { h: "44px", px: 5, fontSize: "md", gap: 2 }
};
function LoadingDots() {
  return /* @__PURE__ */ jsx2(Box, { as: "span", display: "inline-flex", alignItems: "center", gap: "3px", "aria-hidden": true, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx2(
    Box,
    {
      as: "span",
      w: "4px",
      h: "4px",
      borderRadius: "full",
      bg: "currentColor",
      opacity: 0.8,
      animation: `ds-pulse 1.2s ease-in-out ${i * 0.2}s infinite`
    },
    i
  )) });
}
function Button({
  variant = "solid",
  size = "md",
  disabled = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = "button",
  onClick,
  children,
  "aria-label": ariaLabel
}) {
  return /* @__PURE__ */ jsxs2(
    ButtonEl,
    {
      type,
      disabled,
      "aria-busy": loading || void 0,
      "aria-label": loading && loadingText ? loadingText : ariaLabel,
      pointerEvents: loading ? "none" : void 0,
      width: fullWidth ? "100%" : void 0,
      onClick: !disabled && !loading ? onClick : void 0,
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      children: [
        loading && /* @__PURE__ */ jsx2(
          Box,
          {
            as: "span",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            children: /* @__PURE__ */ jsx2(LoadingDots, {})
          }
        ),
        loading && loadingText && /* @__PURE__ */ jsx2(
          Box,
          {
            as: "span",
            position: "absolute",
            w: "1px",
            h: "1px",
            overflow: "hidden",
            style: { clip: "rect(0,0,0,0)", whiteSpace: "nowrap" },
            children: loadingText
          }
        ),
        /* @__PURE__ */ jsxs2(
          Box,
          {
            as: "span",
            display: "inline-flex",
            alignItems: "center",
            gap: "inherit",
            visibility: loading ? "hidden" : "visible",
            children: [
              leftIcon && /* @__PURE__ */ jsx2(Box, { as: "span", display: "inline-flex", flexShrink: 0, "aria-hidden": true, children: leftIcon }),
              children,
              rightIcon && /* @__PURE__ */ jsx2(Box, { as: "span", display: "inline-flex", flexShrink: 0, "aria-hidden": true, children: rightIcon })
            ]
          }
        )
      ]
    }
  );
}

// src/CodeBlock.tsx
import { Box as Box2, Code } from "@chakra-ui/react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function CodeBlock({ children, language }) {
  return /* @__PURE__ */ jsxs3(
    Box2,
    {
      bg: "bg.elevated",
      border: "1px solid",
      borderColor: "border.subtle",
      borderRadius: "md",
      p: 4,
      overflow: "auto",
      children: [
        language && /* @__PURE__ */ jsx3(
          Box2,
          {
            as: "span",
            fontSize: "xs",
            color: "text.muted",
            fontFamily: "mono",
            display: "block",
            mb: 2,
            children: language
          }
        ),
        /* @__PURE__ */ jsx3(
          Code,
          {
            display: "block",
            fontFamily: "mono",
            fontSize: "sm",
            color: "text.primary",
            whiteSpace: "pre",
            bg: "transparent",
            children
          }
        )
      ]
    }
  );
}

// src/index.ts
import {
  Badge,
  Box as Box3,
  Card,
  Code as Code2,
  Flex,
  Grid,
  HStack,
  Heading,
  Separator,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
export {
  AgenticProvider,
  Badge,
  Box3 as Box,
  Button,
  Card,
  Code2 as Code,
  CodeBlock,
  Flex,
  Grid,
  HStack,
  Heading,
  Separator,
  Stack,
  Text,
  VStack,
  system
};
//# sourceMappingURL=index.js.map