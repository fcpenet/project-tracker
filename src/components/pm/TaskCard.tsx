import type { Task } from '@/types/task'

const priorityColors: Record<Task['priority'], string> = {
  urgent: 'text-[#ff3b3b] border-[#ff3b3b]',
  high:   'text-[#ff8c00] border-[#ff8c00]',
  medium: 'text-[#f5c542] border-[#f5c542]',
  low:    'text-[#3baaff] border-[#3baaff]',
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Task['status']) => void
  columns: Task['status'][]
}

export default function TaskCard({ task, onEdit, onDelete, onMove, columns }: Props) {
  const isOverdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date()

  return (
    <div className="bg-[#161a23] border border-[#2a2d36] rounded p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-gray-200 leading-snug">{task.title}</span>
        <div className="flex gap-1 shrink-0">
          <button
            title="Edit"
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-[#3baaff] text-xs px-1"
          >✎</button>
          <button
            title="Delete"
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-[#ff3b3b] text-xs px-1"
          >✕</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <span className={`text-[10px] border rounded px-1 ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-[#1e2330] text-gray-400 rounded px-1">{tag}</span>
        ))}
      </div>

      {task.dueDate && (
        <div className={`text-[10px] ${isOverdue ? 'text-[#ff3b3b]' : 'text-gray-500'}`}>
          {isOverdue && '⚠ '}Due {task.dueDate}
        </div>
      )}

      {columns.length > 0 && (
        <div className="flex gap-1 justify-end">
          {columns.indexOf(task.status) > 0 && (
            <button
              title="Move left"
              onClick={() => onMove(task.id, columns[columns.indexOf(task.status) - 1])}
              className="text-[10px] text-gray-500 hover:text-[#3baaff] px-1"
            >←</button>
          )}
          {columns.indexOf(task.status) < columns.length - 1 && (
            <button
              title="Move right"
              onClick={() => onMove(task.id, columns[columns.indexOf(task.status) + 1])}
              className="text-[10px] text-gray-500 hover:text-[#3baaff] px-1"
            >→</button>
          )}
        </div>
      )}
    </div>
  )
}
