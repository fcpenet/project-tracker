import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useTaskContext } from '@/context/TaskContext'
import { useAuth } from '@/context/AuthContext'
import { resetTasksCache } from '@/services/taskService'
import { epicService } from '@/services/epicService'
import type { Epic } from '@/services/epicService'
import type { Task, CreateTaskInput } from '@/types/task'
import KanbanBoard from '@/components/pm/KanbanBoard'
import ListView from '@/components/pm/ListView'
import TaskModal from '@/components/pm/TaskModal'
import NewEpicModal from '@/components/pm/NewEpicModal'
import FilterBar from '@/components/pm/FilterBar'
import StatsBar from '@/components/pm/StatsBar'

export default function PMPage() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, moveTask } = useTaskContext()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { projectId } = useParams<{ projectId: string }>()
  const projectTitle: string | undefined = (location.state as { projectTitle?: string } | null)?.projectTitle

  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showEpicModal, setShowEpicModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [filterEpic, setFilterEpic] = useState('all')
  const [epics, setEpics] = useState<Epic[]>([])

  const noEpics = error === 'This project has no epics yet'

  useEffect(() => { fetchTasks() }, [fetchTasks])

  useEffect(() => {
    if (!projectId) return
    epicService.getAll(Number(projectId)).then(setEpics).catch(() => {})
  }, [projectId])

  const allTags = [...new Set(tasks.flatMap(t => t.tags))]

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    if (filterTag !== 'all' && !t.tags.includes(filterTag)) return false
    if (filterEpic !== 'all' && t.epicId !== filterEpic) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleSave(data: CreateTaskInput, epicId: number) {
    if (editTask) {
      await updateTask(editTask.id, data)
    } else {
      await createTask(epicId, data)
    }
    setShowTaskModal(false)
    setEditTask(null)
  }

  function handleEpicCreated() {
    setShowEpicModal(false)
    resetTasksCache(Number(projectId))
    fetchTasks()
    if (projectId) {
      epicService.getAll(Number(projectId)).then(setEpics).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 font-mono">
      <StatsBar
        tasks={tasks}
        view={view}
        onViewChange={setView}
        onNewTask={() => { setEditTask(null); setShowTaskModal(true) }}
        onNewEpic={() => setShowEpicModal(true)}
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

      {!loading && error && !noEpics && (
        <div className="flex items-center justify-center h-64 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && noEpics && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500 text-sm">
          <span>This project has no epics yet.</span>
          <button
            onClick={() => setShowEpicModal(true)}
            className="text-xs px-4 py-2 rounded bg-[#3baaff] text-[#0d0f14] font-semibold hover:bg-[#5bbfff] transition-colors"
          >
            + Create First Epic
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <FilterBar
            search={search} onSearch={setSearch}
            filterStatus={filterStatus} onFilterStatus={setFilterStatus}
            filterPriority={filterPriority} onFilterPriority={setFilterPriority}
            filterTag={filterTag} onFilterTag={setFilterTag}
            allTags={allTags}
            filterEpic={filterEpic} onFilterEpic={setFilterEpic}
            allEpics={epics.map(e => ({ id: e.id, title: e.title }))}
          />
          {view === 'kanban'
            ? <KanbanBoard tasks={filtered} onEdit={t => { setEditTask(t); setShowTaskModal(true) }} onDelete={deleteTask} onMove={moveTask} />
            : <ListView tasks={filtered} onEdit={t => { setEditTask(t); setShowTaskModal(true) }} onDelete={deleteTask} onMove={moveTask} />
          }
        </>
      )}

      {showTaskModal && (
        <TaskModal
          task={editTask}
          epics={epics.map(e => ({ id: e.id, title: e.title }))}
          allTags={allTags}
          onSave={handleSave}
          onClose={() => { setShowTaskModal(false); setEditTask(null) }}
        />
      )}

      {showEpicModal && projectId && (
        <NewEpicModal
          projectId={Number(projectId)}
          onCreated={handleEpicCreated}
          onClose={() => setShowEpicModal(false)}
        />
      )}
    </div>
  )
}
