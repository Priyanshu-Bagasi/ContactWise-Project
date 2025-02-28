'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, updateTask } from '../lib/taskService'
import { Task } from '../types/task'
import { useEffect } from 'react'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Description is required'),
  userId: z.number().default(1),
  completed: z.boolean().default(false)
})

type FormData = z.infer<typeof schema>

export default function TaskForm({ task, onCancel }: { task?: Task; onCancel?: () => void }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      body: '',
      userId: 1,
      completed: false
    }
  })

  useEffect(() => {
    if (task) {
      setValue('title', task.title)
      setValue('body', task.body)
      setValue('userId', task.userId)
      setValue('completed', task.completed)
    }
  }, [task, setValue])

  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      const tempId = Date.now() // Temporary ID for optimistic update
  
      // Optimistically add the new task to the list
      queryClient.setQueryData<Task[]>(['tasks'], (old) => [
        ...(old || []),
        { ...newTask, id: tempId }
      ])
  
      return { previousTasks, tempId }
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context?.previousTasks)
    },
    onSuccess: (data, variables, context) => {
      // Replace the temporary ID with the real ID from the API response
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) => task.id === context?.tempId ? data : task)
      )
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateTask(task!.id, data),
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((t) => t.id === task?.id ? { ...t, ...updatedTask } : t)
      )
      
      return { previousTasks }
    },
    onError: (err, updatedTask, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks)
    }
  })

  const onSubmit = (data: FormData) => {
    task ? updateMutation.mutate(data) : createMutation.mutate(data)
    reset()
    if (task) onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
      <div>
        <input
          {...register('title')}
          placeholder="Task title"
          className="input input-bordered w-full"
        />
        {errors.title && <p className="text-error mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <textarea
          {...register('body')}
          placeholder="Task description"
          className="textarea textarea-bordered w-full"
          rows={4}
        />
        {errors.body && <p className="text-error mt-1">{errors.body.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        {task && (
          <button 
            type="button" 
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={createMutation.status === 'pending' || updateMutation.status === 'pending'}
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}