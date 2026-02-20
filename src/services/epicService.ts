const BASE_URL = import.meta.env.VITE_API_URL

function apiKey(): string {
  return localStorage.getItem('apiKey') ?? ''
}

export interface Epic {
  id: number
  project_id: number
  title: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

export const epicService = {
  async getAll(projectId: number): Promise<Epic[]> {
    const res = await fetch(`${BASE_URL}/api/projects/${projectId}/epics`, {
      headers: { 'X-API-Key': apiKey() },
    })
    if (!res.ok) throw new Error('Failed to load epics')
    return res.json()
  },

  async create(projectId: number, title: string, description?: string): Promise<Epic> {
    const res = await fetch(`${BASE_URL}/api/projects/${projectId}/epics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey() },
      body: JSON.stringify({ title, description: description ?? null }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Failed to create epic')
    }
    return res.json()
  },
}
