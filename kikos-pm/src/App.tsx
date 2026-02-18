import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TaskProvider } from '@/context/TaskContext'
import PMPage from '@/pages/PMPage'

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/pm" replace />} />
          <Route path="/pm" element={<PMPage />} />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  )
}
