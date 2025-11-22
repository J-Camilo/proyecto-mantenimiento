"use client"

import type React from "react"
import { useState } from "react"

interface TaskFormProps {
  onAddTask: (title: string, description: string, priority: "low" | "medium" | "high") => void
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("El título es requerido para crear una tarea")
      return
    }

    onAddTask(title, description, priority)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setError("")
  }

  return (
    <section className="task-form">
      <h2>Agregar Nueva Tarea</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título de la tarea:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Implementar historias de usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Crear y subir a GitHub las 5 historias de usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Nivel de Prioridad:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          >
            <option value="low">🟢 Baja</option>
            <option value="medium">🟡 Media</option>
            <option value="high">🔴 Alta</option>
          </select>
        </div>

        <button type="submit" className="btn">
          ➕ Agregar Tarea
        </button>
      </form>
    </section>
  )
}

export default TaskForm
