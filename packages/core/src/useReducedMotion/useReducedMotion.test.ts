import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

type ChangeHandler = (e: MediaQueryListEvent) => void

function makeMq(matches: boolean) {
  const listeners: ChangeHandler[] = []
  const mq = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_: string, cb: ChangeHandler) => { listeners.push(cb) }),
    removeEventListener: vi.fn((_: string, cb: ChangeHandler) => {
      const idx = listeners.indexOf(cb)
      if (idx !== -1) listeners.splice(idx, 1)
    }),
    dispatchEvent: vi.fn(),
  }
  return {
    mq,
    fire: (newMatches: boolean) =>
      listeners.forEach((cb) => cb({ matches: newMatches } as MediaQueryListEvent)),
  }
}

const defaultMockImpl = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

afterEach(() => {
  vi.mocked(window.matchMedia).mockImplementation(defaultMockImpl)
})

describe('useReducedMotion', () => {
  it('returns false when prefers-reduced-motion is not active', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion is active on mount', () => {
    const { mq } = makeMq(true)
    vi.mocked(window.matchMedia).mockImplementation(() => mq)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('adds a change event listener on mount', () => {
    const { mq } = makeMq(false)
    vi.mocked(window.matchMedia).mockImplementation(() => mq)
    renderHook(() => useReducedMotion())
    expect(mq.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes the change event listener on unmount', () => {
    const { mq } = makeMq(false)
    vi.mocked(window.matchMedia).mockImplementation(() => mq)
    const { unmount } = renderHook(() => useReducedMotion())
    unmount()
    expect(mq.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('updates state when the media query fires a change event', () => {
    const { mq, fire } = makeMq(false)
    vi.mocked(window.matchMedia).mockImplementation(() => mq)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
    act(() => fire(true))
    expect(result.current).toBe(true)
  })
})
