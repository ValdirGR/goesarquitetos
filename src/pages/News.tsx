import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useNews } from "@/store/useStudioStore";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

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

const News = () => {
  const { news } = useNews();
  const sorted = useMemo(() => [...news].sort((a, b) => b.date.localeCompare(a.date)), [news]);
  const [featured, ...rest] = sorted;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const paginated = useMemo(
    () => rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [rest, page],
  );

  const goTo = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Notícias</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-[1.1]">
          Reflexões, projetos e novidades do escritório.
        </h1>
        <p className="mt-6 max-w-2xl text-base md:text-lg text-foreground/70 leading-relaxed">
          Acompanhe artigos, premiações e bastidores do nosso processo de criação em arquitetura, urbanismo e interiores.
        </p>
      </section>

      {featured && (
        <section className="container-editorial pb-16 md:pb-24">
          <Link to={`/noticias/${featured.id}`} className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={featured.cover}
                alt={featured.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
                {featured.category} · {formatDate(featured.date)}
              </p>
              <h2 className="font-serif text-2xl md:text-4xl leading-snug group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="mt-5 text-base md:text-lg text-foreground/75 leading-relaxed">
                {featured.excerpt}
              </p>
              <span className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-foreground/80 border-b border-border pb-2 group-hover:gap-5 group-hover:text-primary transition-all">
                Ler matéria <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className="container-editorial pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 border-t border-border pt-16">
            {paginated.map((n) => (
              <Link key={n.id} to={`/noticias/${n.id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={n.cover}
                    alt={n.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.25em] text-primary">
                  {n.category} · {formatDate(n.date)}
                </p>
                <h3 className="font-serif text-xl md:text-2xl mt-3 leading-snug group-hover:text-primary transition-colors">
                  {n.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">
                  {n.excerpt}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-16">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page > 1) goTo(page - 1); }}
                    className={cn(page === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                {getPageItems(page, totalPages).map((it, i) =>
                  it === "ellipsis" ? (
                    <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={it}>
                      <PaginationLink
                        href="#"
                        isActive={it === page}
                        onClick={(e) => { e.preventDefault(); goTo(it); }}
                      >
                        {it}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page < totalPages) goTo(page + 1); }}
                    className={cn(page === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
      )}
    </>
  );
};

export default News;
