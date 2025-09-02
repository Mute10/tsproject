import {useEffect, useMemo, useState} from "react";
import type { Project, ProjectStatus } from "../types";
import { ensureSeed, getProjects, setProjects } from "../data/storage";
import ProjectCard from "./ProjectCard";
import "./projects.css"

type SortKey = "updatedAt" | "createdAt" | "name" | "status";

const uuid = () => (globalThis.crypto?.randomUUID?. () ?? Math.random().toString(36).slice(2));
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function comProjectsList() {
    const [query, setQuery] = useState("");
        const [sortBy, setSortBy] = useState<SortKey>("updatedAt");
    const [asc, setAsc] = useState(false);
    const [items, setItems] = useState<Project[]>([]);

    useEffect(() => {
        ensureSeed()
        setItems(getProjects())
    }, []);

    useEffect(() => {
        setProjects(items);

    }, [items]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        let out = items.filter(p => !q || 
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.tags?.some(t => t.toLowerCase().includes(q))
        )
        out.sort((a, b) => {
            const dir = asc ? 1 : -1;
            if (sortBy === "name" || sortBy === "status") {
                const av = (a[sortBy] ?? "") as string;
                const bv = (b[sortBy] ?? "") as string;
                return av.localeCompare(bv) * dir;
            }
            const at = a[sortBy] ? new Date(a[sortBy] as string).getTime() : 0;
            const bt = b[sortBy] ? new Date(b[sortBy] as string).getTime() : 0;
            return (at - bt) * dir;
        });
        return out;
    }, [items, query, sortBy, asc]);

    function handleAdd() {
const name = prompt("Project name?")
if (!name) return;
const now = new Date().toISOString();
const id = slugify(name) || uuid();
const newProject: Project = {
    id, name, description: "", status: "not-started", owner: "Mike", createdAt: now,
    updatedAt: now, tags: []
};
setItems(prev => [newProject, ...prev]);
    }

    return (
        <div className="page">
            <header className="page-head">
                <h2>Projects</h2>
                <div className="actions">
                    <input className="input" placeholder="Search name, tag, description..." value="{query" onChange={e => setQuery(e.target.value)}/>
                    <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
    <option value="updatedAt">Sort: Recently updated</option>
    <option value="createdAt">Sort: Recently created</option>
    <option value="name">Sort: Name</option>
    <option value="status">Sort: Status</option>


                    </select>
                    <button className="btn" onClick={() => setAsc(a => !a)} title="Toggle ascending/descending">
                        {asc ? "Asc ↑" : "Desc ↓"}
                    </button>
        <button className="btn primary" onClick={handleAdd}>+ New project</button>

                </div>
            </header>
        {filtered.length === 0 ? (
            <p className="empty">No projects found. Create one with "+ New Project".</p>
        ) : (
            <div className="grid">
                {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
        )}

        </div>
    );
}