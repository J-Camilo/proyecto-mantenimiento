"use client"

import { useState } from "react"
import "../src/styles/global.css"
import TaskForm from "./components/TaskForm"
import PriorityFilter from "./components/PriorityFilter"
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

  const [activePriorityFilter, setActivePriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")

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

  const updateTask = (id: number, title: string, description: string, priority: "low" | "medium" | "high") => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title, description, priority } : task)))
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks =
    activePriorityFilter === "all" ? tasks : tasks.filter((task) => task.priority === activePriorityFilter)

  return (
    <div className="container">
      <header>
        <h1>Mi Lista de Tareas</h1>
        <p>Proyecto para la actividad de control de versiones en GitHub</p>
      </header>

      <main>
        <TaskForm onAddTask={addTask} />

        <PriorityFilter activePriority={activePriorityFilter} onPriorityChange={setActivePriorityFilter} />

        <TaskList
          tasks={filteredTasks}
          onToggleCompletion={toggleTaskCompletion}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
        />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} - Proyecto de Mantenimiento de Software</p>
      </footer>
    </div>
  )
}
