import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/store/useStudioStore";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/data/projects";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Filter = "todos" | ProjectCategory;

const filters: { key: Filter; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "residencial", label: "Residenciais" },
  { key: "comercial", label: "Comerciais" },
];

const PAGE_SIZE = 12;

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

const Projects = () => {
  const { projects } = useProjects();
  const [filter, setFilter] = useState<Filter>("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (filter === "todos" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [filter]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const goTo = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Portfólio</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-[1.1]">
          Projetos pensados sob medida.
        </h1>
      </section>

      <section className="container-editorial pb-24">
        <div className="flex flex-wrap gap-2 md:gap-6 border-b border-border pb-4 mb-12">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "text-sm uppercase tracking-[0.2em] px-1 py-2 transition-colors relative",
                filter === f.key ? "text-primary" : "text-foreground/50 hover:text-foreground",
              )}
            >
              {f.label}
              {filter === f.key && <span className="absolute -bottom-[17px] left-0 right-0 h-px bg-primary" />}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground self-center">{filtered.length} projetos</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((p) => (
            <Link key={p.id} to={`/projetos/${p.id}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category} · {p.year}</p>
                  <h3 className="font-serif text-2xl mt-1 group-hover:text-primary transition-colors">{p.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{p.location}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">Nenhum projeto encontrado.</p>
        )}
      </section>
    </>
  );
};

export default Projects;
