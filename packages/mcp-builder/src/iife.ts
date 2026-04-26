// IIFE bundle entry — re-exports the full Agentic Design System for MCP App iframe embedding.
// Consumed as window.AgenticDS when loaded via <script> tag; includes React and ReactDOM
// so the host iframe needs no additional dependencies.
export * from '@agentic-ds/core'
export * from '@agentic-ds/agents'
export { default as React } from 'react'
export { createRoot, hydrateRoot } from 'react-dom/client'
