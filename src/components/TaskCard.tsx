import type {Task} from "../types";

export type TaskCardProps = {
    task: Task;
}

export function TaskCard({task}: TaskCardProps) {
    return (
        <div className="task-card">
            <h3>{task.title}</h3>
            <p>Status: task.status</p>
        </div>
    )
}