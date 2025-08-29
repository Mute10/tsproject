import {useContext} from "react"
import {useParams} from "react-router-dom"
import {ProjectCtx} from "../ProjectContext";
import {TaskCard} from "../components/TaskCard";

export default function ProjectBoard() {
    const {id} = useParams();
    const ctx = useContext(ProjectCtx)
    if (!ctx) return null;
    if (!id) return <h1>Project not found</h1>

    const {projects, tasks} = ctx;
    const project = projects.find((p) => String(p.id) === id);
    if (!project) return <h1>Project not found.</h1>

    const projectTasks = tasks.filter((t) => String(t.projectId) === id );

    return (
        <div className="board">
            <h1>{project.name} Board</h1>

            <div className='column'>
                <h2>Not started</h2>
                {projectTasks.filter((t) => t.status === "not-started")
                .map((t) => (
                    <TaskCard key={t.id} task={t}/>

                ))}
                </div>
              

            <div className='column'>
                <h2>In Progress</h2>
                {projectTasks.filter((t) => t.status === "in-progress")
                .map((t) => (
                    <TaskCard key={t.id} task={t}/>

                                ))};
                </div>

            <div className='column'>
                <h2>Completed</h2>
                {projectTasks.filter((t) => t.status === "completed")
                .map((t) => (
                    <TaskCard key={t.id} task={t}/>
                ))}
            </div>
        </div>
    );
    }