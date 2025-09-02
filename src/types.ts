export type TaskStatus = "not-started" | "in-progress" | "completed";
export type ProjectStatus = "not-started" | "in-progress" | "completed";



export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    owner?: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[]
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
    assignee?: string;
    dueDate?: string;
}

// Constants for UIs/validation
export const PROJECT_STATUSES: ProjectStatus[] = [
    "not-started", "in-progress", "completed",
]

export const TASK_STATUSES: TaskStatus[] = [
    "not-started", "in-progress", "completed"
]

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
    "not-started": "Not_started", "in_progress": "In progress", "done": "Done",
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
    "not-started": "Not Started",
    "in-progress": "In progress",
    "completed": "Completed"
}

export const PROJECT_STATUS_ORDER: Record<ProjectStatus, number> = {
    "not-started": 0,
    "in-progress" : 1,
    "completed": 2,
}

export const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
    "not-started": 0,
    "in-progress": 1,
    "completed": 2,
}

// Type Guards
export const isProjectStatus = (v: string): v is ProjectStatus =>
(PROJECT_STATUSES as string[]).includes(v);

export const isTaskStatus = (v: string): v is TaskStatus =>
(TASK_STATUSES as string[]).includes(v)
