import { useState } from 'react'
import type { Task } from '@/types/task'

interface Props {
  tasks: Task[]
  view: 'kanban' | 'list'
  onViewChange: (v: 'kanban' | 'list') => void
  onNewTask: () => void
  onNewProject?: () => void
  hasApiKey: boolean
}

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL ?? import.meta.env.VITE_API_URL

export default function StatsBar({ tasks, view, onViewChange, onNewTask, onNewProject, hasApiKey }: Props) {
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in progress').length
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d36]">
      <div className="flex items-center gap-4">
        <span className="text-[#3baaff] font-semibold text-sm">kikOS PM</span>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>Total <span className="text-gray-300">{tasks.length}</span></span>
          <span>Done <span className="text-[#3bff8c]">{done}</span></span>
          <span className="text-[#f5c542]">Active:{inProgress}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            disabled={!hasApiKey}
            onClick={onNewProject}
            className={`text-xs px-3 py-1 rounded border transition-colors ${
              hasApiKey
                ? 'border-[#3baaff] text-[#3baaff] hover:bg-[#3baaff]/10 cursor-pointer'
                : 'border-[#2a2d36] text-gray-600 cursor-not-allowed'
            }`}
          >
            + New Project
          </button>

          {!hasApiKey && (
            <div className="relative">
              <button
                aria-label="Why is this disabled?"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                className="w-4 h-4 rounded-full border border-gray-600 text-gray-600 text-[10px] flex items-center justify-center hover:border-gray-400 hover:text-gray-400 leading-none"
              >
                ?
              </button>

              {tooltipOpen && (
                <div className="absolute right-0 top-6 w-56 bg-[#1e2330] border border-[#2a2d36] rounded-lg p-3 z-50 shadow-xl">
                  <p className="text-xs text-gray-300 mb-2">
                    An API key is required to create projects.
                  </p>
                  <a
                    href={LOGIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs bg-[#3baaff] text-[#0d0f14] px-2 py-1 rounded font-semibold hover:bg-[#5bbfff]"
                  >
                    Log in →
                  </a>
                </div>
              )}
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
      </div>
    </div>
  )
}
