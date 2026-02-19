const BASE_URL = import.meta.env.VITE_API_URL

function apiKey(): string {
  return localStorage.getItem('apiKey') ?? ''
}

export interface Project {
  id: number
  title: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

export const projectService = {
  async getAll(): Promise<Project[]> {
    const res = await fetch(`${BASE_URL}/api/projects/`, {
      headers: { 'X-API-Key': apiKey() },
    })
    if (!res.ok) throw new Error('Failed to load projects')
    return res.json()
  },

  async create(title: string, description?: string): Promise<Project> {
    const res = await fetch(`${BASE_URL}/api/projects/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey() },
      body: JSON.stringify({ title, description: description ?? null }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Failed to create project')
    }
    return res.json()
  },
}
