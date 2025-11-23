"use client"

import { useState, useEffect, ChangeEvent } from "react"
import type { Task } from "../src/types"
import "../src/styles/global.css"
import Dashboard from "./components/Dashboard"
import TaskForm from "./components/TaskForm"
import PriorityFilter from "./components/PriorityFilter"
import SortSelector from "./components/SortSelector"
import TaskList from "./components/TaskList"
import PixelBlast from "./animations/PixelBlast"
import Onboarding from "./components/Onboarding"
import KanbanBoard from "./components/KanbanBoard"

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activePriorityFilter, setActivePriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "priority">("recent")
  const [user, setUser] = useState<{ name: string; ip: string } | null>(null)
  const [isCheckingUser, setIsCheckingUser] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("viewMode")
    if (saved === "kanban" || saved === "list") {
      setViewMode(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode)
  }, [viewMode])

  const getDefaultTasks = (): Task[] => [
    {
      id: 1,
      title: "Tarea de ejemplo 1",
      description: "descripción de la tarea de ejemplo 1",
      completed: false,
      priority: "low",
      createdAt: new Date(),
      status: "process",
    },
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks)
        setTasks(parsed)
      } catch (e) {
        console.error("Error en localStorage:", e)
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

  useEffect(() => {
    async function verifyUser() {
      const savedUser = localStorage.getItem("user")
      const currentIP = await fetch("https://api.ipify.org?format=json")
        .then(r => r.json())
        .then(d => d.ip)

      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        if (parsed.ip === currentIP) {
          setUser(parsed)
        }
      }

      setIsCheckingUser(false)
    }

    verifyUser()
  }, [])

  const handleFinishOnboarding = (userData: { name: string; ip: string }) => {
    setUser(userData)
  }

  const exportData = () => {
    const data = {
      user,
      tasks,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "backup.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      alert("❌ Solo se permiten archivos .json");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);

        if (
          typeof parsed !== "object" ||
          !parsed.user ||
          !parsed.tasks ||
          !Array.isArray(parsed.tasks) ||
          !parsed.exportedAt
        ) {
          throw new Error("Estructura inválida");
        }

        if (
          typeof parsed.user.name !== "string" ||
          typeof parsed.user.ip !== "string"
        ) {
          throw new Error("Datos del usuario incorrectos");
        }

        const validTasks: Task[] = parsed.tasks.map((t: any) => {
          if (
            typeof t.id !== "number" ||
            typeof t.title !== "string" ||
            typeof t.description !== "string" ||
            typeof t.completed !== "boolean" ||
            !["low", "medium", "high"].includes(t.priority) ||
            !t.createdAt
          ) {
            throw new Error("Tarea con estructura inválida");
          }

          return {
            ...t,
            createdAt: new Date(t.createdAt),
          };
        });

        if (!parsed.exportedAt || isNaN(new Date(parsed.exportedAt).getTime())) {
          throw new Error("Fecha de exportación inválida");
        }

        setTasks(validTasks);
        localStorage.setItem("tasks", JSON.stringify(validTasks));

        setUser(parsed.user);
        localStorage.setItem("user", JSON.stringify(parsed.user));

        alert("✅ Datos importados correctamente 🎉");
      } catch (err) {
        console.error(err);
        alert("❌ Archivo inválido o estructura incorrecta.");
      }
    };

    reader.readAsText(file);
  };

  if (isCheckingUser) return <div>Cargando...</div>

  if (!user) return <Onboarding onFinish={handleFinishOnboarding} />

  const addTask = (title: string, description: string, priority: "low" | "medium" | "high") => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        description,
        completed: false,
        priority,
        createdAt: new Date(),
        status: "todo",
      }
    ])
  }

  const updateTask = (id: number, title: string, description: string, priority: "low" | "medium" | "high") => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title, description, priority } : t))
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const filteredByPriority =
    activePriorityFilter === "all"
      ? tasks
      : tasks.filter(task => task.priority === activePriorityFilter)

  const filteredBySearch = searchTerm.trim() === ""
    ? filteredByPriority
    : filteredByPriority.filter(task =>
      task.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )

  const sortedAndFilteredTasks = [...filteredBySearch].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime()
    const timeB = new Date(b.createdAt).getTime()

    if (sortBy === "recent") return timeB - timeA
    if (sortBy === "oldest") return timeA - timeB

    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  const moveTaskToStatus = (
    id: number,
    newStatus: "todo" | "process" | "done"
  ) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
          ...task,
          status: newStatus,
          completed: newStatus === "done"
        }
        : task
    ));
  };


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
        <div className="Anuncios"><p>Proxima actualización conexion a azure devOps</p></div>
        <header>
          <h1>Mi Lista de Tareas</h1>
          <p>Bienvenido, {user?.name}</p>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px", justifyContent: "center" }}>

            <button className="btn-premium " onClick={exportData}>
              Exportar datos
            </button>

            <label className="btn-premium file-btn">
              Importar datos
              <input type="file" onChange={importData} accept=".json" />
            </label>
          </div>
        </header>

        <main>
          <Dashboard tasks={tasks} />
          <TaskForm onAddTask={addTask} />



          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: 20 }}>
            <button
              className={`btn-premium ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              📋 Vista Lista
            </button>

            <button
              className={`btn-premium ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
            >
              🗂️ Vista Kanban
            </button>
          </div>

          {viewMode === "list" ? (
            <>
              <div className="filter-sort-container">
                <PriorityFilter activePriority={activePriorityFilter} onPriorityChange={setActivePriorityFilter} />
                <SortSelector
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
              <TaskList
                tasks={sortedAndFilteredTasks}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
              />
            </>
          ) : (
            <KanbanBoard
              tasks={tasks}
              onMove={moveTaskToStatus}
              onDeleteTask={deleteTask}
            />
          )}
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} - Todos los derechos reservados a Juan Camilo Fong Leon</p>
        </footer>
      </div>
    </>
  )
}
