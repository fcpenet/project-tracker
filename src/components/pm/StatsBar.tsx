import { useState } from 'react'
import type { Task } from '@/types/task'

interface Props {
  tasks: Task[]
  view: 'kanban' | 'list'
  onViewChange: (v: 'kanban' | 'list') => void
  onNewTask: () => void
  onNewProject?: () => void
  onLogout?: () => void
  subtitle?: string
  hasApiKey: boolean
}

export default function StatsBar({ tasks, view, onViewChange, onNewTask, onNewProject, onLogout, subtitle, hasApiKey }: Props) {
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in progress').length
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d36]">
      <div className="flex items-center gap-3">
        <span className="text-[#3baaff] font-semibold text-sm">kikOS PM</span>
        {subtitle && (
          <>
            <span className="text-gray-600 text-sm">/</span>
            <span className="text-gray-300 text-sm truncate max-w-48">{subtitle}</span>
          </>
        )}
        <div className="flex gap-3 text-xs text-gray-500">
          <span>Total <span className="text-gray-300">{tasks.length}</span></span>
          <span>Done <span className="text-[#3bff8c]">{done}</span></span>
          <span className="text-[#f5c542]">Active:{inProgress}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="relative"
          data-testid="new-project-wrapper"
          onMouseEnter={() => !hasApiKey && setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
        >
          <button
            disabled={!hasApiKey}
            onClick={onNewProject}
            className={`text-xs px-3 py-1 rounded border transition-colors ${
              hasApiKey
                ? 'border-[#3baaff] text-[#3baaff] hover:bg-[#3baaff]/10 cursor-pointer'
                : 'border-dashed border-gray-600 text-gray-500 opacity-50 cursor-not-allowed'
            }`}
          >
            {!hasApiKey && <span className="mr-1">🔒</span>}New Project
          </button>

          {!hasApiKey && tooltipOpen && (
            <div className="absolute right-0 top-full pt-1 w-56 z-50">
              <div className="bg-[#1e2330] border border-[#2a2d36] rounded-lg p-3 shadow-xl">
                <p className="text-xs text-gray-300 mb-2">
                  An API key is required to create projects.
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewChange('kanban')}
          className={`text-xs px-2 py-1 rounded ${view === 'kanban' ? 'bg-[#3baaff] text-[#0d0f14]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Kanban
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`text-xs px-2 py-1 rounded ${view === 'list' ? 'bg-[#3baaff] text-[#0d0f14]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          List
        </button>
        <button
          onClick={onNewTask}
          className="text-xs bg-[#3baaff] text-[#0d0f14] px-3 py-1 rounded font-semibold hover:bg-[#5bbfff]"
        >
          + New Task
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  )
}
