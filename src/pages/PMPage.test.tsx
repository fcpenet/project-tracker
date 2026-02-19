import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import PMPage from './PMPage'
import { TaskProvider } from '@/context/TaskContext'
import * as taskServiceModule from '@/services/taskService'
import { mockTasks } from '@/test/mocks/taskService.mock'

beforeEach(() => {
  vi.spyOn(taskServiceModule.taskService, 'getAll').mockResolvedValue(mockTasks)
})

describe('PMPage', () => {
  it('shows loading state initially', () => {
    render(<TaskProvider><PMPage /></TaskProvider>)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders tasks after load', async () => {
    render(<TaskProvider><PMPage /></TaskProvider>)
    await act(async () => {})
    expect(screen.getByText('Build landing page')).toBeInTheDocument()
  })

  it('renders kanban view by default', async () => {
    render(<TaskProvider><PMPage /></TaskProvider>)
    await act(async () => {})
    expect(screen.getByText('backlog')).toBeInTheDocument()
  })
})
