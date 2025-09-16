import type { Task } from "../types";
import { useState, useContext } from "react";
import { ProjectCtx } from "../ProjectContext";

export type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const ctx = useContext(ProjectCtx);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);


  const icon: React.CSSProperties = {
  background: "transparent",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};


  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) {
      ctx?.updateTaskTitle(task.id, trimmed);
    }
    setIsEditing(false);
  }

  return (
    <div className="task-card">
      {isEditing ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus
        />
      ) : (
        <h3 onDoubleClick={() => setIsEditing(true)}>{task.title}</h3>
      )}

      <p>Status: {task.status}</p>

      <button style={icon} onClick={() => setIsEditing(true)}>✏️</button>
      <button style={icon} onClick={() => ctx?.deleteTask(task.id)}>🗑️</button>
    </div>
  );
}