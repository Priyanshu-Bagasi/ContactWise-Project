import { Task } from '../types/task'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch tasks')

    const data: Task[] = await response.json()
    return data.map((post) => ({
      ...post,
      completed: Math.random() > 0.5 // Simulating completed state
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    if (!response.ok) throw new Error('Failed to create task')

    const data: Task = await response.json()
    return { ...data, completed: false } // Ensure completed status is included
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update task')

    return await response.json()
  } catch (error) {
    console.error(`Error updating task ${id}:`, error)
    throw error
  }
}

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete task')
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error)
    throw error
  }
}
