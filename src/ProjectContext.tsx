/* eslint-disable react-refresh/only-export-components */

import{createContext, useMemo, useState, useEffect, useCallback} from "react"
import type {ReactNode} from "react"
import type {Project, Task, TaskStatus} from "./types"
import {initialProjects, initialTasks} from "./mockData"

const LS_Projects = "project_manager_v2"
const LS_Tasks = "project_manager_tasks_v2"

export type Ctx = {
    projects: Project[];
    tasks: Task[];
    addProject: (name: string, description: string) => void;
    addTask: (projectId: string, title: string, status?: TaskStatus) => void;
    moveTask: (taskId: string, status: TaskStatus) => void;
    exportJSON: () => string;
    importJSON: (json: string) => void;
};


export const ProjectCtx = createContext<Ctx | null>(null);


// function helper for loading form localStorage or falling back to defaults
function load<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

 export function ProjectProvider({children}: {children: ReactNode}) {
    const [projects, setProjects] = useState<Project[]>(
        () => load<Project[]>(LS_Projects, initialProjects)
    );
    const [tasks, setTasks] = useState<Task[]>(
        () => load<Task[]>(LS_Tasks, initialTasks)
    );


    // saves to localStorage per change
    useEffect(() => localStorage.setItem(LS_Projects, JSON.stringify(projects)), [projects]);
    useEffect(() => localStorage.setItem(LS_Tasks, JSON.stringify(tasks)), [tasks]);

    const addProject = useCallback((name: string, description: string) => {
        const id = "p" + Math.random().toString(36). slice(2, 8);
        setProjects((prev) => [...prev, {id, name, description}]);
    }, [setProjects]);

    const addTask = useCallback((projectId: string, title: string, status: TaskStatus = "not-started") => {
        const id= "t" + Math.random().toString(36).slice(2, 8)
        setTasks((prev) => [...prev, {id, projectId, title, status}]);
    }, [setTasks]);

    const moveTask = useCallback((taskId: string, status: TaskStatus) => {
        setTasks((prev) => prev.map((x) => (x.id === taskId ? {...x, status} : x)));
    }, [setTasks]);

    // backup/restore
    const exportJSON = useCallback(() => {
         return JSON.stringify({projects, tasks}, null, 2);
    }, [projects, tasks]);
       
    const importJSON = useCallback((json: string) => {
        const parsed = JSON.parse(json) as {projects: Project[], tasks: Task[]};
        if (Array.isArray(parsed.projects) && Array.isArray(parsed.tasks)) {
            setProjects(parsed.projects);
            setTasks(parsed.tasks);
        } else {
            throw new Error("Invalid dats format")
        }
    }, [setProjects, setTasks]
    )

 const value = useMemo(
    () => ({
        projects,
        tasks,
        addProject,
        addTask,
        moveTask,
        exportJSON,
        importJSON,
    }),
    [projects, tasks, addProject, addTask, moveTask, exportJSON, importJSON]
  );
  

      return <ProjectCtx.Provider value={value}>{children}</ProjectCtx.Provider>;
}