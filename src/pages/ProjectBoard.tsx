// src/pages/ProjectBoard.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProjectCtx } from "../ProjectContext";
import type { Ctx } from "../ProjectContext";
import { PROJECT_STATUS_ORDER, PROJECT_STATUS_LABEL } from "../types";
import type { CSSProperties } from "react";
import type { ProjectStatus } from "../types";

// --- helpers ---
function requireCtx(c: Ctx | null): asserts c is Ctx {
  if (!c) throw new Error("Project context is missing");
}

const cycle = (s: TaskStatus): TaskStatus =>
  s === "not-started" ? "in-progress" : s === "in-progress" ? "completed" : "not-started";

// --- component ---
export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const ctxMaybe = useContext(ProjectCtx);

  if (!id) return <Navigate to="/projects" replace />;

  requireCtx(ctxMaybe);
  const ctx = ctxMaybe; // now typed as Ctx

  const project = ctx.getProject(id);
  if (!project) {
    const ids = ctx.projects.map((p) => p.id).join(", ");
    return (
      <div style={{ padding: 16 }}>
        <h2>Project not found</h2>
        <p>
          id: <code>{id}</code>
        </p>
        <p>
          Known project ids: <code>{ids || "(none)"}</code>
        </p>
        <p>
          <Link to="/projects">← Back to Projects</Link>
        </p>
      </div>
    );
  }

  const projectId = project.id;
  const tasks = ctx.tasksForProject(projectId);
  const ns = tasks.filter((t) => t.status === "not-started");
  const ip = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "completed");

  // loud shell so we know the board renders
  const shellStyle: CSSProperties = {
    background: "#0f172a",
    color: "#fff",
    minHeight: "100vh",
    padding: 16,
    fontFamily: "system-ui",
  };

  function handleAddTask() {
    const title = prompt("New task title?")?.trim();
    if (!title) return;
    ctx.addTask(projectId, title, "not-started");
  }

  return (
    <div style={shellStyle}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{project.name || "Untitled Project"}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleAddTask} style={btn}>
            + New Task
          </button>
          <Link to="/projects" style={{ ...btn, textDecoration: "none" }}>
            ← Back to Projects
          </Link>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Column title={`Not started (${ns.length})`}>
          {ns.map((t) => (
            <TaskRow
              key={t.id}
              title={t.title}
              status={t.status}
              onToggle={() => ctx.moveTask(t.id, cycle(t.status))}
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
              onToggle={() => ctx.moveTask(t.id, cycle(t.status))}
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
              onToggle={() => ctx.moveTask(t.id, cycle(t.status))}
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

// --- small UI helpers ---
function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ background: "#111827", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}

function TaskRow({
  title,
  status,
  onToggle,
  onDelete,
}: {
  title: string;
  status: TaskStatus;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        marginBottom: 8,
        borderRadius: 10,
        background: "#0b1220",
        border: "1px solid #1f2937",
      }}
    >
      <button onClick={onToggle} style={pill}>
        {status.replace("-", " ")}
      </button>
      <span>{title}</span>
      <button onClick={onDelete} style={icon} title="Delete">
        🗑️
      </button>
    </div>
  );
}

function Empty() {
  return <div style={{ opacity: 0.6, fontStyle: "italic" }}>No tasks</div>;
}

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
