const BASE_URL = import.meta.env.VITE_API_URL

const ORG_ID_KEY = 'orgId'

function apiKey(): string {
  return localStorage.getItem('apiKey') ?? ''
}

export function getStoredOrgId(): number {
  return Number(localStorage.getItem(ORG_ID_KEY) ?? 0)
}

export function setStoredOrgId(id: number) {
  localStorage.setItem(ORG_ID_KEY, String(id))
}

export function clearStoredOrgId() {
  localStorage.removeItem(ORG_ID_KEY)
}

export interface Project {
  id: number
  title: string
  description: string | null
  status: string
  owner_id: number | null
  organization_id: number | null
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
    const organization_id = getStoredOrgId()
    const res = await fetch(`${BASE_URL}/api/projects/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey() },
      body: JSON.stringify({
        title,
        description: description ?? null,
        organization_id,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Failed to create project')
    }
    return res.json()
  },
}
