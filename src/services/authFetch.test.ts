import { describe, it, expect, vi, afterEach } from 'vitest'
import { notifyUnauthorized } from './authFetch'

describe('notifyUnauthorized', () => {
  afterEach(() => vi.restoreAllMocks())

  it('dispatches an auth:unauthorized custom event on window', () => {
    const listener = vi.fn()
    window.addEventListener('auth:unauthorized', listener)
    notifyUnauthorized()
    window.removeEventListener('auth:unauthorized', listener)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
