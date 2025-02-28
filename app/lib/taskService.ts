import { Task } from '../types/task'

const API_URL = 'https://jsonplaceholder.typicode.com/posts'

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_URL)
  const data = await response.json()
  return data.map((post: any) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    completed: Math.random() > 0.5,
    userId: post.userId
  }))
}

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  const data = await response.json()
  return { ...data, completed: false } // Ensure completed status is included
}

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  return response.json()
}

export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
}