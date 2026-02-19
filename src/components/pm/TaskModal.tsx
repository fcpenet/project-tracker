import { useState } from 'react'
import { Task, CreateTaskInput, Priority, Status } from '@/types/task'

interface Props {
  task: Task | null
  allTags: string[]
  onSave: (data: CreateTaskInput) => void
  onClose: () => void
}

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low']
const statuses: Status[] = ['backlog', 'in progress', 'review', 'done']

export default function TaskModal({ task, allTags, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<Status>(task?.status ?? 'backlog')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [tags, setTags] = useState<string[]>(task?.tags ?? [])
  const [newTag, setNewTag] = useState('')

  function handleSubmit() {
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description || undefined, status, priority, dueDate: dueDate || undefined, tags })
  }

  function addTag(tag: string) {
    const t = tag.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setNewTag('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161a23] border border-[#2a2d36] rounded-lg w-full max-w-md p-5 space-y-4 font-mono">
        <h2 className="text-[#3baaff] text-sm font-semibold">
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <input
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#3baaff]"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#3baaff] resize-none"
        />

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
              className="w-full bg-[#0d0f14] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-200 mt-1"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="w-full bg-[#0d0f14] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-200 mt-1"
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-1 text-sm text-gray-200 mt-1"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase">Tags</label>
          <div className="flex flex-wrap gap-1 mt-1 mb-1">
            {tags.map(t => (
              <span key={t} className="text-[10px] bg-[#1e2330] text-gray-400 rounded px-1 flex items-center gap-1">
                {t}
                <button onClick={() => setTags(tags.filter(x => x !== t))} className="text-gray-600 hover:text-red-400">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Add tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag(newTag)}
              className="flex-1 bg-[#0d0f14] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-200 outline-none"
            />
            {allTags.filter(t => !tags.includes(t)).map(t => (
              <button key={t} onClick={() => addTag(t)} className="text-[10px] text-gray-500 hover:text-[#3baaff]">{t}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#3baaff] text-[#0d0f14] rounded py-2 text-sm font-semibold hover:bg-[#5bbfff]"
          >
            {task ? 'Save Changes' : 'Create Task'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-[#2a2d36] text-gray-400 rounded py-2 text-sm hover:border-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
