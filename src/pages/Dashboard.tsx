import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProjectCtx } from "../ProjectContext";

export default function Dashboard() {
  const ctx = useContext(ProjectCtx);
  if (!ctx) return null; // safety check if provider is missing
  const { projects } = ctx;

  return (
    <>
    <div className="instructions">
<h3>
  To get started, click the **"Create Project"** button.  
You’ll be taken to the Project Board, where you can add, remove, and organize tasks into categories.

<p>- **Projects Page:** shows all the projects you’ve created in a simple list.  </p>
<p>- **Project Board:** gives you a visual board to track and move tasks with the **"Next"** button. </p> 
<p>- **Tracking:** the Projects page also keeps count of how many projects you’re managing.  </p>
<p>- **Extras:** use the Settings page for additional features, and Debug mode to test or reset data.</p>
  
</h3>
    </div>
    
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
          localStorage.removeItem("project_manager_v2");
          localStorage.removeItem("project_manager_tasks_v2");
          location.reload()
        }}>
          Reset Data
        </button>
      </footer>
    </div>
    </>
  );
}