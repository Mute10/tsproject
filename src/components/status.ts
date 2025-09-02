import type {ProjectStatus, TaskStatus} from "../types";

export const normalizeProjectStatus = (s: string): ProjectStatus => {
const map: Record<string, ProjectStatus> = {
    "not-started": "not-started",
    "todo": "not-started",
    "in-progress":"in-progress",
    "active": "in-progress",
    "blocked":"in-progress",
    "comepleted": "completed",
    "complete": "completed",
}
const key = s?.toLowerCase().trim()
return map[key] ?? "not-started"
};

export const normalizeTaskStatus = (s: string): TaskStatus => {
  const map: Record<string, TaskStatus> = {
    "not_started": "not-started",
    "not-started": "not-started",
    "todo": "not-started",
    "in_progress": "in-progress",
    "in-progress": "in-progress",
    "active": "in-progress",
    "blocked": "in-progress",
    "completed": "completed",
    "complete": "completed",
    "done": "completed",
    "finished": "completed",
  };
  const key = s?.toLowerCase().trim();
  return map[key] ?? "not-started";
};