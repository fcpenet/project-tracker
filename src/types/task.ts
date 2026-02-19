export type Priority = 'urgent' | 'high' | 'medium' | 'low'
export type Status = 'backlog' | 'in progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  dueDate?: string       // ISO string e.g. "2026-03-01"
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTaskInput = Partial<CreateTaskInput>
