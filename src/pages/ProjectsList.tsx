import type {Project} from "../types"
import {useContext, useMemo} from "react";
import {Link} from "react-router-dom"
import {ProjectCtx} from "../ProjectContext"

export default function ProjectsList() {
    const ctx = useContext(ProjectCtx);
    
    const projects = useMemo<Project[]>(
        () => (ctx?.projects ?? []) as Project[],
        [ctx?.projects]
    );

    const summary = useMemo(() => {
        const s = { total: projects.length, completed: 0, inProgress: 0, notStarted: 0};
        for (const p of projects) {
            if (p.status === "completed") s.completed++;
            else if (p.status === "in-progress") s.inProgress++;
            else s.notStarted++;
        }
        return s;
    }, [projects]);

    if (projects.length === 0) {
      return (
        <section className="page">
            <h1>All Projects</h1>
            <p> No Projects yet.</p>
            
        </section>
    )
    }


    return (
    <section className="page">
        <h1>All projects</h1>
        {projects.length === 0 ? (
            <p>No projects yet</p>
        ) : (
            <>
            <button className="btn3" onClick={() =>
                ctx?.addProject(
                    "New Project " + Math.floor(Math.random() * 1000),
                    "Auto-created project"
                )
            }>
                New Project
            </button>
              <p className="muted">
            {summary.total} total · {summary.inProgress} in progress · {summary.notStarted} not started · {summary.completed} done
        </p>

        <ul className="card-list">
            {projects.map((p: Project) => (
                <li key={p.id} className={`card status-${p.status ?? "unknown"}`}>
                    <div className="card-title">{p.name ?? p.id}</div>
                    {p.status && <div className="card-meta">Status: {p.status}</div>}
                    {p.owner && <div className="card-meta">Owner: {p.owner}</div>}
                    {p.description && <p className="card-desc">{p.description}</p>}
                    <Link className="btn2" to={`/projects/${p.id}`}>Open Board</Link>
                </li>
            ))}
        </ul>
       </>
        )}  
</section>
)
}