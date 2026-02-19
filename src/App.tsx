import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { TaskProvider } from '@/context/TaskContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PMPage from '@/pages/PMPage'
import LoginPage from '@/pages/LoginPage'
import ProjectsPage from '@/pages/ProjectsPage'

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
      <AuthProvider>
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
