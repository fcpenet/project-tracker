import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'

const BASE_URL = import.meta.env.VITE_API_URL
const API_KEY  = import.meta.env.VITE_API_KEY

const writeHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
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

// Resolved once on first use, reused for all subsequent calls
let tasksUrlCache: Promise<string> | null = null

async function getTasksUrl(): Promise<string> {
  if (tasksUrlCache) return tasksUrlCache
  tasksUrlCache = (async () => {
    const projectsRes = await fetch(`${BASE_URL}/api/projects/`)
    if (!projectsRes.ok) throw new Error('Failed to load projects')
    const projects: { id: number }[] = await projectsRes.json()
    if (!projects.length) throw new Error('No projects found')
    const projectId = projects[0].id

    const epicsRes = await fetch(`${BASE_URL}/api/projects/${projectId}/epics`)
    if (!epicsRes.ok) throw new Error('Failed to load epics')
    const epics: { id: number }[] = await epicsRes.json()
    if (!epics.length) throw new Error('No epics found')
    const epicId = epics[0].id

    return `${BASE_URL}/api/projects/${projectId}/epics/${epicId}/tasks`
  })()
  return tasksUrlCache
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const url = await getTasksUrl()
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch tasks')
    const data: BackendTask[] = await res.json()
    return data.map(toTask)
  },

  async create(data: CreateTaskInput): Promise<Task> {
    const url = await getTasksUrl()
    const res = await fetch(url, {
      method: 'POST',
      headers: writeHeaders,
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

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    const url = await getTasksUrl()
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
    const res = await fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers: writeHeaders,
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return toTask(await res.json())
  },

  async remove(id: string): Promise<void> {
    const url = await getTasksUrl()
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': API_KEY },
    })
    if (!res.ok) throw new Error('Failed to delete task')
  },
}
