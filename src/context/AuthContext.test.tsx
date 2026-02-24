import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('@/services/organizationService', () => ({
  organizationService: { getAll: vi.fn().mockResolvedValue([]) },
}))

vi.mock('@/services/taskService', () => ({
  taskService: {},
  resetTasksCache: vi.fn(),
}))

function Consumer() {
  const { apiKey } = useAuth()
  return <div data-testid="key">{apiKey ?? 'logged-out'}</div>
}

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('AuthContext', () => {
  it('reads apiKey from localStorage on mount', () => {
    localStorage.setItem('apiKey', 'stored-key')
    render(<AuthProvider><Consumer /></AuthProvider>)
    expect(screen.getByTestId('key')).toHaveTextContent('stored-key')
  })

  it('shows logged-out when localStorage has no key', () => {
    render(<AuthProvider><Consumer /></AuthProvider>)
    expect(screen.getByTestId('key')).toHaveTextContent('logged-out')
  })

  it('logs out and clears localStorage when auth:unauthorized event fires', async () => {
    localStorage.setItem('apiKey', 'stored-key')
    render(<AuthProvider><Consumer /></AuthProvider>)
    expect(screen.getByTestId('key')).toHaveTextContent('stored-key')

    await act(async () => {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    })

    expect(screen.getByTestId('key')).toHaveTextContent('logged-out')
    expect(localStorage.getItem('apiKey')).toBeNull()
  })
})
