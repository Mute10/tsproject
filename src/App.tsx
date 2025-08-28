import Dashboard from "./pages/Dashboard.tsx";
import ProjectBoard from "./pages/ProjectBoard.tsx";
import Settings from "./pages/Settings.tsx";
import {Routes, Route, Link} from "react-router-dom"


export default function App() {
  return (
    <div className="w-full">

 {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/projects/123">Project Board</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
      </nav>


   {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects/123" element={<ProjectBoard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

