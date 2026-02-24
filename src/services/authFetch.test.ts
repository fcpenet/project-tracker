import { describe, it, expect, vi, afterEach } from 'vitest'
import { notifyUnauthorized, isAuthError } from './authFetch'

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

describe('isAuthError', () => {
  it.each([401, 403])('returns true for %i', (status) => {
    expect(isAuthError(status)).toBe(true)
  })

  it.each([200, 400, 404, 500])('returns false for %i', (status) => {
    expect(isAuthError(status)).toBe(false)
  })
})
