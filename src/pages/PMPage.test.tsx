import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PMPage from './PMPage'
import { TaskProvider } from '@/context/TaskContext'
import { AuthProvider } from '@/context/AuthContext'
import * as taskServiceModule from '@/services/taskService'
import { mockTasks } from '@/test/mocks/taskService.mock'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/projects/1']}>
      <AuthProvider>
        <TaskProvider projectId={1}>
          {children}
        </TaskProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.setItem('apiKey', 'test-key')
  vi.spyOn(taskServiceModule.taskService, 'getAll').mockResolvedValue(mockTasks)
})

afterEach(() => {
  localStorage.clear()
})

describe('PMPage', () => {
  it('shows loading state initially', () => {
    render(<PMPage />, { wrapper: Wrapper })
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders tasks after load', async () => {
    render(<PMPage />, { wrapper: Wrapper })
    await act(async () => {})
    expect(screen.getByText('Build landing page')).toBeInTheDocument()
  })

  it('renders kanban view by default', async () => {
    render(<PMPage />, { wrapper: Wrapper })
    await act(async () => {})
    expect(screen.getByText('backlog')).toBeInTheDocument()
  })
})
