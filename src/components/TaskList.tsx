"use client"

import type React from "react"
import type { Task } from "../types"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: number) => void
  onDeleteTask: (id: number) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleCompletion, onDeleteTask }) => {
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

  return (
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
                <small>📅 Creada: {task.createdAt.toLocaleDateString("es-ES")}</small>
                <div className="task-actions">
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
  )
}

export default TaskList
