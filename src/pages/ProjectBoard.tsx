import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ProjectCtx } from "../ProjectContext";
import type { Ctx } from "../ProjectContext";
import { PROJECT_STATUS_LABEL } from "../types";
import type { CSSProperties, ReactNode } from "react";
import type { ProjectStatus, TaskStatus } from "../types";

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const ctx = useContext(ProjectCtx) as Ctx;
  const project = id ? ctx.getProject(id) : undefined;

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

  // ✅ Hooks
 const [nameDraft, setNameDraft] = useState("");
 const [descDraft, setDescDraft] = useState("");
 const [editingName, setEditingName] = useState(false);

 useEffect(() => {
  if (!project) return;
  setNameDraft(project.name ?? "");
  setDescDraft(project.description ?? "")
 }, [project])

  

  const updatedAtDisplay = useMemo(() => {
    const d = new Date(project.updatedAt);
    return isNaN(d.getTime()) ? project.updatedAt : d.toLocaleString();
  }, [project.updatedAt]);

  // ✅ Helpers
  function commitName() {
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

  // ✅ Main render
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
          <button onClick={handleAddTask} style={btn}>+ New Task</button>
          <Link to="/projects" style={{ ...btn, textDecoration: "none" }}>← Back to Projects</Link>
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
placeholder="Add a project description." style={{ width: 100, minHeight: 80,
  marginBottom: 16,
  padding: 8,
  borderRadius: 5,
  border: "1px solid #0b1220",
  background: "#0b1220",
  color: "#ffff",
  font: "inherit",

}}/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Column title={`Not started (${ns.length})`}>
          {ns.map((t) => (
            <TaskRow
              key={t.id}
              title={t.title}
              status={t.status}
              onToggle={() => ctx.moveTask(t.id, t.status === "not-started" ? "in-progress" : "completed")}
              onDelete={() => ctx.deleteTask(t.id)}
            />
          ))}
          {ns.length === 0 && <Empty />}
        </Column>

        <Column title={`In progress (${ip.length})`}>
          {ip.map((t) => (
            <TaskRow
              key={t.id}
              title={t.title}
              status={t.status}
              onToggle={() => ctx.moveTask(t.id, t.status === "in-progress" ? "completed" : "not-started")}
              onDelete={() => ctx.deleteTask(t.id)}
            />
          ))}
          {ip.length === 0 && <Empty />}
        </Column>

        <Column title={`Completed (${done.length})`}>
          {done.map((t) => (
            <TaskRow
              key={t.id}
              title={t.title}
              status={t.status}
              onToggle={() => ctx.moveTask(t.id, "not-started")}
              onDelete={() => ctx.deleteTask(t.id)}
            />
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

// --- UI helpers ---
function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ background: "#111827", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}

function TaskRow({ title, status, onToggle, onDelete }: {
  title: string;
  status: TaskStatus;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr auto auto",
      alignItems: "center",
      gap: 8,
      padding: "8px 10px",
      marginBottom: 8,
      borderRadius: 10,
      background: "#0b1220",
      border: "1px solid #1f2937",
    }}>
      <button onClick={onToggle} style={pill}>{status.replace("-", " ")}</button>
      <span>{title}</span>
      <button onClick={onDelete} style={icon} title="Delete">🗑️</button>
    </div>
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

const pill: CSSProperties = {
  background: "#374151",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  borderRadius: 999,
  cursor: "pointer",
};

const icon: CSSProperties = {
  background: "transparent",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
