import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

type AgentStatusValue = 'idle' | 'running' | 'done' | 'error';
interface AgentStatusProps {
    status: AgentStatusValue;
    label?: string;
}
declare function AgentStatus({ status, label }: AgentStatusProps): react_jsx_runtime.JSX.Element;

interface ThinkingIndicatorProps {
    label?: string;
}
declare function ThinkingIndicator({ label }: ThinkingIndicatorProps): react_jsx_runtime.JSX.Element;

type StepStatus = 'pending' | 'active' | 'complete';
interface Step {
    id: string;
    label: string;
    status: StepStatus;
    description?: string;
}
interface ProgressStepsProps {
    steps: Step[];
}
declare function ProgressSteps({ steps }: ProgressStepsProps): react_jsx_runtime.JSX.Element;

type ToolCallStatus = 'pending' | 'running' | 'done' | 'error';
interface ToolCallCardProps {
    toolName: string;
    input?: Record<string, unknown>;
    output?: string;
    status?: ToolCallStatus;
    defaultOpen?: boolean;
}
declare function ToolCallCard({ toolName, input, output, status, defaultOpen, }: ToolCallCardProps): react_jsx_runtime.JSX.Element;

interface StreamingTextProps {
    text: string;
    isStreaming?: boolean;
    fontSize?: string;
    color?: string;
}
declare function StreamingText({ text, isStreaming, fontSize, color, }: StreamingTextProps): react_jsx_runtime.JSX.Element;

interface MessageThreadProps {
    children: React.ReactNode;
    maxHeight?: string;
    autoScroll?: boolean;
}
declare function MessageThread({ children, maxHeight, autoScroll, }: MessageThreadProps): react_jsx_runtime.JSX.Element;

type MessageRole = 'user' | 'assistant' | 'tool';
interface MessageBubbleProps {
    role: MessageRole;
    content: React.ReactNode;
    label?: string;
    timestamp?: string;
}
declare function MessageBubble({ role, content, label, timestamp }: MessageBubbleProps): react_jsx_runtime.JSX.Element;

export { AgentStatus, type AgentStatusProps, type AgentStatusValue, MessageBubble, type MessageBubbleProps, type MessageRole, MessageThread, type MessageThreadProps, ProgressSteps, type ProgressStepsProps, type Step, type StepStatus, StreamingText, type StreamingTextProps, ThinkingIndicator, type ThinkingIndicatorProps, ToolCallCard, type ToolCallCardProps, type ToolCallStatus };
