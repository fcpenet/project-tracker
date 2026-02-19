import { useState } from 'react'
import type { FormEvent } from 'react'
import { projectService } from '@/services/projectService'

interface Props {
  onCreated: () => void
  onClose: () => void
}

export default function NewProjectModal({ onCreated, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await projectService.create(title.trim(), description.trim() || undefined)
      onCreated()
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#13151d] border border-[#2a2d36] rounded-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-200">New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="proj-title" className="text-xs text-gray-400">Title <span className="text-red-400">*</span></label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
              className="bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#3baaff]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="proj-desc" className="text-xs text-gray-400">Description</label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#3baaff] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-2 rounded border border-[#2a2d36] text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="text-xs px-4 py-2 rounded bg-[#3baaff] text-[#0d0f14] font-semibold hover:bg-[#5bbfff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
