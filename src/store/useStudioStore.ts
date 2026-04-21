import { useEffect, useState, useCallback } from "react";
import { initialProjects, initialContent, type Project, type SiteContent } from "@/data/projects";
import { initialNews, type NewsPost } from "@/data/news";

const PROJECTS_KEY = "studio.projects";
const CONTENT_KEY = "studio.content";
const AUTH_KEY = "studio.auth";
const NEWS_KEY = "studio.news";

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  emit();
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => load(PROJECTS_KEY, initialProjects));
  useEffect(() => {
    const l = () => setProjects(load(PROJECTS_KEY, initialProjects));
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const upsert = useCallback((p: Project) => {
    const list = load<Project[]>(PROJECTS_KEY, initialProjects);
    const idx = list.findIndex((x) => x.id === p.id);
    if (idx >= 0) list[idx] = p; else list.unshift(p);
    save(PROJECTS_KEY, list);
  }, []);

  const remove = useCallback((id: string) => {
    const list = load<Project[]>(PROJECTS_KEY, initialProjects).filter((p) => p.id !== id);
    save(PROJECTS_KEY, list);
  }, []);

  return { projects, upsert, remove };
}

export function useContent() {
  const merged = (raw: SiteContent): SiteContent => ({ ...initialContent, ...raw });
  const [content, setContent] = useState<SiteContent>(() => merged(load(CONTENT_KEY, initialContent)));
  useEffect(() => {
    const l = () => setContent(merged(load(CONTENT_KEY, initialContent)));
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const update = useCallback((patch: Partial<SiteContent>) => {
    const next = { ...merged(load(CONTENT_KEY, initialContent)), ...patch };
    save(CONTENT_KEY, next);
  }, []);

  return { content, update };
}

export function useAuth() {
  const [authed, setAuthed] = useState<boolean>(() => load(AUTH_KEY, false));
  useEffect(() => {
    const l = () => setAuthed(load(AUTH_KEY, false));
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const login = (email: string, password: string) => {
    if (email.trim() && password.trim().length >= 4) {
      save(AUTH_KEY, true);
      return true;
    }
    return false;
  };
  const logout = () => save(AUTH_KEY, false);

  return { authed, login, logout };
}
