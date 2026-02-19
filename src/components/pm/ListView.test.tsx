import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListView from './ListView'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('ListView', () => {
  it('renders all tasks', () => {
    render(<ListView tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    mockTasks.forEach(t => expect(screen.getByText(t.title)).toBeInTheDocument())
  })

  it('renders table headers', () => {
    render(<ListView tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText(/task/i)).toBeInTheDocument()
    expect(screen.getByText(/priority/i)).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(<ListView tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
  })
})
