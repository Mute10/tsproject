import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ProjectCtx } from "../ProjectContext";
import type { Ctx } from "../ProjectContext";
import { PROJECT_STATUS_LABEL } from "../types";
import type { CSSProperties, ReactNode } from "react";
import type { ProjectStatus } from "../types";
import {TaskCard} from "./TaskCard";

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const ctx = useContext(ProjectCtx) as Ctx;
  const project = id ? ctx.getProject(id) : undefined;

  
 const [nameDraft, setNameDraft] = useState("");
 const [descDraft, setDescDraft] = useState("");
 const [editingName, setEditingName] = useState(false);


 useEffect(() => {
if (!project) return;
  setNameDraft(project.name ?? "");
  setDescDraft(project.description ?? "")
 }, [project])


  const updatedAtDisplay = useMemo(() => {
    if (!project) return "";
    const d = new Date(project.updatedAt);
    return isNaN(d.getTime()) ? project.updatedAt : d.toLocaleString();
  }, [project]);

  

  if (!id) return <Navigate to="/projects" replace />;
  if (!project) {
    const ids = ctx.projects.map((p) => p.id).join(", ");
    return (
      <div style={{ padding: 16 }}>
        <h2>Project not found</h2>
        <p>id: <code>{id}</code></p>
        <p>Known project ids: <code>{ids || "(none)"}</code></p>
        <p><Link to="/projects">← Back to Projects</Link></p>
      </div>
    );
  }

 


  function commitName() {
    if (!project) return;
    const next = nameDraft.trim();
    if (next && next !== project.name) {
      ctx.updateProject(project.id, { name: next });
    } else {
      setNameDraft(project.name);
    }
    setEditingName(false);
  }


  const onNameKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") commitName();
    if (e.key === "Escape") {
      setNameDraft(project.name);
      setEditingName(false);
    }
  };

  const projectId = project.id;
  const tasks = ctx.tasksForProject(projectId);
  const ns = tasks.filter((t) => t.status === "not-started");
  const ip = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "completed");

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!project) return;
    const next = e.target.value as ProjectStatus;
    if (next !== project!.status) {
      ctx.updateProject(project!.id, { status: next });
    }
  }

  function handleAddTask() {
    const title = prompt("New task title?")?.trim();
    if (!title) return;
    ctx.addTask(projectId, title, "not-started");
  }

  const shellStyle: CSSProperties = {
    background: "#0f172a",
    color: "#fff",
    minHeight: "100vh",
    padding: 16,
    fontFamily: "system-ui",
  };


  return (
    <div style={shellStyle}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={onNameKeyDown}
              style={{ font: "inherit", fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}
              placeholder="Project name"
            />
          ) : (
            <>
              {project.name || "Untitled Project"}
              <button onClick={() => setEditingName(true)} style={btn} title="Rename">✏️</button>
            </>
          )}
        </h2>
        <span style={{ fontSize: "0,8rem", opacity: 0.7}}>
          Updated: {updatedAtDisplay}
        </span>

        <select value={project.status} onChange={handleStatusChange}>
          {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => (
            <option key={s} value={s}>
              {PROJECT_STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleAddTask} style={{...btn, fontSize: "22px", fontFamily: "cursive"}}>+ New Task</button>
          <Link to="/projects" style={{ ...btn, fontSize:"22px", fontFamily:"cursive" }}>← Back to Projects</Link>
        </div>
      </header>

<textarea value={descDraft} onChange={(e) => setDescDraft(e.target.value)}
onBlur={() => {
  const next = descDraft.trim();
  const current = (project.description ?? "").trim()
  if (next !== current) {
    ctx.updateProject(project.id, {description: next});
  }
}}
placeholder="Enter description here"
  style={{
    width: "100%",
    maxWidth: "600px",
    minHeight: 120,
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
    border: "2px solid blue",
    background: "transparent",  
    color: "#fff",
    font: "inherit",
    opacity: descDraft ? 1 : 0.6, 
    resize: "vertical",
    overflowY: "auto",
  }}
/>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Column title={`Not started (${ns.length})`}>
          {ns.map((t) => (
            <TaskCard key={t.id} task={t}/>
          ))}
          {ns.length === 0 && <Empty />}
        </Column>

        <Column title={`In progress (${ip.length})`}>
          {ip.map((t) => (
            <TaskCard key={t.id} task={t}/>
          ))}
          {ip.length === 0 && <Empty />}
        </Column>

        <Column title={`Completed (${done.length})`}>
          {done.map((t) => (
            <TaskCard key={t.id} task={t}/>
          ))}
          {done.length === 0 && <Empty />}
        </Column>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary>Debug</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify({ id, project, tasksCount: tasks.length, ids: ctx.projects.map((p) => p.id) }, null, 2)}
        </pre>
      </details>
    </div>
  );
}


function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ background: "#111827", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}



  


function Empty() {
  return <div style={{ opacity: 0.6, fontStyle: "italic" }}>No tasks</div>;
}

// --- styles ---
const btn: CSSProperties = {
  background: "#1f2937",
  color: "#fff",
  border: "1px solid #374151",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

