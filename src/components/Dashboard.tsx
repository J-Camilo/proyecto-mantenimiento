"use client"

import { Task } from "../types"

interface DashboardProps {
  tasks: Task[]
}

export default function Dashboard({ tasks }: DashboardProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  const highPriorityCount = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityCount = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityCount = tasks.filter((task) => task.priority === "low").length

  const priorityPercentages = {
    high: totalTasks === 0 ? 0 : Math.round((highPriorityCount / totalTasks) * 100),
    medium: totalTasks === 0 ? 0 : Math.round((mediumPriorityCount / totalTasks) * 100),
    low: totalTasks === 0 ? 0 : Math.round((lowPriorityCount / totalTasks) * 100),
  }

  return (
    <section className="dashboard">
      <h2>Panel de Resumen</h2>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Tareas Totales</h3>
            <p className="stat-value">{totalTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Completadas</h3>
            <p className="stat-value">{completedTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Progreso</h3>
            <p className="stat-value">{completionPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="priority-distribution">
        <h3>Distribución por Prioridad</h3>
        <div className="distribution-grid">
          <div className="distribution-item">
            <div className="distribution-header">
              <span className="priority-label">Alta Prioridad</span>
              <span className="priority-count">{highPriorityCount}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill high" style={{ width: `${priorityPercentages.high}%` }}></div>
            </div>
            <p className="percentage">{priorityPercentages.high}%</p>
          </div>

          <div className="distribution-item">
            <div className="distribution-header">
              <span className="priority-label">Prioridad Media</span>
              <span className="priority-count">{mediumPriorityCount}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill medium" style={{ width: `${priorityPercentages.medium}%` }}></div>
            </div>
            <p className="percentage">{priorityPercentages.medium}%</p>
          </div>

          <div className="distribution-item">
            <div className="distribution-header">
              <span className="priority-label">Baja Prioridad</span>
              <span className="priority-count">{lowPriorityCount}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill low" style={{ width: `${priorityPercentages.low}%` }}></div>
            </div>
            <p className="percentage">{priorityPercentages.low}%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
