import { useState } from 'react'
import type { Task } from '@/types/task'
import TaskCard from './TaskCard'

const COLUMNS: Task['status'][] = ['backlog', 'in progress', 'review', 'done', 'blocked', 'will not implement']

const columnAccent: Record<Task['status'], string> = {
  backlog:              'border-t-gray-600',
  'in progress':        'border-t-[#3baaff]',
  review:               'border-t-[#f5c542]',
  done:                 'border-t-[#3bff8c]',
  blocked:              'border-t-[#ff3b3b]',
  'will not implement': 'border-t-gray-600',
}

interface Props {
  tasks: Task[]
  epicNames?: Record<string, string>
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Task['status']) => void
}

export default function KanbanBoard({ tasks, epicNames, onEdit, onDelete, onMove }: Props) {
  const [activeCol, setActiveCol] = useState<Task['status']>('backlog')

  return (
    <>
      {/* Mobile: single column with dropdown switcher */}
      <div className="md:hidden p-4">
        <select
          value={activeCol}
          onChange={e => setActiveCol(e.target.value as Task['status'])}
          className="w-full mb-4 bg-[#1a1d27] border border-gray-700 text-gray-200 text-sm rounded px-3 py-2 font-mono uppercase tracking-widest"
        >
          {COLUMNS.map(col => {
            const count = tasks.filter(t => t.status === col).length
            return <option key={col} value={col}>{col} ({count})</option>
          })}
        </select>
        <div className={`kanban-column ${columnAccent[activeCol]}`}>
          {tasks.filter(t => t.status === activeCol).map(task => (
            <TaskCard key={task.id} task={task} epicNames={epicNames} onEdit={onEdit} onDelete={onDelete} onMove={onMove} columns={COLUMNS} />
          ))}
          {tasks.filter(t => t.status === activeCol).length === 0 && (
            <p className="text-xs text-gray-600 text-center py-6">No tasks</p>
          )}
        </div>
      </div>

      {/* Desktop: all columns, scrollable */}
      <div className="hidden md:flex gap-4 p-6 min-h-[calc(100vh-120px)] overflow-x-auto">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col)
          return (
            <div key={col} className={`kanban-column flex-shrink-0 w-56 xl:w-64 ${columnAccent[col]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest">{col}</span>
                <span className="text-xs text-gray-600">{colTasks.length}</span>
              </div>
              {colTasks.map(task => (
                <TaskCard key={task.id} task={task} epicNames={epicNames} onEdit={onEdit} onDelete={onDelete} onMove={onMove} columns={COLUMNS} />
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}
