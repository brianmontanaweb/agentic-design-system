// src/AgentStatus.tsx
import { Badge, Box, HStack } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
var statusConfig = {
  idle: { color: "#8888aa", label: "Idle" },
  running: { color: "#4d9fff", label: "Running" },
  done: { color: "#3dd68c", label: "Done" },
  error: { color: "#f87171", label: "Error" }
};
function AgentStatus({ status, label }) {
  const config = statusConfig[status];
  return /* @__PURE__ */ jsxs(HStack, { gap: 2, display: "inline-flex", alignItems: "center", children: [
    /* @__PURE__ */ jsx(
      Box,
      {
        w: "8px",
        h: "8px",
        borderRadius: "full",
        bg: config.color,
        flexShrink: 0,
        animation: status === "running" ? "ds-pulse 1.5s ease-in-out infinite" : void 0
      }
    ),
    /* @__PURE__ */ jsx(Badge, { variant: "plain", fontSize: "xs", fontFamily: "mono", color: config.color, px: 0, children: label ?? config.label })
  ] });
}

// src/ThinkingIndicator.tsx
import { Box as Box2, HStack as HStack2, Text } from "@chakra-ui/react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function ThinkingIndicator({ label = "Thinking" }) {
  return /* @__PURE__ */ jsxs2(HStack2, { gap: 2, alignItems: "center", children: [
    /* @__PURE__ */ jsx2(HStack2, { gap: "3px", alignItems: "center", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx2(
      Box2,
      {
        w: "6px",
        h: "6px",
        borderRadius: "full",
        bg: "accent.blue",
        animation: `ds-pulse 1.2s ease-in-out ${i * 0.2}s infinite`
      },
      i
    )) }),
    label && /* @__PURE__ */ jsx2(Text, { fontSize: "sm", color: "text.muted", fontFamily: "mono", children: label })
  ] });
}

