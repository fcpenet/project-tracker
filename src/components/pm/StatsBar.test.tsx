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
    it('is disabled', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      expect(screen.getByText(/new project/i).closest('button')).toBeDisabled()
    })

    it('shows lock icon', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      expect(screen.getByText(/🔒/)).toBeInTheDocument()
    })

    it('shows tooltip content on hover', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      fireEvent.mouseEnter(screen.getByTestId('new-project-wrapper'))
      expect(screen.getByText(/api key is required/i)).toBeInTheDocument()
    })

    it('hides tooltip after mouse leaves', () => {
      render(<StatsBar {...baseProps} hasApiKey={false} />)
      const wrapper = screen.getByTestId('new-project-wrapper')
      fireEvent.mouseEnter(wrapper)
      expect(screen.getByText(/api key is required/i)).toBeInTheDocument()
      fireEvent.mouseLeave(wrapper)
      expect(screen.queryByText(/api key is required/i)).not.toBeInTheDocument()
    })
  })

  describe('New Project button — with API key', () => {
    it('is enabled', () => {
      render(<StatsBar {...baseProps} hasApiKey={true} />)
      expect(screen.getByText(/new project/i).closest('button')).not.toBeDisabled()
    })

    it('does not show lock icon', () => {
      render(<StatsBar {...baseProps} hasApiKey={true} />)
      expect(screen.queryByText(/🔒/)).not.toBeInTheDocument()
    })

    it('does not render tooltip', () => {
      render(<StatsBar {...baseProps} hasApiKey={true} />)
      expect(screen.queryByText(/api key is required/i)).not.toBeInTheDocument()
    })

    it('calls onNewProject when clicked', () => {
      const onNewProject = vi.fn()
      render(<StatsBar {...baseProps} hasApiKey={true} onNewProject={onNewProject} />)
      fireEvent.click(screen.getByText(/new project/i))
      expect(onNewProject).toHaveBeenCalled()
    })
  })
})
