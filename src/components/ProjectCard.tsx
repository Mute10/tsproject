import {Link} from "react-router-dom"
import type {Project} from "../types"
import "./projects.css";

function badgeClass(status: Project["status"]) {
    switch (status) {
        case "not-started": return "badge gray";
        case "in-progress": return "badge blue";
        case "completed": return "badge green";
        default: return "badge gray";
    }
}

export default function ProjectCard({ project} : { project: Project}) {
    return (
        <Link to={`/projects/${project.id}`} className="card">
            <div className="card-row">
                <h3 className="card-title">{project.name}</h3>
                <span className={badgeClass(project.status)}>{project.status.replace("-", " ")}</span>
            </div>
            {project.description && <p className="card-desc">project.description</p>}

            <div className="card-meta">
                <span>Owner: {project.owner ?? "-"}</span>
                <span>Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "-"}</span>

            </div>
            {project.tags?.length ? (
                <div className="tags">
                    {project.tags.map(t => <span key={t} className="tag">#{t}</span>)}

                </div>
            ) : null}
        </Link>
    );
}
