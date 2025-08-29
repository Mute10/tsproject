import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProjectCtx } from "../ProjectContext";

export default function Dashboard() {
  const ctx = useContext(ProjectCtx);
  if (!ctx) return null; // safety check if provider is missing
  const { projects } = ctx;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Here are your projects:</p>

      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <Link to={`/projects/${project.id}`} className="btn">
              View Board
            </Link>
          </div>
        ))}
      </div>
      <footer>
        <button className="btn" onClick={() => {
          localStorage.remoteItem("project_manager_v2");
          localStorage.removeItem("project_manager_tasks_v2");
          location.reload()
        }}>
          Reset Demo Data
        </button>
      </footer>
    </div>
  );
}