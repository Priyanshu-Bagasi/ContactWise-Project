import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center my-6">Task Manager</h1>
      <div className="max-w-3xl mx-auto">
        <TaskForm />
        <TaskList />
      </div>
    </main>
  )
}