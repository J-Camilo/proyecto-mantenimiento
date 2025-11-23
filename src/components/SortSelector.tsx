"use client";

interface SortSelectorProps {
  sortBy: "recent" | "oldest" | "priority";
  onSortChange: (sortBy: "recent" | "oldest" | "priority") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SortSelector({
  sortBy,
  onSortChange,
  searchTerm,
  onSearchChange,
}: SortSelectorProps) {
  return (
    <div className="sort-selector">

      {/* 🔍 Buscador por título */}
      <div className="search-input-container">
        <label htmlFor="search">Buscar por título:</label>
        <input
          id="search"
          type="text"
          placeholder="Buscar tarea..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {/* 🔽 Ordenamiento */}
      <div className="sort-select-container">
        <label htmlFor="sort">Ordenar por:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as "recent" | "oldest" | "priority")
          }
          className="sort-select"
        >
          <option value="recent">Más recientes primero</option>
          <option value="oldest">Más antiguas primero</option>
          <option value="priority">Alta prioridad primero</option>
        </select>
      </div>

    </div>
  );
}
