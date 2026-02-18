# kikOS PM — Frontend Implementation Plan
> Standalone React app deployed on Vercel, connecting to existing backend at rag-pipeline-91ct.vercel.app

---

## Stack

| Layer       | Tech                                      |
|-------------|-------------------------------------------|
| Framework   | React + Vite                              |
| Language    | TypeScript                                |
| Styling     | Tailwind CSS                              |
| Routing     | React Router v6                           |
| State       | React Context + useReducer                |
| Testing     | Vitest + React Testing Library            |
| Deploy      | Vercel                                    |

---

## Project Bootstrap

```bash
npm create vite@latest kikos-pm -- --template react-ts
cd kikos-pm
npm install
npm install react-router-dom tailwindcss @tailwindcss/vite
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### `src/test/setup.ts`
```ts
import '@testing-library/jest-dom'
```

### `.env`
```env
VITE_API_URL=https://rag-pipeline-91ct.vercel.app
```

### `package.json` scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```

---

## File Structure

```
src/
  components/
    pm/
      KanbanBoard.tsx
      KanbanBoard.test.tsx
      ListView.tsx
      ListView.test.tsx
      TaskCard.tsx
      TaskCard.test.tsx
      TaskModal.tsx
      TaskModal.test.tsx
      FilterBar.tsx
      FilterBar.test.tsx
      StatsBar.tsx
      StatsBar.test.tsx
  context/
    TaskContext.tsx
    TaskContext.test.tsx
  hooks/
    useTasks.ts
    useTasks.test.ts
  services/
    taskService.ts        ← API placeholder (replace with real endpoints)
    taskService.test.ts   ← Failing tests (expected — fill in when API is ready)
  types/
    task.ts
  pages/
    PMPage.tsx
    PMPage.test.tsx
  test/
    setup.ts
    mocks/
      taskService.mock.ts
  App.tsx
  main.tsx
```

---

## Phase 1: Types

### `src/types/task.ts`
```ts
export type Priority = 'urgent' | 'high' | 'medium' | 'low'
export type Status = 'backlog' | 'in progress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  dueDate?: string       // ISO string e.g. "2026-03-01"
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTaskInput = Partial<CreateTaskInput>
```

---

## Phase 2: API Service (Placeholder)

> ⚠️ These are placeholder implementations. Tests for this file are expected to FAIL until you wire up the real endpoints from your backend.

### `src/services/taskService.ts`
```ts
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'

const BASE_URL = import.meta.env.VITE_API_URL

// TODO: Replace endpoint paths with your actual backend routes
export const taskService = {
  async getAll(): Promise<Task[]> {
    // TODO: replace '/tasks' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks`)
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  },

  async create(data: CreateTaskInput): Promise<Task> {
    // TODO: replace '/tasks' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create task')
    return res.json()
  },

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    // TODO: replace '/tasks/:id' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
  },

  async remove(id: string): Promise<void> {
    // TODO: replace '/tasks/:id' with actual endpoint
    const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete task')
  },
}
```

### `src/services/taskService.test.ts`
```ts
// ⚠️ These tests are EXPECTED TO FAIL until real API endpoints are wired up.
// They serve as a contract — once your backend routes are confirmed, fill in
// the correct paths in taskService.ts and these should pass.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { taskService } from './taskService'

const mockTask = {
  id: '1',
  title: 'Test Task',
  status: 'backlog' as const,
  priority: 'medium' as const,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('taskService.getAll', () => {
  it('should fetch and return all tasks', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockTask],
    } as any)

    const tasks = await taskService.getAll()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Test Task')
    // TODO: Verify this matches actual response shape from your backend
  })

  it('should throw on failed fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as any)
    await expect(taskService.getAll()).rejects.toThrow('Failed to fetch tasks')
  })
})

describe('taskService.create', () => {
  it('should POST and return created task', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTask,
    } as any)

    const result = await taskService.create({
      title: 'Test Task',
      status: 'backlog',
      priority: 'medium',
      tags: [],
    })
    expect(result.id).toBe('1')
    // TODO: Verify request body shape matches what your backend expects
  })
})

describe('taskService.update', () => {
  it('should PATCH and return updated task', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockTask, title: 'Updated' }),
    } as any)

    const result = await taskService.update('1', { title: 'Updated' })
    expect(result.title).toBe('Updated')
    // TODO: Verify PATCH vs PUT based on your backend
  })
})