// src/ProgressSteps.tsx
import { Box as Box3, HStack as HStack3, Text as Text2, VStack } from "@chakra-ui/react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var stepColors = {
  pending: { dot: "#2a2a38", label: "#8888aa" },
  active: { dot: "#4d9fff", label: "#f0f0f5" },
  complete: { dot: "#3dd68c", label: "#8888aa" }
};
function ProgressSteps({ steps }) {
  return /* @__PURE__ */ jsx3(VStack, { gap: 2, align: "stretch", children: steps.map((step, index) => {
    const colors = stepColors[step.status];
    return /* @__PURE__ */ jsxs3(HStack3, { gap: 3, alignItems: "flex-start", children: [
      /* @__PURE__ */ jsx3(
        Box3,
        {
          w: "24px",
          h: "24px",
          borderRadius: "full",
          bg: step.status === "complete" ? "#3dd68c22" : step.status === "active" ? "#4d9fff22" : "bg.elevated",
          border: "1px solid",
          borderColor: colors.dot,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: "1px",
          children: step.status === "complete" ? /* @__PURE__ */ jsx3(Text2, { fontSize: "xs", color: "#3dd68c", fontWeight: "bold", lineHeight: 1, children: "\u2713" }) : /* @__PURE__ */ jsx3(
            Text2,
            {
              fontSize: "xs",
              color: colors.dot,
              fontFamily: "mono",
              fontWeight: "medium",
              lineHeight: 1,
              children: index + 1
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs3(VStack, { gap: 0, align: "stretch", flex: 1, children: [
        /* @__PURE__ */ jsx3(
          Text2,
          {
            fontSize: "sm",
            color: colors.label,
            fontWeight: step.status === "active" ? "medium" : "normal",
            lineHeight: "24px",
            children: step.label
          }
        ),
        step.description && /* @__PURE__ */ jsx3(Text2, { fontSize: "xs", color: "text.muted", children: step.description })
      ] })
    ] }, step.id);
  }) });
}

// src/ToolCallCard.tsx
import { useState } from "react";
import { Box as Box4, Code, HStack as HStack4, Text as Text3, VStack as VStack2 } from "@chakra-ui/react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var statusColors = {
  pending: "#8888aa",
  running: "#4d9fff",
  done: "#3dd68c",
  error: "#f87171"
};
function ToolCallCard({
  toolName,
  input,
  output,
  status = "done",
  defaultOpen = false
}) {
  const [open, setOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs4(
    Box4,
    {
      bg: "bg.surface",
      border: "1px solid",
      borderColor: "border.subtle",
      borderRadius: "md",
      overflow: "hidden",
      children: [
        /* @__PURE__ */ jsxs4(
          HStack4,
          {
            px: 3,
            py: 2,
            gap: 2,
            cursor: "pointer",
            onClick: () => setOpen((v) => !v),
            _hover: { bg: "bg.elevated" },
            transition: "background 100ms",
            children: [
              /* @__PURE__ */ jsx4(
                Box4,
                {
                  w: "6px",
                  h: "6px",
                  borderRadius: "full",
                  bg: statusColors[status],
                  flexShrink: 0,
                  animation: status === "running" ? "ds-pulse 1.5s ease-in-out infinite" : void 0
                }
              ),
              /* @__PURE__ */ jsx4(Text3, { fontSize: "sm", fontFamily: "mono", color: "text.primary", flex: 1, children: toolName }),
              /* @__PURE__ */ jsx4(Text3, { fontSize: "xs", color: "text.muted", userSelect: "none", children: open ? "\u25BE" : "\u25B8" })
            ]
          }
        ),
        open && /* @__PURE__ */ jsxs4(VStack2, { gap: 0, align: "stretch", borderTop: "1px solid", borderColor: "border.subtle", children: [
          input !== void 0 && /* @__PURE__ */ jsxs4(
            Box4,
            {
              px: 3,
              py: 2,
              borderBottom: output !== void 0 ? "1px solid" : void 0,
              borderColor: "border.subtle",
              children: [
                /* @__PURE__ */ jsx4(
                  Text3,
                  {
                    fontSize: "xs",
                    color: "text.muted",
                    mb: 1,
                    fontFamily: "mono",
                    textTransform: "uppercase",
                    letterSpacing: "wider",
                    children: "Input"
                  }
                ),
                /* @__PURE__ */ jsx4(
                  Code,
                  {
                    display: "block",
                    fontSize: "xs",
                    fontFamily: "mono",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    bg: "transparent",
                    color: "text.primary",
                    children: JSON.stringify(input, null, 2)
                  }
                )
              ]
            }
          ),
          output !== void 0 && /* @__PURE__ */ jsxs4(Box4, { px: 3, py: 2, children: [
            /* @__PURE__ */ jsx4(
              Text3,
              {
                fontSize: "xs",
                color: "text.muted",
                mb: 1,
                fontFamily: "mono",
                textTransform: "uppercase",
                letterSpacing: "wider",
                children: "Output"
              }
            ),
            /* @__PURE__ */ jsx4(
              Code,
              {
                display: "block",
                fontSize: "xs",
                fontFamily: "mono",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                bg: "transparent",
                color: "accent.green",
                children: output
              }
            )
          ] })
        ] })
      ]
    }
  );
}

// src/StreamingText.tsx
import { Box as Box5, Text as Text4 } from "@chakra-ui/react";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function StreamingText({
  text,
  isStreaming = false,
  fontSize = "sm",
  color = "text.primary"
}) {
  return /* @__PURE__ */ jsxs5(Box5, { as: "span", display: "inline", children: [
    /* @__PURE__ */ jsx5(Text4, { as: "span", fontSize, color, whiteSpace: "pre-wrap", children: text }),
    isStreaming && /* @__PURE__ */ jsx5(
      Box5,
      {
        as: "span",
        display: "inline-block",
        w: "2px",
        h: "1em",
        bg: "accent.blue",
        ml: "1px",
        verticalAlign: "text-bottom",
        animation: "ds-blink 1s step-end infinite"
      }
    )
  ] });
}

// src/MessageThread.tsx
import { useEffect, useRef } from "react";
import { Box as Box6, VStack as VStack3 } from "@chakra-ui/react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function MessageThread({
  children,
  maxHeight = "600px",
  autoScroll = true
}) {
  const bottomRef = useRef(null);
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return /* @__PURE__ */ jsxs6(
    Box6,
    {
      overflowY: "auto",
      maxH: maxHeight,
      px: 4,
      py: 3,
      css: {
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "var(--ds-border-subtle, #2a2a38)" }
      },
      children: [
        /* @__PURE__ */ jsx6(VStack3, { gap: 3, align: "stretch", children }),
        /* @__PURE__ */ jsx6("div", { ref: bottomRef })
      ]
    }
  );
}

// src/MessageBubble.tsx
import { Box as Box7, HStack as HStack5, Text as Text5 } from "@chakra-ui/react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var roleConfig = {
  user: { label: "You", labelColor: "#8888aa" },
  assistant: { label: "Assistant", labelColor: "#4d9fff" },
  tool: { label: "Tool", labelColor: "#3dd68c" }
};
function MessageBubble({ role, content, label, timestamp }) {
  const config = roleConfig[role];
  return /* @__PURE__ */ jsxs7(
    Box7,
    {
      bg: "bg.surface",
      border: "1px solid",
      borderColor: "border.subtle",
      borderRadius: "md",
      px: 3,
      py: 2,
      children: [
        /* @__PURE__ */ jsxs7(HStack5, { gap: 2, mb: 1, justifyContent: "space-between", children: [
          /* @__PURE__ */ jsx7(Text5, { fontSize: "xs", fontFamily: "mono", color: config.labelColor, fontWeight: "medium", children: label ?? config.label }),
          timestamp && /* @__PURE__ */ jsx7(Text5, { fontSize: "xs", color: "text.muted", children: timestamp })
        ] }),
        /* @__PURE__ */ jsx7(Box7, { fontSize: "sm", color: "text.primary", children: content })
      ]
    }
  );
}
export {
  AgentStatus,
  MessageBubble,
  MessageThread,
  ProgressSteps,
  StreamingText,
  ThinkingIndicator,
  ToolCallCard
};
//# sourceMappingURL=index.js.map