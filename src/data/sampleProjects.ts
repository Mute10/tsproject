import type {Project} from "../types";

export const sampleProjects: Project[] = [
    {
        id: "alpha-1",
        name: "Alpha Launch",
        description: "Core PM Saas scaffolding",
        status: "in-progress",
        owner: "Mike",
        createdAt: "2025-08-20T14:10:00.000Z",
        updatedAt: "2025-08-31T18:45:00.000Z",
        tags: ["core", "priority"]
    },
    {
        id: "beta-ux",
        name: "Beta UX Polish",
        description: "Tighten navigatiob and keyboard shortcuts",
        status: "not-started",
        owner: "Mike",
        createdAt: "2025-08-25T09:00.00.000Z",
        updatedAt: "2025-08-29T20:00:00.000Z",
        tags: ["ux"]
    },
    {
        id: "integration-1",
        name: "Integration v1",
        description: "Email + CSV import",
        status: "in-progress",
        owner: "Mike",
        createdAt: "2025-08-26T10:00:00.000Z",
        updatedAt: "2025-08-30T15:00:00:000Z",
        tags: ["api", "import"]
    }
]

