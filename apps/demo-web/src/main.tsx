import React from 'react'
import ReactDOM from 'react-dom/client'
import { AgenticProvider } from '@agentic-ds/core'
import App from './App'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found in document')
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <AgenticProvider>
      <App />
    </AgenticProvider>
  </React.StrictMode>
)
