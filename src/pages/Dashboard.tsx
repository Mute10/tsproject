import {Link} from "react-router-dom"

type Project = {
    id:
    number;
    name: string;
    description: string;
};

const projects: Project[] = [
    {id: 1, name: "Website Redesign", description: "Update the company website with new branding"},
    {id: 2, name: "Mobile App", description: "Develope a cross platform for task handling."},
    {id: 3, name: "API integration", description: "Build APIs to connect external services"},
];


export default function Dashboard() {
    return (
        <div className="dashboard">
            <h1>DashBoard</h1>
            <p>Here are your projects:</p>
            <div className="project-list">
                {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <h2>{project.name}</h2>
                            <p>{project.description}</p>
                            <Link to={'/projects/${projext.id}'} className="btn">
                            View Board
                            </Link>
                            </div>
                ))}
            </div>
        </div>
    );
}