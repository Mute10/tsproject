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

    export function getProjectById(id: string): Project | undefined {
        return getProjects().find(p => p.id === id);
    }

    export function updateProject(updated: Project) {
        const list = getProjects().map(p => (p.id === updated.id ? updated : p))
        setProjects(list);
    }

    export function upsertTask(updated: Task) {
        const all = getTasks();
        const idx = all.findIndex(t => t.id ===updated.id);
        if (idx >= 0) all[idx] = updated;
        else all.unshift(updated)
        setTasks(all);
    }

    export function getTasksForProject(projectId: string): Task[] {
        return getTasks().filter(t => t.projectId === projectId);
    }

    export function normalizeAll() {
        setProjects(getProjects().map(p => ({ ...p, status: normalizeProjectStatus(p.status as string)})));
        setTasks(getTasks().map(t => ({ ...t, status: normalizeTaskStatus(t.status as string)})));
    }

    export function deleteTask(taskId: string) {
        const all = getTasks()
        const next = all.filter(t => t.id !== taskId);
        setTasks(next);
    }

    