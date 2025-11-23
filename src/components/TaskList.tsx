"use client"

import type React from "react"
import { useState } from "react"
import type { Task } from "../types"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: number) => void
  onDeleteTask: (id: number) => void
  onUpdateTask: (id: number, title: string, description: string, priority: "low" | "medium" | "high") => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleCompletion, onDeleteTask, onUpdateTask }) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6366f1"
    }
  }

  const openEditModal = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditPriority(task.priority)
  }

  const closeEditModal = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
    setEditPriority("medium")
  }

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onUpdateTask(editingId, editTitle, editDescription, editPriority)
      closeEditModal()
    }
  }

  return (
    <>
      <section className="task-list">
        <h2>Mis Tareas</h2>
        {tasks.length === 0 ? (
          <p>✨ No hay tareas pendientes. ¡Excelente trabajo!</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? "completed" : ""}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </div>
                </div>

                <p>{task.description}</p>

                <div className="task-meta">
               <small>📅 Creada: {new Date(task.createdAt).toLocaleDateString("es-ES")}</small>
                  <div className="task-actions">
                    <button onClick={() => openEditModal(task)} className="btn btn-small btn-edit">
                      ✏ Editar
                    </button>
                    <button onClick={() => onToggleCompletion(task.id)} className="btn btn-small">
                      {task.completed ? "↩ Pendiente" : "✓ Completada"}
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} className="btn btn-small btn-danger">
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingId !== null && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Tarea</h2>
              <button className="modal-close" onClick={closeEditModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="edit-title">Título de la tarea:</label>
                <input
                  type="text"
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Ej: Implementar historias de usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Descripción:</label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Ej: Crear y subir a GitHub las 5 historias de usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-priority">Nivel de Prioridad:</label>
                <select
                  id="edit-priority"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as "low" | "medium" | "high")}
                >
                  <option value="low">🟢 Baja</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🔴 Alta</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeEditModal}>
                Cancelar
              </button>
              <button className="btn" onClick={handleSaveEdit}>
                💾 Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskList
