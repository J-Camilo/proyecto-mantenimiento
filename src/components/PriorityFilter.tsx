"use client"

import type React from "react"

interface PriorityFilterProps {
  activePriority: "all" | "high" | "medium" | "low"
  onPriorityChange: (priority: "all" | "high" | "medium" | "low") => void
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({ activePriority, onPriorityChange }) => {
  const filterOptions = [
    { value: "all", label: "📋 Todas", icon: "📋" },
    { value: "high", label: "🔴 Alta", icon: "🔴" },
    { value: "medium", label: "🟡 Media", icon: "🟡" },
    { value: "low", label: "🟢 Baja", icon: "🟢" },
  ]

  return (
    <section className="priority-filter">
      <h3>Filtrar por Prioridad</h3>
      <div className="filter-buttons">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onPriorityChange(option.value as "all" | "high" | "medium" | "low")}
            className={`filter-btn ${activePriority === option.value ? "active" : ""}`}
            title={`Ver tareas de prioridad ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default PriorityFilter
