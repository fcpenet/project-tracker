import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService, resetTasksCache } from './taskService'

// Backend shape (snake_case, integer id, label encodes priority+tags)
const backendTask = {
  id: 1,
  epic_id: 1,
  title: 'Test Task',
  description: null,
  deadline: null,
  status: 'backlog',
  label: JSON.stringify({ priority: 'medium', tags: [] }),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Each test gets a fresh cache so epics are always re-fetched
beforeEach(() => {
  vi.resetAllMocks()
  resetTasksCache()
})

// Helper: mock fetch to return epics first, then the task operation result
function mockFetch(...responses: object[]) {
  const epicsResponse = { ok: true, json: async () => [{ id: 1 }] }
  global.fetch = vi.fn()
  const mockFn = global.fetch as ReturnType<typeof vi.fn>
  mockFn.mockResolvedValueOnce(epicsResponse as any)
  for (const r of responses) {
    mockFn.mockResolvedValueOnce(r as any)
  }
  return mockFn
}

describe('taskService.getAll', () => {
  it('should fetch and return all tasks mapped to frontend shape', async () => {
    mockFetch({ ok: true, json: async () => [backendTask] })

    const tasks = await taskService.getAll(1)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Test Task')
    expect(tasks[0].id).toBe('1')           // integer → string
    expect(tasks[0].priority).toBe('medium') // decoded from label
  })

  it('should throw on failed fetch', async () => {
    mockFetch({ ok: false })
    await expect(taskService.getAll(1)).rejects.toThrow('Failed to fetch tasks')
  })
})

describe('taskService.create', () => {
  it('should POST and return created task', async () => {
    mockFetch({ ok: true, json: async () => backendTask })

    const result = await taskService.create(1, {
      title: 'Test Task',
      status: 'backlog',
      priority: 'medium',
      tags: [],
    })
    expect(result.id).toBe('1')
    expect(result.priority).toBe('medium')
  })
})

describe('taskService.update', () => {
  it('should PATCH and return updated task', async () => {
    mockFetch({ ok: true, json: async () => ({ ...backendTask, title: 'Updated' }) })

    const result = await taskService.update(1, '1', { title: 'Updated' })
    expect(result.title).toBe('Updated')
  })

  it('should encode priority+tags into label when both provided', async () => {
    mockFetch({
      ok: true,
      json: async () => ({
        ...backendTask,
        label: JSON.stringify({ priority: 'high', tags: ['frontend'] }),
      }),
    })

    const result = await taskService.update(1, '1', { priority: 'high', tags: ['frontend'] })
    expect(result.priority).toBe('high')
    expect(result.tags).toEqual(['frontend'])
  })

  it('should omit label when only status is updated (move operation)', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ ...backendTask, status: 'done' }) })

    await taskService.update(1, '1', { status: 'done' })
    // calls[0] = epics, calls[1] = the PATCH
    const body = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(body).not.toHaveProperty('label')
    expect(body.status).toBe('done')
  })
})

describe('taskService.remove', () => {
  it('should DELETE the task', async () => {
    mockFetch({ ok: true })
    await expect(taskService.remove(1, '1')).resolves.toBeUndefined()
  })
})
