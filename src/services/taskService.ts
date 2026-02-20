import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'

const BASE_URL = import.meta.env.VITE_API_URL

function apiKey(): string {
  return localStorage.getItem('apiKey') ?? ''
}

function authHeaders() {
  return { 'X-API-Key': apiKey() }
}

function writeHeaders() {
  return { 'Content-Type': 'application/json', 'X-API-Key': apiKey() }
}

// Shape returned by the backend
interface BackendTask {
  id: number
  epic_id: number
  title: string
  description: string | null
  deadline: string | null
  status: string
  label: string | null
  created_at: string
  updated_at: string
}

// priority + tags are encoded as JSON in the label field
// since the backend has no dedicated priority or tags columns
interface LabelData {
  priority?: Task['priority']
  tags?: string[]
}

function decodeLabel(label: string | null): LabelData {
  if (!label) return {}
  try { return JSON.parse(label) } catch { return { tags: [label] } }
}

function encodeLabel(priority: Task['priority'], tags: string[]): string {
  return JSON.stringify({ priority, tags })
}

function toTask(b: BackendTask): Task {
  const { priority = 'medium', tags = [] } = decodeLabel(b.label)
  return {
    id:          String(b.id),
    epicId:      String(b.epic_id),
    title:       b.title,
    description: b.description ?? undefined,
    status:      (b.status as Task['status']) ?? 'backlog',
    priority,
    dueDate:     b.deadline ?? undefined,
    tags,
    createdAt:   b.created_at,
    updatedAt:   b.updated_at,
  }
}

function tasksUrl(projectId: number, epicId: number): string {
  return `${BASE_URL}/api/projects/${projectId}/epics/${epicId}/tasks`
}

// no-op kept for backwards compat (called from PMPage on epic creation)
export function resetTasksCache(_projectId?: number) {}

export const taskService = {
  async getAll(projectId: number): Promise<Task[]> {
    const epicsRes = await fetch(`${BASE_URL}/api/projects/${projectId}/epics`, { headers: authHeaders() })
    if (!epicsRes.ok) throw new Error('Failed to load epics')
    const epics: { id: number }[] = await epicsRes.json()
    if (!epics.length) throw new Error('This project has no epics yet')

    const taskArrays = await Promise.all(
      epics.map(async (epic) => {
        const res = await fetch(tasksUrl(projectId, epic.id), { headers: authHeaders() })
        if (!res.ok) throw new Error('Failed to fetch tasks')
        const data: BackendTask[] = await res.json()
        return data.map(toTask)
      })
    )
    return taskArrays.flat()
  },

  async create(projectId: number, epicId: number, data: CreateTaskInput): Promise<Task> {
    const res = await fetch(tasksUrl(projectId, epicId), {
      method: 'POST',
      headers: writeHeaders(),
      body: JSON.stringify({
        title:       data.title,
        description: data.description ?? null,
        deadline:    data.dueDate ?? null,
        status:      data.status,
        label:       encodeLabel(data.priority, data.tags),
      }),
    })
    if (!res.ok) throw new Error('Failed to create task')
    return toTask(await res.json())
  },

  async update(projectId: number, epicId: number, id: string, data: UpdateTaskInput): Promise<Task> {
    const body: Record<string, unknown> = {}
    if (data.title       !== undefined) body.title       = data.title
    if (data.description !== undefined) body.description = data.description ?? null
    if (data.dueDate     !== undefined) body.deadline    = data.dueDate ?? null
    if (data.status      !== undefined) body.status      = data.status
    // Only encode label when both priority + tags are present (full modal save).
    // Move-only updates (status only) omit label so the backend preserves it.
    if (data.priority !== undefined && data.tags !== undefined) {
      body.label = encodeLabel(data.priority, data.tags)
    }
    const res = await fetch(`${tasksUrl(projectId, epicId)}/${id}`, {
      method: 'PATCH',
      headers: writeHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return toTask(await res.json())
  },

  async remove(projectId: number, epicId: number, id: string): Promise<void> {
    const res = await fetch(`${tasksUrl(projectId, epicId)}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete task')
  },
}
