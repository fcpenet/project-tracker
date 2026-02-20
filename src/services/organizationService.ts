const BASE_URL = import.meta.env.VITE_API_URL

function apiKey(): string {
  return localStorage.getItem('apiKey') ?? ''
}

export interface Organization {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export const organizationService = {
  async getAll(): Promise<Organization[]> {
    const res = await fetch(`${BASE_URL}/api/organizations/`, {
      headers: { 'X-API-Key': apiKey() },
    })
    if (!res.ok) throw new Error('Failed to load organizations')
    return res.json()
  },

  async create(name: string): Promise<Organization> {
    const res = await fetch(`${BASE_URL}/api/organizations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey() },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Failed to create organization')
    }
    return res.json()
  },
}