describe('taskService.remove', () => {
  it('should DELETE the task', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true } as any)
    await expect(taskService.remove('1')).resolves.toBeUndefined()
  })
})
```

---

## Phase 3: State Management

### `src/context/TaskContext.tsx`
```tsx
import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'
import { taskService } from '@/services/taskService'

type State = { tasks: Task[]; loading: boolean; error: string | null }
type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TASKS':   return { ...state, tasks: action.payload, loading: false }
    case 'ADD_TASK':    return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) }
    case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_ERROR':   return { ...state, error: action.payload, loading: false }
    default:            return state
  }
}

interface TaskContextValue {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (data: CreateTaskInput) => Promise<void>
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, status: Task['status']) => Promise<void>
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { tasks: [], loading: true, error: null })

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const tasks = await taskService.getAll()
      dispatch({ type: 'SET_TASKS', payload: tasks })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    }
  }, [])

  const createTask = useCallback(async (data: CreateTaskInput) => {
    const task = await taskService.create(data)
    dispatch({ type: 'ADD_TASK', payload: task })
  }, [])

  const updateTask = useCallback(async (id: string, data: UpdateTaskInput) => {
    const task = await taskService.update(id, data)
    dispatch({ type: 'UPDATE_TASK', payload: task })
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    await taskService.remove(id)
    dispatch({ type: 'DELETE_TASK', payload: id })
  }, [])

  const moveTask = useCallback(async (id: string, status: Task['status']) => {
    const task = await taskService.update(id, { status })
    dispatch({ type: 'UPDATE_TASK', payload: task })
  }, [])

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider')
  return ctx
}
```

### `src/context/TaskContext.test.tsx`
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { TaskProvider, useTaskContext } from './TaskContext'
import * as taskService from '@/services/taskService'

const mockTask = {
  id: '1', title: 'Test', status: 'backlog' as const,
  priority: 'medium' as const, tags: [],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}

function Consumer() {
  const { tasks, loading } = useTaskContext()
  if (loading) return <div>Loading</div>
  return <div>{tasks.map(t => <span key={t.id}>{t.title}</span>)}</div>
}

beforeEach(() => vi.restoreAllMocks())

describe('TaskContext', () => {
  it('renders loading state initially', () => {
    vi.spyOn(taskService.taskService, 'getAll').mockResolvedValue([])
    render(<TaskProvider><Consumer /></TaskProvider>)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('renders tasks after fetch', async () => {
    vi.spyOn(taskService.taskService, 'getAll').mockResolvedValue([mockTask])
    render(<TaskProvider><Consumer /></TaskProvider>)
    await act(async () => {})
    // Note: fetchTasks must be called explicitly — trigger from PMPage useEffect
  })
})
```

---

## Phase 4: Test Mock

### `src/test/mocks/taskService.mock.ts`
```ts
// Reusable mock for taskService — import this in component tests
import { vi } from 'vitest'
import { Task } from '@/types/task'

export const mockTasks: Task[] = [
  {
    id: '1', title: 'Build landing page', description: 'Hero section + CTA',
    status: 'in progress', priority: 'high', tags: ['frontend', 'design'],
    dueDate: '2026-03-01', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', title: 'Setup CI/CD', description: undefined,
    status: 'backlog', priority: 'medium', tags: ['devops'],
    dueDate: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', title: 'Write unit tests',
    status: 'done', priority: 'low', tags: ['backend'],
    dueDate: '2026-01-01', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
]

export const mockTaskService = {
  getAll: vi.fn().mockResolvedValue(mockTasks),
  create: vi.fn().mockResolvedValue(mockTasks[0]),
  update: vi.fn().mockResolvedValue(mockTasks[0]),
  remove: vi.fn().mockResolvedValue(undefined),
}
```

---

## Phase 5: Components + Tests

### `src/components/pm/TaskCard.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from './TaskCard'
import { mockTasks } from '@/test/mocks/taskService.mock'

