export type TaskStatus = "not-started" | "in-progress" | "completed";

export type Task = {
    id: string;
    projectId: string;
    title: string;
    status: TaskStatus;

}

export type Project = {
    id: string;
    name: string;
    description: string;
}

