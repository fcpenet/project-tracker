// ⚠️ These tests are EXPECTED TO FAIL until real API endpoints are wired up.
// They serve as a contract — once your backend routes are confirmed, fill in
// the correct paths in taskService.ts and these should pass.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService } from './taskService'

const mockTask = {
  id: '1',
  title: 'Test Task',
  status: 'backlog' as const,
  priority: 'medium' as const,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('taskService.getAll', () => {
  it('should fetch and return all tasks', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockTask],
    } as any)

    const tasks = await taskService.getAll()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Test Task')
    // TODO: Verify this matches actual response shape from your backend
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
      json: async () => mockTask,
    } as any)

    const result = await taskService.create({
      title: 'Test Task',
      status: 'backlog',
      priority: 'medium',
      tags: [],
    })
    expect(result.id).toBe('1')
    // TODO: Verify request body shape matches what your backend expects
  })
})

describe('taskService.update', () => {
  it('should PATCH and return updated task', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockTask, title: 'Updated' }),
    } as any)

    const result = await taskService.update('1', { title: 'Updated' })
    expect(result.title).toBe('Updated')
    // TODO: Verify PATCH vs PUT based on your backend
  })
})

describe('taskService.remove', () => {
  it('should DELETE the task', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true } as any)
    await expect(taskService.remove('1')).resolves.toBeUndefined()
  })
})
