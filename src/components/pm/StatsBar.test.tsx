import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StatsBar from './StatsBar'
import { mockTasks } from '@/test/mocks/taskService.mock'

const baseProps = {
  tasks: mockTasks,
  view: 'kanban' as const,
  onViewChange: vi.fn(),
  onNewTask: vi.fn(),
  hasApiKey: true,
}

describe('StatsBar', () => {
  it('shows correct total count', () => {
    render(<StatsBar {...baseProps} />)
    expect(screen.getByText(mockTasks.length.toString())).toBeInTheDocument()
  })

  it('shows correct done count', () => {
    render(<StatsBar {...baseProps} />)
    const doneCount = mockTasks.filter(t => t.status === 'done').length
    expect(screen.getByText(doneCount.toString())).toBeInTheDocument()
  })

  it('calls onNewTask when New Task clicked', () => {
    const onNewTask = vi.fn()
    render(<StatsBar {...baseProps} onNewTask={onNewTask} />)
    screen.getByText(/new task/i).click()
    expect(onNewTask).toHaveBeenCalled()
  })

  describe('New Project button — no API key', () => {
    it('is disabled when hasApiKey is false', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      expect(screen.getByText(/new project/i).closest('button')).toBeDisabled()
    })

    it('shows the ? icon when disabled', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      expect(screen.getByRole('button', { name: /why is this disabled/i })).toBeInTheDocument()
    })

    it('shows tooltip with login link on ? hover', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      fireEvent.mouseEnter(screen.getByRole('button', { name: /why is this disabled/i }))
      expect(screen.getByText(/api key is required/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument()
    })

    it('hides tooltip when mouse leaves ?', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      const trigger = screen.getByRole('button', { name: /why is this disabled/i })
      fireEvent.mouseEnter(trigger)
      fireEvent.mouseLeave(trigger)
      expect(screen.queryByText(/api key is required/i)).not.toBeInTheDocument()
    })
  })

  describe('New Project button — with API key', () => {
    it('is enabled when hasApiKey is true', () => {
      render(<StatsBar {...baseProps} hasApiKey={true} />)
      expect(screen.getByText(/new project/i).closest('button')).not.toBeDisabled()
    })

    it('does not show the ? icon when enabled', () => {
      render(<StatsBar {...baseProps} hasApiKey={true} />)
      expect(screen.queryByRole('button', { name: /why is this disabled/i })).not.toBeInTheDocument()
    })

    it('calls onNewProject when clicked', () => {
      const onNewProject = vi.fn()
      render(<StatsBar {...baseProps} hasApiKey={true} onNewProject={onNewProject} />)
      fireEvent.click(screen.getByText(/new project/i))
      expect(onNewProject).toHaveBeenCalled()
    })
  })
})
