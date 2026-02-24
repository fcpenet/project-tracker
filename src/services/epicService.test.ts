import { describe, it, expect, vi, beforeEach } from 'vitest'
import { epicService } from './epicService'
import * as authFetch from './authFetch'

vi.mock('./authFetch', () => ({ notifyUnauthorized: vi.fn() }))

const backendEpic = {
  id: 1,
  project_id: 1,
  title: 'Test Epic',
  description: null,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

beforeEach(() => vi.clearAllMocks())

describe('epicService.getAll', () => {
  it('fetches and returns all epics', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [backendEpic],
    })
    const result = await epicService.getAll(1)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test Epic')
  })

  it('throws on failed fetch', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 })
    await expect(epicService.getAll(1)).rejects.toThrow('Failed to load epics')
  })

  it('calls notifyUnauthorized and throws on 401', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 })
    await expect(epicService.getAll(1)).rejects.toThrow('Unauthorized')
    expect(authFetch.notifyUnauthorized).toHaveBeenCalled()
  })
})

describe('epicService.create', () => {
  it('posts and returns created epic', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => backendEpic,
    })
    const result = await epicService.create(1, 'Test Epic')
    expect(result.title).toBe('Test Epic')
  })

  it('throws with detail message on failure', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Epic already exists' }),
    })
    await expect(epicService.create(1, 'Test Epic')).rejects.toThrow('Epic already exists')
  })

  it('calls notifyUnauthorized and throws on 401', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 })
    await expect(epicService.create(1, 'Test Epic')).rejects.toThrow('Unauthorized')
    expect(authFetch.notifyUnauthorized).toHaveBeenCalled()
  })
})
