// Reusable mock for taskService — import this in component tests
import { vi } from 'vitest'
import type { Task } from '@/types/task'

export const mockTasks: Task[] = [
  {
    id: '1', title: 'Build landing page', description: 'Hero section + CTA',
    status: 'in progress', priority: 'high', tags: ['frontend', 'design'],
    dueDate: '2026-03-01', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', title: 'Setup CI/CD', description: undefined,
    status: 'backlog', priority: 'medium', tags: ['devops'],
    dueDate: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', title: 'Write unit tests',
    status: 'done', priority: 'low', tags: ['backend'],
    dueDate: '2026-01-01', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
]

export const mockTaskService = {
  getAll: vi.fn().mockResolvedValue(mockTasks),
  create: vi.fn().mockResolvedValue(mockTasks[0]),
  update: vi.fn().mockResolvedValue(mockTasks[0]),
  remove: vi.fn().mockResolvedValue(undefined),
}
