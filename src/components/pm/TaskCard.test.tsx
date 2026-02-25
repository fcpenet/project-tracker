import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from './TaskCard'
import { mockTasks } from '@/test/mocks/taskService.mock'

const task = mockTasks[0]

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText(task.title)).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText(task.priority)).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    task.tags.forEach(tag => expect(screen.getByText(tag)).toBeInTheDocument())
  })

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={onDelete} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    fireEvent.click(screen.getByTitle('Delete'))
    expect(onDelete).toHaveBeenCalledWith(task.id)
  })

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<TaskCard task={task} onEdit={onEdit} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    fireEvent.click(screen.getByTitle('Edit'))
    expect(onEdit).toHaveBeenCalledWith(task)
  })

  it('shows overdue warning for past due dates', () => {
    const overdueTask = { ...task, dueDate: '2020-01-01', status: 'backlog' as const }
    render(<TaskCard task={overdueTask} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText(/⚠/)).toBeInTheDocument()
  })

  it('renders epic name badge when epicNames contains the task epicId', () => {
    const taskWithEpic = { ...task, epicId: '10' }
    render(<TaskCard task={taskWithEpic} epicNames={{ '10': 'Sprint 1' }} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText('Sprint 1')).toBeInTheDocument()
  })

  it('does not render an epic badge when epicNames is not provided', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.queryByTitle('epic')).not.toBeInTheDocument()
  })
})
