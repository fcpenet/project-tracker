import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from 'turso-auth'
import { TaskProvider } from '@/context/TaskContext'
import PMPage from '@/pages/PMPage'
import LoginPage from '@/pages/LoginPage'
import ProjectsPage from '@/pages/ProjectsPage'
import { clearStoredOrgId } from '@/services/projectService'

function AuthCleanup() {
  useEffect(() => {
    const handler = () => clearStoredOrgId()
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [])
  return null
}

function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>()
  return (
    <TaskProvider projectId={Number(projectId)}>
      <PMPage />
    </TaskProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider apiUrl={import.meta.env.VITE_API_URL}>
        <AuthCleanup />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/pm" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectBoard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
