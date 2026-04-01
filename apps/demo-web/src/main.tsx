import React from 'react'
import ReactDOM from 'react-dom/client'
import { AgenticProvider } from '@agentic-ds/core'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AgenticProvider>
      <App />
    </AgenticProvider>
  </React.StrictMode>
)
