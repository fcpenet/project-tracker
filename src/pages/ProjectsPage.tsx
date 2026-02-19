import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { projectService } from '@/services/projectService'
import type { Project } from '@/services/projectService'
import NewProjectModal from '@/components/pm/NewProjectModal'

export default function ProjectsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  async function loadProjects() {
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  function handleProjectCreated() {
    setShowModal(false)
    loadProjects()
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-4 border-b border-[#2a2d36]">
        <span className="text-[#3baaff] font-semibold text-sm">kikOS PM</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="text-xs px-3 py-1 rounded border border-[#3baaff] text-[#3baaff] hover:bg-[#3baaff]/10 transition-colors"
          >
            + New Project
          </button>
          <button
            onClick={logout}
            className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="projects-container">
        <h1 className="text-base font-semibold text-gray-300 mb-4">Projects</h1>

        {loading && (
          <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
            Loading projects…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center h-48 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500 text-sm">
            <span>No projects yet.</span>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs px-4 py-2 rounded bg-[#3baaff] text-[#0d0f14] font-semibold hover:bg-[#5bbfff] transition-colors"
            >
              Create your first project
            </button>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`, { state: { projectTitle: project.title } })}
                className="text-left bg-[#13151d] border border-[#2a2d36] rounded-xl p-6 shadow-md cursor-pointer transition-all duration-150 group hover:border-[#3baaff] hover:shadow-[0_0_0_1px_rgba(59,170,255,0.3),0_4px_16px_rgba(59,170,255,0.08)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-[#3baaff] transition-colors line-clamp-1">
                    {project.title}
                  </span>
                  <span className={`shrink-0 text-xs px-2 py-1 rounded-full ${
                    project.status === 'active'
                      ? 'bg-[#3bff8c]/10 text-[#3bff8c]'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2d36]">
                  <p className="text-xs text-gray-600">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-gray-600 group-hover:text-[#3baaff] transition-colors">
                    Open →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewProjectModal onCreated={handleProjectCreated} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
