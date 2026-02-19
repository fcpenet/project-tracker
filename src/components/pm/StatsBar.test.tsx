import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsBar from './StatsBar'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('StatsBar', () => {
  it('shows correct total count', () => {
    render(<StatsBar tasks={mockTasks} view="kanban" onViewChange={vi.fn()} onNewTask={vi.fn()} />)
    expect(screen.getByText(mockTasks.length.toString())).toBeInTheDocument()
  })

  it('shows correct done count', () => {
    render(<StatsBar tasks={mockTasks} view="kanban" onViewChange={vi.fn()} onNewTask={vi.fn()} />)
    const doneCount = mockTasks.filter(t => t.status === 'done').length
    expect(screen.getByText(doneCount.toString())).toBeInTheDocument()
  })

  it('calls onNewTask when New Task clicked', () => {
    const onNewTask = vi.fn()
    render(<StatsBar tasks={mockTasks} view="kanban" onViewChange={vi.fn()} onNewTask={onNewTask} />)
    screen.getByText(/new task/i).click()
    expect(onNewTask).toHaveBeenCalled()
  })
})
