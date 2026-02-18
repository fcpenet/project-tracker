import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'

const BASE_URL = import.meta.env.VITE_API_URL

// TODO: Replace endpoint paths with your actual backend routes
export const taskService = {
  async getAll(): Promise<Task[]> {
    // TODO: replace '/tasks' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks`)
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  },

  async create(data: CreateTaskInput): Promise<Task> {
    // TODO: replace '/tasks' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create task')
    return res.json()
  },

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    // TODO: replace '/tasks/:id' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
  },

  async remove(id: string): Promise<void> {
    // TODO: replace '/tasks/:id' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete task')
  },
}
