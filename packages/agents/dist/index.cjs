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
  AgentStatus: () => AgentStatus,
  MessageBubble: () => MessageBubble,
  MessageThread: () => MessageThread,
  ProgressSteps: () => ProgressSteps,
  StreamingText: () => StreamingText,
  ThinkingIndicator: () => ThinkingIndicator,
  ToolCallCard: () => ToolCallCard
});
module.exports = __toCommonJS(index_exports);

// src/AgentStatus.tsx
var import_react = require("@chakra-ui/react");
var import_jsx_runtime = require("react/jsx-runtime");
var statusConfig = {
  idle: { color: "#8888aa", label: "Idle" },
  running: { color: "#4d9fff", label: "Running" },
  done: { color: "#3dd68c", label: "Done" },
  error: { color: "#f87171", label: "Error" }
};
function AgentStatus({ status, label }) {
  const config = statusConfig[status];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.HStack, { gap: 2, display: "inline-flex", alignItems: "center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react.Box,
      {
        w: "8px",
        h: "8px",
        borderRadius: "full",
        bg: config.color,
        flexShrink: 0,
        animation: status === "running" ? "ds-pulse 1.5s ease-in-out infinite" : void 0
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Badge, { variant: "plain", fontSize: "xs", fontFamily: "mono", color: config.color, px: 0, children: label ?? config.label })
  ] });
}

// src/ThinkingIndicator.tsx
var import_react2 = require("@chakra-ui/react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function ThinkingIndicator({ label = "Thinking" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react2.HStack, { gap: 2, alignItems: "center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.HStack, { gap: "3px", alignItems: "center", children: [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react2.Box,
      {
        w: "6px",
        h: "6px",
        borderRadius: "full",
        bg: "accent.blue",
        animation: `ds-pulse 1.2s ease-in-out ${i * 0.2}s infinite`
      },
      i
    )) }),
    label && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Text, { fontSize: "sm", color: "text.muted", fontFamily: "mono", children: label })
  ] });
}

// src/ProgressSteps.tsx
var import_react3 = require("@chakra-ui/react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var stepColors = {
  pending: { dot: "#2a2a38", label: "#8888aa" },
  active: { dot: "#4d9fff", label: "#f0f0f5" },
  complete: { dot: "#3dd68c", label: "#8888aa" }
};
function ProgressSteps({ steps }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.VStack, { gap: 2, align: "stretch", children: steps.map((step, index) => {
    const colors = stepColors[step.status];
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_react3.HStack, { gap: 3, alignItems: "flex-start", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_react3.Box,
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
          children: step.status === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Text, { fontSize: "xs", color: "#3dd68c", fontWeight: "bold", lineHeight: 1, children: "\u2713" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            import_react3.Text,
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
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_react3.VStack, { gap: 0, align: "stretch", flex: 1, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_react3.Text,
          {
            fontSize: "sm",
            color: colors.label,
            fontWeight: step.status === "active" ? "medium" : "normal",
            lineHeight: "24px",
            children: step.label
          }
        ),
        step.description && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react3.Text, { fontSize: "xs", color: "text.muted", children: step.description })
      ] })
    ] }, step.id);
  }) });
}

// src/ToolCallCard.tsx
var import_react4 = require("react");
var import_react5 = require("@chakra-ui/react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  const [open, setOpen] = (0, import_react4.useState)(defaultOpen);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    import_react5.Box,
    {
      bg: "bg.surface",
      border: "1px solid",
      borderColor: "border.subtle",
      borderRadius: "md",
      overflow: "hidden",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          import_react5.HStack,
          {
            px: 3,
            py: 2,
            gap: 2,
            cursor: "pointer",
            onClick: () => setOpen((v) => !v),
            _hover: { bg: "bg.elevated" },
            transition: "background 100ms",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                import_react5.Box,
                {
                  w: "6px",
                  h: "6px",
                  borderRadius: "full",
                  bg: statusColors[status],
                  flexShrink: 0,
                  animation: status === "running" ? "ds-pulse 1.5s ease-in-out infinite" : void 0
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react5.Text, { fontSize: "sm", fontFamily: "mono", color: "text.primary", flex: 1, children: toolName }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react5.Text, { fontSize: "xs", color: "text.muted", userSelect: "none", children: open ? "\u25BE" : "\u25B8" })
            ]
          }
        ),
        open && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_react5.VStack, { gap: 0, align: "stretch", borderTop: "1px solid", borderColor: "border.subtle", children: [
          input !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            import_react5.Box,
            {
              px: 3,
              py: 2,
              borderBottom: output !== void 0 ? "1px solid" : void 0,
              borderColor: "border.subtle",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  import_react5.Text,
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
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  import_react5.Code,
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
          output !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_react5.Box, { px: 3, py: 2, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              import_react5.Text,
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
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              import_react5.Code,
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
var import_react6 = require("@chakra-ui/react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function StreamingText({
  text,
  isStreaming = false,
  fontSize = "sm",
  color = "text.primary"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_react6.Box, { as: "span", display: "inline", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react6.Text, { as: "span", fontSize, color, whiteSpace: "pre-wrap", children: text }),
    isStreaming && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      import_react6.Box,
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
var import_react7 = require("react");
var import_react8 = require("@chakra-ui/react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function MessageThread({
  children,
  maxHeight = "600px",
  autoScroll = true
}) {
  const bottomRef = (0, import_react7.useRef)(null);
  (0, import_react7.useEffect)(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    import_react8.Box,
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
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react8.VStack, { gap: 3, align: "stretch", children }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { ref: bottomRef })
      ]
    }
  );
}

// src/MessageBubble.tsx
var import_react9 = require("@chakra-ui/react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var roleConfig = {
  user: { label: "You", labelColor: "#8888aa" },
  assistant: { label: "Assistant", labelColor: "#4d9fff" },
  tool: { label: "Tool", labelColor: "#3dd68c" }
};
function MessageBubble({ role, content, label, timestamp }) {
  const config = roleConfig[role];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    import_react9.Box,
    {
      bg: "bg.surface",
      border: "1px solid",
      borderColor: "border.subtle",
      borderRadius: "md",
      px: 3,
      py: 2,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_react9.HStack, { gap: 2, mb: 1, justifyContent: "space-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Text, { fontSize: "xs", fontFamily: "mono", color: config.labelColor, fontWeight: "medium", children: label ?? config.label }),
          timestamp && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Text, { fontSize: "xs", color: "text.muted", children: timestamp })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react9.Box, { fontSize: "sm", color: "text.primary", children: content })
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentStatus,
  MessageBubble,
  MessageThread,
  ProgressSteps,
  StreamingText,
  ThinkingIndicator,
  ToolCallCard
});
//# sourceMappingURL=index.cjs.map