import Dashboard from "./pages/Dashboard.tsx";
import ProjectBoard from "./pages/ProjectBoard.tsx";
import Settings from "./pages/Settings.tsx";
import {Routes, Route, Navigate, useLocation, NavLink} from "react-router-dom"
import { ProjectProvider } from './ProjectContext.tsx';
import { useContext } from "react";
import {ProjectCtx} from "./ProjectContext"
import ProjectsList from "./pages/ProjectsList.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { SettingsProvider } from "./pages/SettingsContext.tsx";


function NavInline() {
  const ctx = useContext(ProjectCtx);
  const firstId = ctx?.projects[0]?.id;


  return (
    <nav className="navbar">
      
      <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
      <NavLink to="/projects" end className="nav-link">Projects</NavLink>
      {firstId ? (
      <NavLink to={`/projects/${firstId}`} className="nav-link">Project Board</NavLink>
      ) : (
        <button className="ctrPrj"  style={{
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    fontSize: "17px",
    padding: "6px 50px 6px 12px", 
    background: "transparent",
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

      <NavLink to="/settings" className="nav-link">Settings</NavLink>
    </nav>
  );
}



export default function App() {
  const location = useLocation()

  return (
    <ProjectProvider>
    <SettingsProvider>
    <div className="w-full">
<NavInline />

<AnimatePresence mode="wait">
    <motion.div key={location.pathname}
    initial={{scale: 1}}
    animate={{scale: [1, 1.1, 1]}}
    transition={{duration: 0.4}}>
 
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/dashboard" replace />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectBoard />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
      </motion.div>
      </AnimatePresence>
      
    </div>
    </SettingsProvider>
    </ProjectProvider>
    
  );
}

