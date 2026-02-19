import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskModal from './TaskModal'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('TaskModal — Create Mode', () => {
  it('renders empty form', () => {
    render(<TaskModal task={null} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByPlaceholderText(/task title/i)).toHaveValue('')
  })

  it('does not submit with empty title', async () => {
    const onSave = vi.fn()
    render(<TaskModal task={null} allTags={[]} onSave={onSave} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('Create Task'))
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with correct data', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<TaskModal task={null} allTags={['frontend']} onSave={onSave} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/task title/i), 'New Task')
    fireEvent.click(screen.getByText('Create Task'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Task' }))
  })

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn()
    render(<TaskModal task={null} allTags={[]} onSave={vi.fn()} onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('TaskModal — Edit Mode', () => {
  it('pre-fills form with existing task data', () => {
    const task = mockTasks[0]
    render(<TaskModal task={task} allTags={task.tags} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByDisplayValue(task.title)).toBeInTheDocument()
  })

  it('shows Save Changes button in edit mode', () => {
    render(<TaskModal task={mockTasks[0]} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })
})
