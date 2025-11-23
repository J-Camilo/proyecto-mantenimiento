"use client"

import { useState, useEffect } from "react"
import type { Task } from "../src/types"
import "../src/styles/global.css"
import Dashboard from "./components/Dashboard"
import TaskForm from "./components/TaskForm"
import PriorityFilter from "./components/PriorityFilter"
import SortSelector from "./components/SortSelector"
import TaskList from "./components/TaskList"
import PixelBlast from "./animations/PixelBlast"

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activePriorityFilter, setActivePriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "priority">("recent")

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks) as Task[]
        setTasks(parsedTasks)
      } catch (error) {
        console.error("Error al cargar tareas del localStorage:", error)
        setTasks(getDefaultTasks())
      }
    } else {
      setTasks(getDefaultTasks())
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const getDefaultTasks = (): Task[] => [
    {
      id: 1,
      title: "Tarea de ejemplo 1",
      description: "descripción de la tarea de ejemplo 1",
      completed: false,
      priority: "low",
      createdAt: new Date(),
    },
  ]

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

  const sortedAndFilteredTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="container">
        <header>
          <h1>Mi Lista de Tareas</h1>
        </header>
        <main>
          <p style={{ textAlign: "center", padding: "2rem" }}>Cargando tareas...</p>
        </main>
      </div>
    )
  }

  return (
    <>
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: -1, overflow: 'hidden' }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#1cca87"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      <div className="container">
        <header>
          <h1>Mi Lista de Tareas</h1>
        </header>

        <main>
          <Dashboard tasks={tasks} />

          <TaskForm onAddTask={addTask} />

          <div className="filter-sort-container">
            <PriorityFilter activePriority={activePriorityFilter} onPriorityChange={setActivePriorityFilter} />
            <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          <TaskList
            tasks={sortedAndFilteredTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} - Todos los derechos reservados a Juan Camilo Fong Leon para libre uso</p>
        </footer>
      </div>
    </>
  )
}
