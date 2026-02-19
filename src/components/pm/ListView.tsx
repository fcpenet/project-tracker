import type { Task } from '@/types/task'

const priorityColors: Record<Task['priority'], string> = {
  urgent: 'text-[#ff3b3b]',
  high:   'text-[#ff8c00]',
  medium: 'text-[#f5c542]',
  low:    'text-[#3baaff]',
}

const COLUMNS: Task['status'][] = ['backlog', 'in progress', 'review', 'done']

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Task['status']) => void
}

export default function ListView({ tasks, onEdit, onDelete, onMove }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
        No tasks found.
      </div>
    )
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-[#2a2d36]">
            <th className="pb-2 pr-4">Task</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2 pr-4">Priority</th>
            <th className="pb-2 pr-4">Due</th>
            <th className="pb-2 pr-4">Tags</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-b border-[#1e2330] hover:bg-[#161a23]">
              <td className="py-2 pr-4 text-gray-200">{task.title}</td>
              <td className="py-2 pr-4">
                <select
                  value={task.status}
                  onChange={e => onMove(task.id, e.target.value as Task['status'])}
                  className="bg-transparent text-gray-400 text-xs outline-none"
                >
                  {COLUMNS.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </td>
              <td className={`py-2 pr-4 text-xs ${priorityColors[task.priority]}`}>{task.priority}</td>
              <td className="py-2 pr-4 text-xs text-gray-500">{task.dueDate ?? '—'}</td>
              <td className="py-2 pr-4">
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(t => (
                    <span key={t} className="text-[10px] bg-[#1e2330] text-gray-400 rounded px-1">{t}</span>
                  ))}
                </div>
              </td>
              <td className="py-2 flex gap-2">
                <button onClick={() => onEdit(task)} title="Edit" className="text-gray-500 hover:text-[#3baaff] text-xs">✎</button>
                <button onClick={() => onDelete(task.id)} title="Delete" className="text-gray-500 hover:text-[#ff3b3b] text-xs">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
