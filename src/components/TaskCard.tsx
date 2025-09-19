import type { Task, TaskStatus } from "../types";
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
  color: "#00FFFF",
  border: "none",
  cursor: "pointer",
  fontSize: "1.4rem"
};





  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) {
      ctx?.updateTaskTitle(task.id, trimmed);
    }
    setIsEditing(false);
  }

  function cycleStatus() {
    const order: TaskStatus[] = ["not-started", "in-progress", "completed"]
    const current = order.indexOf(task.status);
    const next = order[(current + 1) % order.length]
    ctx!.moveTask(task.id, next)
}



  return (
    <div className="task-card" style={{display:"flex", flexDirection: "column",
      gap: 8}}>

      {isEditing ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus style={{width: "80%", fontSize: "1rem", fontWeight: "bold",
            border: "1px solid #457dd8ff", borderRadius: 5, padding: "4px 6px",
            background: "#030304ff", color: "#ffff"
           }}
        />
      ) : (
        <h3 onClick={() => setIsEditing(true)}>{task.title}</h3>
      )}


      
<div style={{ display: "flex", alignItems: "center", gap: 50,
  justifyContent: "center", 
 }}>
  <button style={icon} onClick={() => setIsEditing(true)}>Edit</button>
  <button style={icon} onClick={() => ctx!.deleteTask(task.id)}>Delete</button>
   <button className="next-btn" style={{...icon}} onClick={cycleStatus}>Next</button>
</div>
</div>
);
}