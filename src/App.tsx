import Dashboard from "./pages/Dashboard.tsx";
import ProjectBoard from "./pages/ProjectBoard.tsx";
import Settings from "./pages/Settings.tsx";
import {Routes, Route, Link} from "react-router-dom"
import { ProjectProvider } from './ProjectContext.tsx';
import { useContext } from "react";
import {ProjectCtx} from "./ProjectContext"
import ProjectsList from "./pages/ProjectsList.tsx";


function NavInline() {
  const ctx = useContext(ProjectCtx);
  const firstId = ctx?.projects[0]?.id;
  return (
    <nav className="navbar">
      
      <Link to="/" className="nav-link">Dashboard</Link>
      <Link to="/projects" className="nav-link">Projects</Link>
      {firstId ? (
      <Link to={`/projects/${firstId}`} className="nav-link">Project Board</Link>
      ) : (
        <button className="nav-link"  style={{
    fontWeight: 500,
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    color: "rgb(96, 182, 248)",
    fontSize: "16px",
    textDecoration: "inherit",
    padding: "6px 50px 6px 12px", 
    background: "transparent",
    border: "none",
    cursor: "pointer",
  }}

        onClick={() => {
    const newId = "p" + Math.random().toString(36).slice(2, 8);
    ctx?.addProject("New Project", `New Project created @${new Date().toLocaleDateString()}`,
  newId
);
    setTimeout(() => {
      window.location.href = `/projects/${newId}`;
    }, 50);
  }}
>
  + Create Project Board
</button> 
      )}

      <Link to="/settings" className="nav-link">Settings</Link>
    </nav>
  );
}


export default function App() {
  return (
    <ProjectProvider>
    
    <div className="w-full">
<NavInline />
 


   {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectBoard />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </div>
    </ProjectProvider>
  );
}

