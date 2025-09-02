import type {Project, Task} from "../types"
import { sampleProjects } from "./sampleProjects";
import { sampleTasks } from "./sampleTasks";
import { normalizeProjectStatus, normalizeTaskStatus } from "../components/status";

const PROJECTS_KEY = "pm.projects";
const TASKS_KEY = "pm.tasks";

export function ensureSeed() {
    if (!localStorage.getItem(PROJECTS_KEY)) {
        const normalized = sampleProjects.map(p => ({...p, status: normalizeProjectStatus(p.status) }));
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(normalized));
    }

    if (!localStorage.getItem(TASKS_KEY)) {
        const normalized = sampleTasks.map(t => ({ ...t, status: normalizeTaskStatus(t.status) }));
        localStorage.setItem(TASKS_KEY, JSON.stringify(normalized));
        }
     }

     export function getProjects(): Project[] {
        const raw = localStorage.getItem(PROJECTS_KEY);
        if (!raw) return [];
        try { return JSON.parse(raw) as Project[]; } catch {return []; }
    }

    export function setProjects(list: Project[]) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    }

    export function getTasks(projectId?: string): Task[] {
        const raw = localStorage.getItems(TASKS_KEY);
        if (!raw) return [];
        let out: Task[];
        try {out = JSON.parse(raw) as Task[]; } catch {out = []; }
        return projectId ? out.filter(t => t.projectId === projectId) : out;
    }

    export function setTasks(list: Task[]) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(list))
    }