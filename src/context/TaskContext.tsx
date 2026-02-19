import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'
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
    } catch (e: unknown) {
      dispatch({ type: 'SET_ERROR', payload: (e as Error).message })
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
