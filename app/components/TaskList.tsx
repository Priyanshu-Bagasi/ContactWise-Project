'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import TaskItem from './TaskItem'
import { getTasks, deleteTask } from '../lib/taskService'
import { Task } from '../types/task'

export default function TaskList() {
  const queryClient = useQueryClient()

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old) => 
        old?.filter((task) => task.id !== id)
      )
      return { previousTasks }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks)
    }
  })

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      <div className="space-y-4">
        {tasks?.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onDelete={deleteMutation.mutate}
          />
        ))}
      </div>
    </div>
  )
}