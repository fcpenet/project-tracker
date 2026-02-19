import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTaskContext } from '@/context/TaskContext'
import { useAuth } from '@/context/AuthContext'
import type { Task } from '@/types/task'
import KanbanBoard from '@/components/pm/KanbanBoard'
import ListView from '@/components/pm/ListView'
import TaskModal from '@/components/pm/TaskModal'
import FilterBar from '@/components/pm/FilterBar'
import StatsBar from '@/components/pm/StatsBar'

export default function PMPage() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, moveTask } = useTaskContext()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const projectTitle: string | undefined = (location.state as { projectTitle?: string } | null)?.projectTitle

  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterTag, setFilterTag] = useState('all')

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const allTags = [...new Set(tasks.flatMap(t => t.tags))]

  const filtered = tasks.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    if (filterTag !== 'all' && !t.tags.includes(filterTag)) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleSave(data: Parameters<typeof createTask>[0]) {
    if (editTask) {
      await updateTask(editTask.id, data)
    } else {
      await createTask(data)
    }
    setShowTaskModal(false)
    setEditTask(null)
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 font-mono">
      <StatsBar
        tasks={tasks}
        view={view}
        onViewChange={setView}
        onNewTask={() => { setEditTask(null); setShowTaskModal(true) }}
        onNewProject={() => navigate('/projects')}
        onLogout={logout}
        subtitle={projectTitle}
        hasApiKey={true}
      />

      {loading && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading tasks…
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-center h-64 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <FilterBar
            search={search} onSearch={setSearch}
            filterPriority={filterPriority} onFilterPriority={setFilterPriority}
            filterTag={filterTag} onFilterTag={setFilterTag}
            allTags={allTags}
          />
          {view === 'kanban'
            ? <KanbanBoard tasks={filtered} onEdit={t => { setEditTask(t); setShowTaskModal(true) }} onDelete={deleteTask} onMove={moveTask} />
            : <ListView tasks={filtered} onEdit={t => { setEditTask(t); setShowTaskModal(true) }} onDelete={deleteTask} onMove={moveTask} />
          }
        </>
      )}

      {showTaskModal && (
        <TaskModal task={editTask} allTags={allTags} onSave={handleSave} onClose={() => { setShowTaskModal(false); setEditTask(null) }} />
      )}
    </div>
  )
}
