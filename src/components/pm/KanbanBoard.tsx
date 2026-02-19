import type { Task } from '@/types/task'
import TaskCard from './TaskCard'

const COLUMNS: Task['status'][] = ['backlog', 'in progress', 'review', 'done']

const columnAccent: Record<Task['status'], string> = {
  backlog:      'border-t-gray-600',
  'in progress':'border-t-[#3baaff]',
  review:       'border-t-[#f5c542]',
  done:         'border-t-[#3bff8c]',
}

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Task['status']) => void
}

export default function KanbanBoard({ tasks, onEdit, onDelete, onMove }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 p-4 min-h-[calc(100vh-120px)]">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col)
        return (
          <div key={col} className={`bg-[#12151c] border border-[#2a2d36] border-t-2 ${columnAccent[col]} rounded-lg p-3 space-y-2`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-widest">{col}</span>
              <span className="text-xs text-gray-600">{colTasks.length}</span>
            </div>
            {colTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onMove={onMove} columns={COLUMNS} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
