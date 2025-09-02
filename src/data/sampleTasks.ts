import type {Task} from "../types";

export const sampleTasks: Task[] = [
    {
        id: "t-1",
        projectId: "alpha-1",
        title: "Scaffold routes (/ , /projects, /projects/:id, /settings)",
        status: "completed",
        createdAt: "2025-08-20T14:12:00.000Z",
        updatedAt: "2025-08-20T16:00:00.000Z",
        assignee: "Mike"
    },
    {
        id: "T-2",
        projectId: "alpha-1",
        title: "ProjectsList search + sort",
        status: "in-progress",
        createdAt: "2025-08-31T17:00:00.000Z",
        updatedAt: "2025-08-31T18:40:00.000Z",
        assignee: "Mike"
    },
    {
        id: "t-3",
        projectId: "beta-ux",
        title: "Hover/focus styles for links & buttons",
        status: "not-started",
        createdAt: "2025-08-29T11:00:00.000Z",
        updatedAt: "2025-08-29T11:00:00.000Z"
    },
    {
        id: "t-4",
        projectId: "integrations",
    title: "CSV import: map colums -> fields",
    status: "not-started",
    createdAt: "2025-08-30T12:00:00.000Z",
    updatedAt: "2025-08-30T12:00:00.000Z"
    }
]