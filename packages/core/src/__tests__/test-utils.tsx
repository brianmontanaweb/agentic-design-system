import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { AgenticProvider } from '../AgenticProvider'

function AllProviders({ children }: { children: React.ReactNode }) {
  return <AgenticProvider>{children}</AgenticProvider>
}

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export * from '@testing-library/react'
