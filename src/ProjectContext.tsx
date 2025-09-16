/* eslint-disable react-refresh/only-export-components */

import{createContext, useMemo, useState, useEffect, useCallback} from "react"
import type {ReactNode} from "react"
import type {Project, Task, TaskStatus} from "./types"
import {initialProjects, initialTasks} from "./mockData"

const LS_Projects = "project_manager_v2"
const LS_Tasks = "project_manager_tasks_v2"
const uuid = () => "t" + Math.random().toString(36).slice(2, 8);
const nowISO = () => new Date().toISOString()


export type Ctx = {
    projects: Project[];
    tasks: Task[];
    addProject: (name: string, description: string, id?: string) => void;
    addTask: (projectId: string, title: string, status?: TaskStatus) => void;
    moveTask: (taskId: string, status: TaskStatus) => void;
    deleteTask: (taskId: string) => void;
    getProject: (id: string) => Project | undefined;
    tasksForProject: (id: string) => Task[];
    exportJSON: () => string;
    importJSON: (json: string) => void;
    updateProject: (
    projectId: string,
    patch: Partial<Pick<Project, "name" | "status" | "description">>
) => void;
touchProject: (projectId: string, ts?: string) => void;
deleteProject: (projectId: string) => void;
updateTaskTitle: (taskId: string, newTitle: string) => void;
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

    const addProject = useCallback (
        (name: string, description: string, id?: string) => {
            const projectId = id ?? "p" + Math.random().toString(36).slice(2, 8);
            const ts = nowISO();
            setProjects((prev) => [
                ...prev,
                {
                id: projectId, name, description,
                status: "not-started",
                createdAt: ts,
                updatedAt: ts,
            } satisfies Project,
            ])
        }, []
    )


    const touchProject = useCallback((projectId: string, ts: string = nowISO()) => {
  setProjects(prev =>
    prev.map(p => (p.id === projectId ? { ...p, updatedAt: ts } : p))
  );
  }, []);

const updateProject = useCallback(
    (projectId: string, patch: Partial<Pick<Project, "name" | "status" | "description">>) => {
    const ts = nowISO();
    setProjects(prev => prev.map(p => (p.id === projectId ? {
        ...p, ...patch, apdatedAt: ts} : p)));
    },
    []
    );
 
    const addTask = useCallback((projectId: string, title: string, status: TaskStatus = "not-started") => {
        
        const ts = nowISO()
        const task: Task = {
            id: uuid(), projectId,
            title, status,
            createdAt: ts,
            updatedAt: ts,
        };
        setTasks(prev => [...prev, task]);
        touchProject(projectId, ts)
    }, 
    [touchProject]
    );
      

    const moveTask = useCallback((taskId: string, status: TaskStatus) => {
        let projId: string | undefined;
         const ts = nowISO();
         let changed = false

        setTasks(prev =>  {
        const next = prev.map(t => {
                if (t.id !== taskId) return t;
                projId = t.projectId;
                if (t.status === status) return t;
                changed = true;
                return { ...t, status, updatedAt: ts};
            });
            return changed ? next : prev
        })
        if (projId && changed) {
            touchProject(projId, ts);
        }
    }, [touchProject]);

    const deleteTask = useCallback((taskId: string) => {
        const ts = nowISO()
        let projId: string | undefined;
        let removed = false;

        setTasks(prev => {
           const target = prev.find(t => t.id === taskId);
           projId = target?.projectId;
           if (!target) return prev;
           removed = true;
           return prev.filter(t => t.id !== taskId);
    });

    if (projId && removed) touchProject(projId, ts);
},
[touchProject]
    );

    const deleteProject = useCallback((projectId: string)=> {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setTasks(prev => prev.filter( t => t.projectId !== projectId))
    }, []);

    
    const getProject = useCallback (
        (id: string) => projects.find(p => p.id === id),
        [projects]
    );

    const tasksForProject = useCallback (
        (id: string) => tasks.filter(t => t.projectId === id),
        [tasks]
    );

const updateTaskTitle = useCallback((taskId: string, newTitle: string) => {
    const ts = nowISO()
    let projId: string | undefined;
    setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        projId = t.projectId;
        return {...t, title: newTitle, updatedAt: ts};
    }));

    if (projId) {
        touchProject(projId, ts)
    }
}, [touchProject]);


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
            throw new Error("Invalid data format")
        }
    }, []
    )

 const value = useMemo(
    () => ({
        projects,
        tasks,
        addProject,
        addTask,
        moveTask,
        deleteTask,
        getProject, 
        tasksForProject,
        exportJSON,
        importJSON,
        updateProject,
        touchProject,
        deleteProject,
        updateTaskTitle
        
    }),
    [projects, tasks, addProject, addTask, moveTask, deleteTask, getProject, tasksForProject, exportJSON, importJSON, 
        updateProject, touchProject, deleteProject, updateTaskTitle
    ]
  );
  

      return <ProjectCtx.Provider value={value}>{children}</ProjectCtx.Provider>;
}