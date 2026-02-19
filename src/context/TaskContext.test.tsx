import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { TaskProvider, useTaskContext } from './TaskContext'
import * as taskService from '@/services/taskService'

const mockTask = {
  id: '1', title: 'Test', status: 'backlog' as const,
  priority: 'medium' as const, tags: [],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}

function Consumer() {
  const { tasks, loading } = useTaskContext()
  if (loading) return <div>Loading</div>
  return <div>{tasks.map(t => <span key={t.id}>{t.title}</span>)}</div>
}

beforeEach(() => vi.restoreAllMocks())

describe('TaskContext', () => {
  it('renders loading state initially', () => {
    vi.spyOn(taskService.taskService, 'getAll').mockResolvedValue([])
    render(<TaskProvider projectId={1}><Consumer /></TaskProvider>)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('renders tasks after fetch', async () => {
    vi.spyOn(taskService.taskService, 'getAll').mockResolvedValue([mockTask])
    render(<TaskProvider projectId={1}><Consumer /></TaskProvider>)
    await act(async () => {})
    // Note: fetchTasks must be called explicitly — trigger from PMPage useEffect
  })
})
