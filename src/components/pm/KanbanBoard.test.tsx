import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import KanbanBoard from './KanbanBoard'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('KanbanBoard', () => {
  it('renders all 4 columns', () => {
    render(<KanbanBoard tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText('backlog')).toBeInTheDocument()
    expect(screen.getByText('in progress')).toBeInTheDocument()
    expect(screen.getByText('review')).toBeInTheDocument()
    expect(screen.getByText('done')).toBeInTheDocument()
  })

  it('renders tasks in correct columns', () => {
    render(<KanbanBoard tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText('Build landing page')).toBeInTheDocument()
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })

  it('passes epicNames down so task cards show epic badges', () => {
    render(<KanbanBoard tasks={mockTasks} epicNames={{ '10': 'Sprint 1', '11': 'Sprint 2' }} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getAllByText('Sprint 1').length).toBeGreaterThan(0)
    expect(screen.getByText('Sprint 2')).toBeInTheDocument()
  })
})
