import { useState, useRef, useEffect, useCallback } from 'react'
import type { Task } from '@/types/task'

interface ProjectOption {
  id: number
  title: string
}

interface Props {
  tasks: Task[]
  view: 'kanban' | 'list'
  onViewChange: (v: 'kanban' | 'list') => void
  onNewTask: () => void
  onNewEpic?: () => void
  onNewProject?: () => void
  onLogout?: () => void
  subtitle?: string
  hasApiKey: boolean
  projects?: ProjectOption[]
  currentProjectId?: number
  onSwitchProject?: (project: ProjectOption) => void
}

export default function StatsBar({ tasks, view, onViewChange, onNewTask, onNewEpic, onNewProject, onLogout, subtitle, hasApiKey, projects, currentProjectId, onSwitchProject }: Props) {
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in progress').length
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!switcherOpen) return
    function handle(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [switcherOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const Actions = ({ inModal = false }: { inModal?: boolean }) => (
    <>
      <div
        className="relative"
        data-testid="new-project-wrapper"
        onMouseEnter={() => !hasApiKey && !inModal && setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        <button
          disabled={!hasApiKey}
          onClick={() => { onNewProject?.(); closeMenu() }}
          className={`text-xs px-3 py-1 rounded border transition-colors ${
            hasApiKey
              ? 'border-[#3baaff] text-[#3baaff] hover:bg-[#3baaff]/10 cursor-pointer'
              : 'border-dashed border-gray-600 text-gray-500 opacity-50 cursor-not-allowed'
          } ${inModal ? 'w-full text-left' : ''}`}
        >
          {!hasApiKey && <span className="mr-1">🔒</span>}New Project
        </button>
        {!hasApiKey && tooltipOpen && !inModal && (
          <div className="absolute right-0 top-full pt-1 w-56 z-50">
            <div className="bg-[#1e2330] border border-[#2a2d36] rounded-lg p-3 shadow-xl">
              <p className="text-xs text-gray-300">An API key is required to create projects.</p>
            </div>
          </div>
        )}
      </div>

      <div className={`flex gap-1 ${inModal ? 'w-full' : ''}`}>
        <button
          onClick={() => { onViewChange('kanban'); closeMenu() }}
          className={`flex-1 text-xs px-2 py-1 rounded ${view === 'kanban' ? 'bg-[#3baaff] text-[#0d0f14]' : 'text-gray-500 hover:text-gray-300 border border-[#2a2d36]'}`}
        >
          Kanban
        </button>
        <button
          onClick={() => { onViewChange('list'); closeMenu() }}
          className={`flex-1 text-xs px-2 py-1 rounded ${view === 'list' ? 'bg-[#3baaff] text-[#0d0f14]' : 'text-gray-500 hover:text-gray-300 border border-[#2a2d36]'}`}
        >
          List
        </button>
      </div>

      {onNewEpic && (
        <button
          onClick={() => { onNewEpic(); closeMenu() }}
          className={`text-xs px-3 py-1 rounded border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200 transition-colors ${inModal ? 'w-full text-left' : ''}`}
        >
          + New Epic
        </button>
      )}

      <button
        onClick={() => { onNewTask(); closeMenu() }}
        className={`text-xs bg-[#3baaff] text-[#0d0f14] px-3 py-1 rounded font-semibold hover:bg-[#5bbfff] ${inModal ? 'w-full' : ''}`}
      >
        + New Task
      </button>

      {onLogout && (
        <button
          onClick={() => { onLogout(); closeMenu() }}
          className={`text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 transition-colors ${inModal ? 'w-full text-left' : ''}`}
        >
          Sign out
        </button>
      )}
    </>
  )

  return (
    <div className="border-b border-[#2a2d36]">
      {/* Top bar: breadcrumb + actions */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button onClick={onNewProject} className="hover:text-[#3baaff] transition-colors">
            kikOS PM
          </button>
          {subtitle && (
            <>
              <span>/</span>
              {projects && projects.length > 0 && onSwitchProject ? (
                <div ref={switcherRef} className="relative">
                  <button
                    data-testid="project-switcher"
                    onClick={() => setSwitcherOpen(o => !o)}
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-200 transition-colors truncate max-w-40 md:max-w-64"
                  >
                    <span>{subtitle}</span>
                    <span className="text-red-400 text-[10px] leading-none">▼</span>
                  </button>
                  {switcherOpen && (
                    <div className="absolute left-0 top-full mt-1 w-56 bg-[#1e2330] border border-[#2a2d36] rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                      {projects.map(p => (
                        <button
                          key={p.id}
                          data-testid={`project-option-${p.id}`}
                          aria-current={p.id === currentProjectId ? 'true' : undefined}
                          onClick={() => { setSwitcherOpen(false); onSwitchProject(p) }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            p.id === currentProjectId
                              ? 'text-[#3baaff] bg-[#3baaff]/10'
                              : 'text-gray-300 hover:bg-[#2a2d36]'
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 truncate max-w-40 md:max-w-64">{subtitle}</span>
              )}
            </>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Actions />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-gray-400 hover:text-gray-200 p-1"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <rect y="3" width="18" height="1.5" rx="1"/>
            <rect y="8.25" width="18" height="1.5" rx="1"/>
            <rect y="13.5" width="18" height="1.5" rx="1"/>
          </svg>
        </button>
      </div>

      {/* Title row */}
      <div className="flex items-center gap-6 px-4 pb-3">
        <h1 className="text-lg font-semibold text-gray-100">
          {subtitle ?? 'kikOS PM'}
        </h1>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Total <span className="text-gray-300">{tasks.length}</span></span>
          <span>Done <span className="text-[#3bff8c]">{done}</span></span>
          <span className="text-[#f5c542]">Active:{inProgress}</span>
        </div>
      </div>

      {/* Mobile actions modal */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end md:hidden"
          onClick={closeMenu}
        >
          <div
            className="w-full bg-[#161a23] border-t border-[#2a2d36] rounded-t-xl p-5 flex flex-col gap-3 font-mono"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Actions</span>
              <button onClick={closeMenu} className="text-gray-500 hover:text-gray-300 text-lg leading-none">✕</button>
            </div>
            <Actions inModal />
          </div>
        </div>
      )}
    </div>
  )
}
