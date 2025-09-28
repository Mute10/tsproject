import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProjectCtx } from "../ProjectContext";
import {useSettings} from "./SettingsContext";
import {labels} from "../i18n";


export default function Dashboard() {
  const ctx = useContext(ProjectCtx);
 
  const {settings} = useSettings()
   if (!ctx) return null; // safety check if provider is missing
  const { projects } = ctx;


    const t = labels[settings.language]

  
  

  return (
    <>
    <div className={settings.compactView ? "compact" : ""}>
      <h1>{t.dashboard}</h1>
      <h3>{t.projects}</h3>
<h3>
  To get started, click the "Create Project" button.  
You’ll be taken to the Project Board, where you can add, remove, and organize tasks into categories.

<p>- <b>Projects Page:</b> shows all the projects you’ve created in a simple list.  </p>
<p>- <b>Project Board:</b> gives you a visual board to track and move tasks with the **"Next"** button. </p> 
<p>- <b>Tracking:</b>the Projects page also keeps count of how many projects you’re managing.  </p>
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
       
       © 2025 Mute10. This is a production-level project built with TypeScript and React. 

      </footer>
    </div>
    </>
  );
}