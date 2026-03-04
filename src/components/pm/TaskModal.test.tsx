import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskModal from './TaskModal'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('TaskModal — Create Mode', () => {
  it('renders empty form', () => {
    render(<TaskModal task={null} epics={[]} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByPlaceholderText(/task title/i)).toHaveValue('')
  })

  it('does not submit with empty title', async () => {
    const onSave = vi.fn()
    render(<TaskModal task={null} epics={[]} allTags={[]} onSave={onSave} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('Create Task'))
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with correct data', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<TaskModal task={null} epics={[]} allTags={['frontend']} onSave={onSave} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/task title/i), 'New Task')
    fireEvent.click(screen.getByText('Create Task'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Task' }), expect.any(Number))
  })

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn()
    render(<TaskModal task={null} epics={[]} allTags={[]} onSave={vi.fn()} onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('disables the submit button while saving is in progress', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockReturnValue(new Promise<void>(() => {}))
    render(<TaskModal task={null} epics={[{ id: 1, title: 'Sprint 1' }]} allTags={[]} onSave={onSave} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/task title/i), 'Test')
    await user.click(screen.getByText('Create Task'))
    expect(screen.getByText('Create Task')).toBeDisabled()
  })

  it('does not call onSave a second time if button is clicked while saving', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockReturnValue(new Promise<void>(() => {}))
    render(<TaskModal task={null} epics={[{ id: 1, title: 'Sprint 1' }]} allTags={[]} onSave={onSave} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/task title/i), 'Test')
    await user.click(screen.getByText('Create Task'))
    await user.click(screen.getByText('Create Task'))
    expect(onSave).toHaveBeenCalledTimes(1)
  })
})

describe('TaskModal — Inline Epic Creation', () => {
  const epics = [{ id: 1, title: 'Sprint 1' }]

  it('shows "+ New Epic" button when onCreateEpic is provided', () => {
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} onCreateEpic={vi.fn()} />)
    expect(screen.getByText('+ New Epic')).toBeInTheDocument()
  })

  it('does not show "+ New Epic" button when onCreateEpic is not provided', () => {
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.queryByText('+ New Epic')).not.toBeInTheDocument()
  })

  it('shows inline input on "+ New Epic" click', () => {
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} onCreateEpic={vi.fn()} />)
    fireEvent.click(screen.getByText('+ New Epic'))
    expect(screen.getByPlaceholderText(/epic title/i)).toBeInTheDocument()
  })

  it('calls onCreateEpic with the entered title', async () => {
    const user = userEvent.setup()
    const onCreateEpic = vi.fn().mockResolvedValue({ id: 99, title: 'New Sprint' })
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} onCreateEpic={onCreateEpic} />)
    fireEvent.click(screen.getByText('+ New Epic'))
    await user.type(screen.getByPlaceholderText(/epic title/i), 'New Sprint')
    fireEvent.click(screen.getByText('Create'))
    await act(async () => {})
    expect(onCreateEpic).toHaveBeenCalledWith('New Sprint')
  })

  it('adds new epic to select and selects it', async () => {
    const user = userEvent.setup()
    const onCreateEpic = vi.fn().mockResolvedValue({ id: 99, title: 'New Sprint' })
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} onCreateEpic={onCreateEpic} />)
    fireEvent.click(screen.getByText('+ New Epic'))
    await user.type(screen.getByPlaceholderText(/epic title/i), 'New Sprint')
    fireEvent.click(screen.getByText('Create'))
    await act(async () => {})
    expect(screen.getByDisplayValue('New Sprint')).toBeInTheDocument()
  })

  it('hides inline input after epic is created', async () => {
    const user = userEvent.setup()
    const onCreateEpic = vi.fn().mockResolvedValue({ id: 99, title: 'New Sprint' })
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} onCreateEpic={onCreateEpic} />)
    fireEvent.click(screen.getByText('+ New Epic'))
    await user.type(screen.getByPlaceholderText(/epic title/i), 'New Sprint')
    fireEvent.click(screen.getByText('Create'))
    await act(async () => {})
    expect(screen.queryByPlaceholderText(/epic title/i)).not.toBeInTheDocument()
  })

  it('hides inline input on cancel', () => {
    render(<TaskModal task={null} epics={epics} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} onCreateEpic={vi.fn()} />)
    fireEvent.click(screen.getByText('+ New Epic'))
    expect(screen.getByPlaceholderText(/epic title/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Discard'))
    expect(screen.queryByPlaceholderText(/epic title/i)).not.toBeInTheDocument()
  })
})

describe('TaskModal — Edit Mode', () => {
  it('pre-fills form with existing task data', () => {
    const task = mockTasks[0]
    render(<TaskModal task={task} epics={[]} allTags={task.tags} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByDisplayValue(task.title)).toBeInTheDocument()
  })

  it('shows Save Changes button in edit mode', () => {
    render(<TaskModal task={mockTasks[0]} epics={[]} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })
})
