import type { Task, TaskStatus } from "../types";
import { useState, useContext } from "react";
import { ProjectCtx } from "../ProjectContext";
import {useSettings} from "../pages/SettingsContext"
import {labels} from "../i18n"
import {NavLink} from "react-router-dom"


export type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const {settings} = useSettings()
  const ctx = useContext(ProjectCtx);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const t = labels[settings.language]




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


  const icon: React.CSSProperties = {
  background: "transparent",
  color: "#00FFFF",
  border: "none",
  cursor: "pointer",
  fontSize: "1.4rem"
};

  return (
    
    <div style={{
      padding: settings.compactView ? "4px 5px" : "12px 15px",
      marginBottom: settings.compactView ? "4px" : "12px",
      borderRadius: 8,
      background: "#0b1220",
      border: "1px solid #1f2937",
    }}>

      {task.title}

  
    <div className="task-card" 
     style={{
        display: "flex",
        flexDirection: "column",
        gap: settings.compactView ? 2 : 10,              
        padding: settings.compactView ? "4px 6px" : "12px 15px", 
        marginBottom: settings.compactView ? "4px" : "12px",     
        fontSize: settings.compactView ? "0.85rem" : "1rem",     
        borderRadius: settings.compactView ? 3 : 8,
        background: "#0b1220",
        border: "1px solid #1f2937",
      }}>

      {isEditing ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus style={{width: "80%", fontSize: settings.compactView ? "0.85rem" : "1rem", fontWeight: "bold",
            border: "1px solid #457dd8ff", borderRadius: 5, padding: settings.compactView ? "2px 4px" :"4px 5px",
            background: "#030304ff", color: "#ffff"
           }}
        />
      ) : (
        <h3 onClick={() => setIsEditing(true)} 
        style={{ fontSize: settings.compactView ? "0.9rem" : "1.1rem"}}>{task.title}</h3>
      )}

<nav>
      <NavLink to="/dashboard">{t.dashboard}</NavLink>
      <NavLink to="/projects">{t.projects}</NavLink>
      <NavLink to="/settings">{t.settings}</NavLink>
    </nav>

      
<div style={{ display: "flex", alignItems: "center", gap: settings.compactView ? 10 : 50,
  justifyContent: "center", 
 }}>
  <button style={icon} onClick={() => setIsEditing(true)}>Edit</button>
  <button style={icon} onClick={() => ctx!.deleteTask(task.id)}>Delete</button>
   <button className="next-btn" style={{...icon}} onClick={cycleStatus}>Next</button>
</div>
</div>
</div>
);
}