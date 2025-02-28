'use client'

import { useState } from 'react'
import type { Task } from '../types/task'
import TaskForm from './TaskForm'

type TaskItemProps = {
  task: Task
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
    }
  }

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {isEditing ? (
          <TaskForm 
            task={task} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="card-title text-lg">{task.title}</h3>
                <p className="text-base-content/80 mt-2">{task.body}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-ghost"
                  aria-label="Edit task"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-sm btn-error text-white"
                  aria-label="Delete task"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-base-content/60">
              <span className={`badge ${task.completed ? 'badge-success' : 'badge-warning'}`}>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}