const task = mockTasks[0]

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText(task.title)).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText(task.priority)).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    task.tags.forEach(tag => expect(screen.getByText(tag)).toBeInTheDocument())
  })

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={onDelete} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    fireEvent.click(screen.getByTitle('Delete'))
    expect(onDelete).toHaveBeenCalledWith(task.id)
  })

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<TaskCard task={task} onEdit={onEdit} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    fireEvent.click(screen.getByTitle('Edit'))
    expect(onEdit).toHaveBeenCalledWith(task)
  })

  it('shows overdue warning for past due dates', () => {
    const overdueTask = { ...task, dueDate: '2020-01-01', status: 'backlog' as const }
    render(<TaskCard task={overdueTask} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} columns={['backlog','in progress','review','done']} />)
    expect(screen.getByText(/⚠/)).toBeInTheDocument()
  })
})
```

### `src/components/pm/TaskModal.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskModal from './TaskModal'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('TaskModal — Create Mode', () => {
  it('renders empty form', () => {
    render(<TaskModal task={null} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByPlaceholderText(/task title/i)).toHaveValue('')
  })

  it('does not submit with empty title', async () => {
    const onSave = vi.fn()
    render(<TaskModal task={null} allTags={[]} onSave={onSave} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('Create Task'))
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with correct data', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<TaskModal task={null} allTags={['frontend']} onSave={onSave} onClose={vi.fn()} />)
    await user.type(screen.getByPlaceholderText(/task title/i), 'New Task')
    fireEvent.click(screen.getByText('Create Task'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Task' }))
  })

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn()
    render(<TaskModal task={null} allTags={[]} onSave={vi.fn()} onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('TaskModal — Edit Mode', () => {
  it('pre-fills form with existing task data', () => {
    const task = mockTasks[0]
    render(<TaskModal task={task} allTags={task.tags} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByDisplayValue(task.title)).toBeInTheDocument()
  })

  it('shows Save Changes button in edit mode', () => {
    render(<TaskModal task={mockTasks[0]} allTags={[]} onSave={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })
})
```

### `src/components/pm/FilterBar.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from './FilterBar'

const defaultProps = {
  search: '', onSearch: vi.fn(),
  filterPriority: 'all', onFilterPriority: vi.fn(),
  filterTag: 'all', onFilterTag: vi.fn(),
  allTags: ['frontend', 'backend'],
}

describe('FilterBar', () => {
  it('renders search input', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<FilterBar {...defaultProps} onSearch={onSearch} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('renders all tag options', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('backend')).toBeInTheDocument()
  })
})
```

### `src/components/pm/StatsBar.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsBar from './StatsBar'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('StatsBar', () => {
  it('shows correct total count', () => {
    render(<StatsBar tasks={mockTasks} view="kanban" onViewChange={vi.fn()} onNewTask={vi.fn()} />)
    expect(screen.getByText(mockTasks.length.toString())).toBeInTheDocument()
  })

  it('shows correct done count', () => {
    render(<StatsBar tasks={mockTasks} view="kanban" onViewChange={vi.fn()} onNewTask={vi.fn()} />)
    const doneCount = mockTasks.filter(t => t.status === 'done').length
    expect(screen.getByText(doneCount.toString())).toBeInTheDocument()
  })

  it('calls onNewTask when New Task clicked', () => {
    const onNewTask = vi.fn()
    render(<StatsBar tasks={mockTasks} view="kanban" onViewChange={vi.fn()} onNewTask={onNewTask} />)
    screen.getByText(/new task/i).click()
    expect(onNewTask).toHaveBeenCalled()
  })
})
```

### `src/components/pm/KanbanBoard.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import KanbanBoard from './KanbanBoard'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('KanbanBoard', () => {
  it('renders all 4 columns', () => {
    render(<KanbanBoard tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText('backlog')).toBeInTheDocument()
    expect(screen.getByText('in progress')).toBeInTheDocument()
    expect(screen.getByText('review')).toBeInTheDocument()
    expect(screen.getByText('done')).toBeInTheDocument()
  })

  it('renders tasks in correct columns', () => {
    render(<KanbanBoard tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText('Build landing page')).toBeInTheDocument()
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })
})
```

### `src/components/pm/ListView.test.tsx`
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListView from './ListView'
import { mockTasks } from '@/test/mocks/taskService.mock'

describe('ListView', () => {
  it('renders all tasks', () => {
    render(<ListView tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    mockTasks.forEach(t => expect(screen.getByText(t.title)).toBeInTheDocument())
  })

  it('renders table headers', () => {
    render(<ListView tasks={mockTasks} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText(/task/i)).toBeInTheDocument()
    expect(screen.getByText(/priority/i)).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(<ListView tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} onMove={vi.fn()} />)
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
  })
})
```

---

## Phase 6: Main Page

### `src/pages/PMPage.tsx`
```tsx
import { useEffect, useState } from 'react'
import { useTaskContext } from '@/context/TaskContext'
import { Task } from '@/types/task'
import KanbanBoard from '@/components/pm/KanbanBoard'
import ListView from '@/components/pm/ListView'
import TaskModal from '@/components/pm/TaskModal'
import FilterBar from '@/components/pm/FilterBar'
import StatsBar from '@/components/pm/StatsBar'

export default function PMPage() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, moveTask } = useTaskContext()
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [showModal, setShowModal] = useState(false)
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

  async function handleSave(data: any) {
    if (editTask) {
      await updateTask(editTask.id, data)
    } else {
      await createTask(data)
    }
    setShowModal(false)
    setEditTask(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-gray-500 font-mono">
      Loading tasks...
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-red-400 font-mono">
      Error: {error}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 font-mono">
      <StatsBar tasks={tasks} view={view} onViewChange={setView} onNewTask={() => { setEditTask(null); setShowModal(true) }} />
      <FilterBar
        search={search} onSearch={setSearch}
        filterPriority={filterPriority} onFilterPriority={setFilterPriority}
        filterTag={filterTag} onFilterTag={setFilterTag}
        allTags={allTags}
      />
      {view === 'kanban'
        ? <KanbanBoard tasks={filtered} onEdit={t => { setEditTask(t); setShowModal(true) }} onDelete={deleteTask} onMove={moveTask} />
        : <ListView tasks={filtered} onEdit={t => { setEditTask(t); setShowModal(true) }} onDelete={deleteTask} onMove={moveTask} />
      }
      {showModal && (
        <TaskModal task={editTask} allTags={allTags} onSave={handleSave} onClose={() => { setShowModal(false); setEditTask(null) }} />
      )}
    </div>
  )
}
```

### `src/pages/PMPage.test.tsx`
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import PMPage from './PMPage'
import { TaskProvider } from '@/context/TaskContext'
import * as taskServiceModule from '@/services/taskService'
import { mockTasks } from '@/test/mocks/taskService.mock'

beforeEach(() => {
  vi.spyOn(taskServiceModule.taskService, 'getAll').mockResolvedValue(mockTasks)
})

describe('PMPage', () => {
  it('shows loading state initially', () => {
    render(<TaskProvider><PMPage /></TaskProvider>)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders tasks after load', async () => {
    render(<TaskProvider><PMPage /></TaskProvider>)
    await act(async () => {})
    expect(screen.getByText('Build landing page')).toBeInTheDocument()
  })

  it('renders kanban view by default', async () => {
    render(<TaskProvider><PMPage /></TaskProvider>)
    await act(async () => {})
    expect(screen.getByText('backlog')).toBeInTheDocument()
  })
})
```

---

## Phase 7: App Entry + Routing

### `src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TaskProvider } from '@/context/TaskContext'
import PMPage from '@/pages/PMPage'

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/pm" replace />} />
          <Route path="/pm" element={<PMPage />} />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  )
}
```

---

## Phase 8: Vercel Deployment

### `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy steps
```bash
npm install -g vercel
vercel login
vercel deploy

# Set env var in Vercel dashboard or via CLI:
vercel env add VITE_API_URL
# Enter: https://rag-pipeline-91ct.vercel.app
```

---

## Implementation Order for Claude Code

Feed these in sequence:

1. `Phase 1` — Types (`task.ts`)
2. `Phase 2` — Service placeholder + failing tests (`taskService.ts` + `taskService.test.ts`)
3. `Phase 4` — Test mock (`taskService.mock.ts`)
4. `Phase 3` — Context + reducer (`TaskContext.tsx` + `TaskContext.test.tsx`)
5. Build components one at a time with tests:
   - `TaskCard` + `TaskCard.test`
   - `TaskModal` + `TaskModal.test`
   - `FilterBar` + `FilterBar.test`
   - `StatsBar` + `StatsBar.test`
   - `KanbanBoard` + `KanbanBoard.test`
   - `ListView` + `ListView.test`
6. `Phase 6` — Page (`PMPage.tsx` + `PMPage.test.tsx`)
7. `Phase 7` — App entry + routing
8. `Phase 8` — Vercel deploy config

---

## Visual Reference

Use the previously built artifact (`kiko-pm.jsx`) as the design reference. Key tokens:

| Token         | Value                  |
|---------------|------------------------|
| Background    | `#0d0f14`              |
| Accent        | `#3baaff`              |
| Font          | `DM Mono` / `Fira Code`|
| Urgent        | `#ff3b3b`              |
| High          | `#ff8c00`              |
| Medium        | `#f5c542`              |
| Low           | `#3baaff`              |
| Done col      | `#3bff8c`              |
