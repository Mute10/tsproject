import Dashboard from "./pages/Dashboard.tsx";
import ProjectBoard from "./pages/ProjectBoard.tsx";
import Settings from "./pages/Settings.tsx";
import {Routes, Route, Link} from "react-router-dom"
import { ProjectProvider } from './ProjectContext.tsx';
import { useContext } from "react";
import {ProjectCtx} from "./ProjectContext"


function NavInline() {
  const ctx = useContext(ProjectCtx);
  const firstId = ctx?.projects[0]?.id;
  return (
    <nav className="navbar">
      
      <Link to="/" className="nav-link">Dashboard</Link>
      {firstId ? (
      <Link to={`/projects/${firstId}`} className="nav-link">Project Board</Link>
      ) : (
        <Link to="/" className="nav-link" aria-disabled="true">Project Board</Link>
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
        <Route path="/projects/:id" element={<ProjectBoard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
    </ProjectProvider>
  );
}

