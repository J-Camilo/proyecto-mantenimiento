"use client";

import React from "react";
import { Task } from "../types";

type Status = Task["status"]; // "todo" | "process" | "done"

interface KanbanProps {
  tasks: Task[];
  onMove: (id: number, newStatus: Status) => void;
  onDeleteTask: (id: number) => void;
}

const STATUS_ORDER: Status[] = ["todo", "process", "done"];

const STATUS_LABELS: Record<Status, string> = {
  todo: "Por hacer",
  process: "En proceso",
  done: "Completado",
};

export default function KanbanBoard({
  tasks,
  onMove,
  onDeleteTask,
}: KanbanProps) {
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragStart = (e: React.DragEvent<HTMLElement>, id: number) => {
    e.dataTransfer.setData("text/plain", String(id));
    try { e.dataTransfer.effectAllowed = "move"; } catch {}
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(id)) onMove(id, newStatus);
  };

  return (
    <div className="kanban-container" role="region" aria-label="Tablero Kanban">
      {STATUS_ORDER.map((status) => {
        const items = tasks.filter((t) => t.status === status);

        return (
          <div
            key={status}
            className="kanban-column"
            onDragOver={allowDrop}
            onDrop={(e) => onDrop(e, status)}
          >
            <div className="kanban-column-header">
              <h3>{STATUS_LABELS[status]}</h3>
              <span className="kanban-count">{items.length}</span>
            </div>

            <div className="kanban-list">
              {items.map((task) => (
                <article
                  key={task.id}
                  className="kanban-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                >
                  <div className="kanban-item-head">
                    <h4 className="kanban-item-title">{task.title}</h4>

                    <span className={`priority-badge small ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="kanban-item-desc">{task.description}</p>

                  <div className="kanban-item-footer">
                    <small>
                      {task.createdAt instanceof Date
                        ? task.createdAt.toLocaleDateString("es-ES")
                        : new Date(task.createdAt).toLocaleDateString("es-ES")}
                    </small>

                    <div className="kanban-actions">
                      <button
                        className="btn-small"
                        onClick={() => onDeleteTask(task.id)}
                        title="Eliminar tarea"
                      >
                        🗑
                      </button>

                      {/* mover */}
                      <button
                        className="btn-small"
                        onClick={() =>
                          onMove(
                            task.id,
                            status === "todo"
                              ? "process"
                              : status === "process"
                              ? "done"
                              : "todo"
                          )
                        }
                        title="Mover a siguiente estado"
                      >
                        ⇄
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
