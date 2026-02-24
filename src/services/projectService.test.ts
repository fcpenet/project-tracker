import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectService } from './projectService'
import * as authFetch from './authFetch'

vi.mock('./authFetch', () => ({ notifyUnauthorized: vi.fn() }))

const backendProject = {
  id: 1,
  title: 'Test Project',
  description: null,
  status: 'active',
  owner_id: null,
  organization_id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

beforeEach(() => vi.clearAllMocks())

describe('projectService.getAll', () => {
  it('fetches and returns all projects', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [backendProject],
    })
    const result = await projectService.getAll()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test Project')
  })

  it('throws on failed fetch', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 })
    await expect(projectService.getAll()).rejects.toThrow('Failed to load projects')
  })

  it('calls notifyUnauthorized and throws on 401', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 })
    await expect(projectService.getAll()).rejects.toThrow('Unauthorized')
    expect(authFetch.notifyUnauthorized).toHaveBeenCalled()
  })
})

describe('projectService.create', () => {
  it('posts and returns created project', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => backendProject,
    })
    const result = await projectService.create('Test Project')
    expect(result.title).toBe('Test Project')
  })

  it('throws with detail message on failure', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Title already taken' }),
    })
    await expect(projectService.create('Test Project')).rejects.toThrow('Title already taken')
  })

  it('calls notifyUnauthorized and throws on 401', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 })
    await expect(projectService.create('Test Project')).rejects.toThrow('Unauthorized')
    expect(authFetch.notifyUnauthorized).toHaveBeenCalled()
  })
})
