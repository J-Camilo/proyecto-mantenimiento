"use client"

interface SortSelectorProps {
  sortBy: "recent" | "oldest" | "priority"
  onSortChange: (sortBy: "recent" | "oldest" | "priority") => void
}

export default function SortSelector({ sortBy, onSortChange }: SortSelectorProps) {
  return (
    <div className="sort-selector">
      <label htmlFor="sort">Ordenar por:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as "recent" | "oldest" | "priority")}
        className="sort-select"
      >
        <option value="recent">Más recientes primero</option>
        <option value="oldest">Más antiguas primero</option>
        <option value="priority">Alta prioridad primero</option>
      </select>
    </div>
  )
}
