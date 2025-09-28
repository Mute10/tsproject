import type {Project, Task} from "./types"

export const initialProjects: Project[] = [
    {id: "p1", name: "Website Redesign", description: "New brading + pages", status: "in-progress", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
    {id: 'p2', name: "Mobile App", description: "Cross-platform tracker", status: "not-started", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
]

export const initialTasks: Task[] = [
    {id: "t1", projectId: "p1", title: "Set up repo", status: "not-started", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    {id: "t2", projectId: "p1", title: "Design Kanban layout", status: "in-progress", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    {id: "t3", projectId: "p1", title: "Create task card", status: "completed", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    {id: "t4", projectId: "p2", title: "Scaffold screens", status: "not-started", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
 {id: "t5", projectId: "p2", title: "Implement login", status: "in-progress", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
]

