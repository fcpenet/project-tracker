import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService } from './taskService'

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

beforeEach(() => {
  vi.resetAllMocks()
})

describe('taskService.getAll', () => {
  it('should fetch and return all tasks mapped to frontend shape', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [backendTask],
    } as any)

    const tasks = await taskService.getAll()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Test Task')
    expect(tasks[0].id).toBe('1')           // integer → string
    expect(tasks[0].priority).toBe('medium') // decoded from label
  })

  it('should throw on failed fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as any)
    await expect(taskService.getAll()).rejects.toThrow('Failed to fetch tasks')
  })
})

describe('taskService.create', () => {
  it('should POST and return created task', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => backendTask,
    } as any)

    const result = await taskService.create({
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
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...backendTask, title: 'Updated' }),
    } as any)

    const result = await taskService.update('1', { title: 'Updated' })
    expect(result.title).toBe('Updated')
  })

  it('should encode priority+tags into label when both provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...backendTask,
        label: JSON.stringify({ priority: 'high', tags: ['frontend'] }),
      }),
    } as any)

    const result = await taskService.update('1', { priority: 'high', tags: ['frontend'] })
    expect(result.priority).toBe('high')
    expect(result.tags).toEqual(['frontend'])
  })

  it('should omit label when only status is updated (move operation)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...backendTask, status: 'done' }),
    } as any)
    global.fetch = fetchMock

    await taskService.update('1', { status: 'done' })
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body).not.toHaveProperty('label')
    expect(body.status).toBe('done')
  })
})

describe('taskService.remove', () => {
  it('should DELETE the task', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true } as any)
    await expect(taskService.remove('1')).resolves.toBeUndefined()
  })
})
