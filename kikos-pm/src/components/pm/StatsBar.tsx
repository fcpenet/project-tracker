import { Task } from '@/types/task'

interface Props {
  tasks: Task[]
  view: 'kanban' | 'list'
  onViewChange: (v: 'kanban' | 'list') => void
  onNewTask: () => void
}

export default function StatsBar({ tasks, view, onViewChange, onNewTask }: Props) {
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in progress').length

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
