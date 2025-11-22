"use client"

import "../src/styles/global.css"
import { useState } from "react"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Implementar historias de usuario",
      description: "Crear y subir a GitHub las 5 historias de usuario",
      completed: false,
      priority: "high",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Configurar entorno de desarrollo",
      description: "Instalar Git y configurar GitHub",
      completed: true,
      priority: "medium",
      createdAt: new Date(),
    },
  ])

  const addTask = (title: string, description: string, priority: "low" | "medium" | "high") => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      priority,
      createdAt: new Date(),
    }
    setTasks([...tasks, newTask])
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="container">
      <header>
        <h1>Mi Lista de Tareas</h1>
        <p>Proyecto para la actividad de control de versiones en GitHub</p>
      </header>

      <main>
        <TaskForm onAddTask={addTask} />
        <TaskList tasks={tasks} onToggleCompletion={toggleTaskCompletion} onDeleteTask={deleteTask} />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} - Todos los derechos reservados a Juan Camilo Fong Leon - Proyecto de Mantenimiento de Software </p>
      </footer>
    </div>
  )
}
