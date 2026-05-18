import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { initialProjects, initialContent, type Project, type SiteContent } from "@/data/projects";
import { initialNews, type NewsPost } from "@/data/news";

const SITE_CONTENT_ID = "main";

// -------------------- Projects --------------------

type ProjectRow = {
  id: string;
  title: string;
  category: Project["category"];
  year: number;
  location: string;
  area: string;
  description: string;
  cover: string;
  gallery: string[];
};

const rowToProject = (r: ProjectRow): Project => ({
  id: r.id,
  title: r.title,
  category: r.category,
  year: r.year,
  location: r.location,
  area: r.area,
  description: r.description,
  cover: r.cover,
  gallery: r.gallery ?? [],
});

async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(rowToProject);
}

export function useProjects() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    placeholderData: initialProjects,
    staleTime: 30_000,
  });

  const upsertMut = useMutation({
    mutationFn: async (p: Project) => {
      const row: ProjectRow = {
        id: p.id,
        title: p.title,
        category: p.category,
        year: p.year,
        location: p.location,
        area: p.area,
        description: p.description,
        cover: p.cover,
        gallery: p.gallery,
      };
      const { error } = await supabase.from("projects").upsert(row, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });

  const removeMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });

  const upsert = useCallback((p: Project) => upsertMut.mutate(p), [upsertMut]);
  const remove = useCallback((id: string) => removeMut.mutate(id), [removeMut]);

  return { projects: data ?? [], upsert, remove };
}

// -------------------- News --------------------

type NewsRow = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  author: string;
  date: string;
  sources: NewsPost["sources"];
};

const rowToNews = (r: NewsRow): NewsPost => ({
  id: r.id,
  title: r.title,
  excerpt: r.excerpt,
  content: r.content,
  cover: r.cover,
  category: r.category,
  author: r.author,
  date: r.date,
  sources: r.sources ?? [],
});

async function fetchNews(): Promise<NewsPost[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as NewsRow[]).map(rowToNews);
}

export function useNews() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    placeholderData: initialNews,
    staleTime: 30_000,
  });

  const upsertMut = useMutation({
    mutationFn: async (n: NewsPost) => {
      const row: NewsRow = {
        id: n.id,
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        cover: n.cover,
        category: n.category,
        author: n.author,
        date: n.date,
        sources: n.sources ?? [],
      };
      const { error } = await supabase.from("news").upsert(row, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });

  const removeMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });

  const upsert = useCallback((n: NewsPost) => upsertMut.mutate(n), [upsertMut]);
  const remove = useCallback((id: string) => removeMut.mutate(id), [removeMut]);

  return { news: data ?? [], upsert, remove };
}

// -------------------- Site Content --------------------

async function fetchContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", SITE_CONTENT_ID)
    .maybeSingle();
  if (error) throw error;
  if (!data) return initialContent;
  return { ...initialContent, ...(data.data as Partial<SiteContent>) };
}

export function useContent() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: fetchContent,
    placeholderData: initialContent,
    staleTime: 30_000,
  });

  const updateMut = useMutation({
    mutationFn: async (patch: Partial<SiteContent>) => {
      const current = qc.getQueryData<SiteContent>(["site_content"]) ?? initialContent;
      const next: SiteContent = { ...current, ...patch };
      const { error } = await supabase
        .from("site_content")
        .upsert({ id: SITE_CONTENT_ID, data: next }, { onConflict: "id" });
      if (error) throw error;
      return next;
    },
    onSuccess: (next) => {
      qc.setQueryData(["site_content"], next);
    },
  });

  const update = useCallback(
    (patch: Partial<SiteContent>) => updateMut.mutate(patch),
    [updateMut],
  );

  return { content: data ?? initialContent, update };
}

// -------------------- Auth --------------------

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { authed: !!session, ready, session, login, logout };
}
