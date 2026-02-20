import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { resetTasksCache } from '@/services/taskService'
import { organizationService } from '@/services/organizationService'
import { setStoredOrgId, clearStoredOrgId } from '@/services/projectService'

const STORAGE_KEY = 'apiKey'

interface AuthContextValue {
  apiKey: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Invalid email or password')
    }
    const { api_key }: { api_key: string } = await res.json()
    localStorage.setItem(STORAGE_KEY, api_key)
    setApiKey(api_key)

    // Fetch the user's organization and store its id for project creation
    try {
      const orgs = await organizationService.getAll()
      if (orgs.length > 0) setStoredOrgId(orgs[0].id)
    } catch {
      // org fetch is best-effort; project creation will fail gracefully if missing
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    clearStoredOrgId()
    resetTasksCache()
    setApiKey(null)
  }, [])

  return (
    <AuthContext.Provider value={{ apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
