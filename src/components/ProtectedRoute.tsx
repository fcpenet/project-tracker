import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { apiKey } = useAuth()
  if (!apiKey) return <Navigate to="/login" replace />
  return <>{children}</>
}
